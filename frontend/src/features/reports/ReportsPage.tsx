import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Button } from '../../components/common/Button';
import { FileText, FileSpreadsheet, Download, TrendingUp, AlertTriangle, ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    products: [] as any[],
    transactions: [] as any[]
  });

  useEffect(() => {
    async function fetchReportData() {
      setIsLoading(true);
      const [prodRes, txRes] = await Promise.all([
        supabase.from('products').select('*, inventory(quantity)').order('name'),
        supabase.from('transactions').select('*, transaction_items(*, products(sku, name))').order('created_at', { ascending: false })
      ]);
      
      const productsWithQty = (prodRes.data || []).map(p => ({
        ...p,
        totalQty: p.inventory.reduce((sum: number, inv: any) => sum + (inv.quantity || 0), 0)
      }));

      setData({
        products: productsWithQty,
        transactions: txRes.data || []
      });
      setIsLoading(false);
    }
    fetchReportData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('SimpanAja - Laporan Inventaris', 14, 15);
    
    const tableData = data.products.map(p => [
      p.sku,
      p.name,
      p.category_id || '-',
      p.totalQty,
      p.min_stock
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['SKU', 'Nama Produk', 'Kategori', 'Total Stok', 'Min Stok']],
      body: tableData,
    });
    
    doc.save(`Laporan_Inventaris_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.products.map(p => ({
      SKU: p.sku,
      'Nama Produk': p.name,
      'Total Stok': p.totalQty,
      'Min Stok': p.min_stock,
      Harga: p.price
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventaris");
    XLSX.writeFile(wb, `Laporan_Inventaris_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const lowStockProducts = data.products.filter(p => p.totalQty <= p.min_stock);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Laporan & Analitik</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan performa gudang dan ekspor data</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileText size={16} />} variant="secondary" onClick={exportPDF}>Export PDF</Button>
          <Button icon={<FileSpreadsheet size={16} />} onClick={exportExcel}>Export Excel</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Memuat laporan...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <div className="glass-card p-5">
            <h3 className="text-md font-semibold text-white flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-400" /> Barang Low Stock
            </h3>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-slate-500">Semua stok aman.</p>
              ) : (
                lowStockProducts.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{p.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-400">{p.totalQty} {p.unit}</p>
                      <p className="text-xs text-slate-500">Min: {p.min_stock}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Overview */}
          <div className="glass-card p-5">
             <h3 className="text-md font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-blue-400" /> Aktivitas Terbaru
            </h3>
            <div className="space-y-3">
              {data.transactions.slice(0, 5).map((t, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      {t.type === 'inbound' ? 
                        <div className="p-2 bg-green-500/20 rounded text-green-400"><ArrowDownFromLine size={14} /></div> : 
                        <div className="p-2 bg-orange-500/20 rounded text-orange-400"><ArrowUpFromLine size={14} /></div>
                      }
                      <div>
                        <p className="text-sm font-medium text-white font-mono">{t.trx_code}</p>
                        <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-300">{t.transaction_items?.length || 0} items</p>
                      <p className="text-xs text-slate-500 uppercase">{t.status}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
