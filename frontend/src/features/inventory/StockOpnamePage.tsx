import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Search, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface OpnameItem {
  inventory_id: string;
  product_id: string;
  sku: string;
  name: string;
  system_qty: number;
  actual_qty: number | '';
  bin_name: string;
  is_scanned: boolean;
}

export default function StockOpnamePage() {
  const [items, setItems] = useState<OpnameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        id,
        quantity,
        product_id,
        products (sku, name),
        bins (name)
      `);
      
    if (!error && data) {
      setItems(data.map((inv: any) => ({
        inventory_id: inv.id,
        product_id: inv.product_id,
        sku: inv.products?.sku || '',
        name: inv.products?.name || '',
        system_qty: inv.quantity || 0,
        actual_qty: '',
        bin_name: inv.bins?.name || 'Unbinned',
        is_scanned: false
      })));
    }
    setIsLoading(false);
  }

  const handleQtyChange = (inventory_id: string, val: string) => {
    const num = val === '' ? '' : parseInt(val, 10);
    setItems(prev => prev.map(item => 
      item.inventory_id === inventory_id ? { ...item, actual_qty: num, is_scanned: true } : item
    ));
  };

  const saveOpname = async () => {
    const adjustedItems = items.filter(item => item.actual_qty !== '' && item.actual_qty !== item.system_qty);
    if (adjustedItems.length === 0) {
      setToast({ type: 'success', msg: 'Tidak ada selisih yang perlu disesuaikan.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsSaving(true);
    try {
      // Create adjustment transaction
      const trxCode = `ADJ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 1000)}`;
      const { data: trxData, error: trxError } = await supabase.from('transactions').insert({
        trx_code: trxCode,
        type: 'adjustment',
        status: 'completed',
        notes: 'Stock Opname Adjustment'
      }).select().single();

      if (trxError) throw trxError;

      const movements = [];
      for (const item of adjustedItems) {
        const diff = (item.actual_qty as number) - item.system_qty;
        
        // Update inventory
        await supabase.from('inventory')
          .update({ quantity: item.actual_qty })
          .eq('id', item.inventory_id);

        // Record stock movement
        movements.push({
          inventory_id: item.inventory_id,
          transaction_id: trxData.id,
          type: diff > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(diff),
          previous_qty: item.system_qty,
          new_qty: item.actual_qty,
          reason: 'Stock Opname'
        });
      }

      await supabase.from('stock_movements').insert(movements);

      setToast({ type: 'success', msg: `Berhasil menyesuaikan ${adjustedItems.length} item.` });
      fetchInventory();
    } catch (err: any) {
      setToast({ type: 'error', msg: err.message });
    }
    setIsSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems = items.filter(item => 
    item.sku.toLowerCase().includes(search.toLowerCase()) || 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg ${toast.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Stock Opname</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pencocokan stok fisik dengan sistem</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<RefreshCw size={14} />} variant="secondary" onClick={fetchInventory}>Refresh Data</Button>
          <Button icon={<Save size={14} />} onClick={saveOpname} isLoading={isSaving}>Simpan Penyesuaian</Button>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari SKU atau Nama Produk..."
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Memuat data inventaris...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase">Bin/Rak</th>
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase">SKU</th>
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase">Produk</th>
                  <th className="pb-3 text-center text-xs font-semibold text-slate-500 uppercase">Stok Sistem</th>
                  <th className="pb-3 text-center text-xs font-semibold text-slate-500 uppercase w-32">Stok Fisik</th>
                  <th className="pb-3 text-center text-xs font-semibold text-slate-500 uppercase">Selisih</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const diff = item.actual_qty === '' ? 0 : (item.actual_qty as number) - item.system_qty;
                  return (
                    <tr key={item.inventory_id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="py-3 pr-4 text-xs text-slate-400">{item.bin_name}</td>
                      <td className="py-3 pr-4 text-xs font-mono text-indigo-400">{item.sku}</td>
                      <td className="py-3 pr-4 text-xs font-medium text-slate-200">{item.name}</td>
                      <td className="py-3 px-4 text-center text-xs text-slate-400 font-bold">{item.system_qty}</td>
                      <td className="py-3 px-4">
                        <input 
                          type="number"
                          min="0"
                          value={item.actual_qty}
                          onChange={(e) => handleQtyChange(item.inventory_id, e.target.value)}
                          className={`w-full bg-slate-800 border rounded-lg px-2 py-1 text-center text-sm font-bold focus:outline-none focus:border-indigo-500 ${item.is_scanned && item.actual_qty !== item.system_qty ? 'border-orange-500/50 text-orange-400' : 'border-slate-700 text-slate-200'}`}
                        />
                      </td>
                      <td className="py-3 text-center">
                        {item.actual_qty !== '' && diff !== 0 ? (
                           <span className={`text-xs font-bold ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                             {diff > 0 ? '+' : ''}{diff}
                           </span>
                        ) : (
                           <span className="text-xs text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
