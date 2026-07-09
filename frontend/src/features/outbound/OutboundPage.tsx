import { useState, useEffect, FormEvent } from 'react';
import {
  ArrowUpFromLine, Plus, Search, ChevronDown, Package, CheckCircle, Clock,
  XCircle, Truck, AlertCircle, X, Trash2, ListChecks, Eye
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { Button } from '../../components/common/Button';

interface Product {
  id: string; sku: string; name: string; unit: string;
}

interface TransactionItem {
  id?: string;
  product_id: string;
  product?: Product;
  products?: Product;
  expected_qty: number;
  actual_qty: number;
  bin_id?: string;
  batch_number?: string;
}

interface Transaction {
  id: string;
  trx_code: string;
  type: string;
  status: string;
  reference_no: string;
  notes: string;
  created_at: string;
  transaction_items: TransactionItem[];
}

type Toast = { type: 'success' | 'error'; message: string } | null;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20', icon: Clock },
  processing: { label: 'Diproses', color: 'text-blue-400 bg-blue-400/10 border-blue-500/20', icon: Truck },
  completed:  { label: 'Selesai', color: 'text-green-400 bg-green-400/10 border-green-500/20', icon: CheckCircle },
  cancelled:  { label: 'Dibatalkan', color: 'text-red-400 bg-red-400/10 border-red-500/20', icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium ${cfg.color}`}>
      <Icon size={11} />{cfg.label}
    </span>
  );
}

function ToastMessage({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up
      ${toast.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-red-500/20 border border-red-500/30 text-red-400'}`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-2"><X size={14} /></button>
    </div>
  );
}

export default function OutboundPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Transaction | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Create form state
  const [form, setForm] = useState({ reference_no: '', notes: '' });
  const [lineItems, setLineItems] = useState<TransactionItem[]>([
    { product_id: '', expected_qty: 1, actual_qty: 0 }
  ]);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchData() {
    setIsLoading(true);
    const [txRes, prodRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('*, transaction_items(*, products(id, sku, name, unit))')
        .eq('type', 'outbound')
        .order('created_at', { ascending: false }),
      supabase.from('products').select('id, sku, name, unit').order('name'),
    ]);
    if (!txRes.error) setTransactions(txRes.data as Transaction[]);
    if (!prodRes.error) setProducts(prodRes.data as Product[]);
    setIsLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function generateTrxCode() {
    const now = new Date();
    const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `OUT-${ymd}-${rand}`;
  }

  async function createOutbound(e: FormEvent) {
    e.preventDefault();
    const validItems = lineItems.filter(i => i.product_id && i.expected_qty > 0);
    if (validItems.length === 0) { showToast('error', 'Tambahkan minimal satu item!'); return; }

    setIsSaving(true);
    const trxCode = generateTrxCode();

    // Insert transaction header
    const { data: trxData, error: trxError } = await supabase
      .from('transactions')
      .insert({ trx_code: trxCode, type: 'outbound', status: 'pending', ...form })
      .select()
      .single();

    if (trxError) { showToast('error', trxError.message); setIsSaving(false); return; }

    // Insert line items
    const items = validItems.map(i => ({
      transaction_id: trxData.id,
      product_id: i.product_id,
      expected_qty: i.expected_qty,
      actual_qty: 0,
    }));

    const { error: itemsError } = await supabase.from('transaction_items').insert(items);
    setIsSaving(false);

    if (itemsError) { showToast('error', itemsError.message); return; }
    showToast('success', `Outbound ${trxCode} berhasil dibuat!`);
    setShowCreateModal(false);
    setForm({ reference_no: '', notes: '' });
    setLineItems([{ product_id: '', expected_qty: 1, actual_qty: 0 }]);
    fetchData();
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('transactions').update({ status }).eq('id', id);
    if (error) showToast('error', error.message);
    else { showToast('success', 'Status diperbarui!'); fetchData(); setShowDetailModal(null); }
  }

  const filtered = transactions.filter(t => {
    const matchSearch = t.trx_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.reference_no || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const stats = {
    total: transactions.length,
    pending: transactions.filter(t => t.status === 'pending').length,
    processing: transactions.filter(t => t.status === 'processing').length,
    completed: transactions.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowUpFromLine size={22} className="text-orange-400" />
            Outbound — Pengiriman Keluar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola picking list dan pengiriman barang keluar</p>
        </div>
        <Button icon={<Plus size={14} />} onClick={() => setShowCreateModal(true)}>Buat Outbound</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-300', bg: 'bg-slate-800/40' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400', bg: 'bg-yellow-400/5 border border-yellow-500/10' },
          { label: 'Diproses', value: stats.processing, color: 'text-blue-400', bg: 'bg-blue-400/5 border border-blue-500/10' },
          { label: 'Selesai', value: stats.completed, color: 'text-green-400', bg: 'bg-green-400/5 border border-green-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari kode / referensi..."
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-800/60 border border-slate-700/50 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Diproses</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-5">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Memuat data outbound...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            <ListChecks size={32} className="mx-auto mb-3 text-slate-700" />
            Belum ada outbound. Klik "Buat Outbound" untuk mulai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Kode Transaksi', 'Referensi (SO)', 'Tgl Dibuat', 'Jml Item', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-orange-400 font-semibold">{t.trx_code}</td>
                    <td className="py-3 pr-4 text-slate-300 text-xs">{t.reference_no || '-'}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{new Date(t.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 pr-4 text-slate-300 text-xs">{t.transaction_items?.length || 0} item</td>
                    <td className="py-3 pr-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3">
                      <button onClick={() => setShowDetailModal(t)} className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900 z-10">
              <h3 className="font-semibold text-white flex items-center gap-2"><ArrowUpFromLine size={16} className="text-orange-400" /> Buat Picking List Outbound</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={createOutbound} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">No. Sales Order (SO)</label>
                  <input value={form.reference_no} onChange={e => setForm(f => ({ ...f, reference_no: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="SO-2024-001" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Catatan</label>
                  <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="Catatan tambahan..." />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Picking List</label>
                  <button type="button" onClick={() => setLineItems(l => [...l, { product_id: '', expected_qty: 1, actual_qty: 0 }])}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <Plus size={12} /> Tambah Item
                  </button>
                </div>
                <div className="space-y-2">
                  {lineItems.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select value={item.product_id} onChange={e => setLineItems(l => l.map((it, idx) => idx === i ? { ...it, product_id: e.target.value } : it))}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all">
                        <option value="">-- Pilih Produk --</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                      </select>
                      <input type="number" min="1" value={item.expected_qty}
                        onChange={e => setLineItems(l => l.map((it, idx) => idx === i ? { ...it, expected_qty: Number(e.target.value) } : it))}
                        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all text-center" />
                      <button type="button" onClick={() => setLineItems(l => l.filter((_, idx) => idx !== i))} disabled={lineItems.length === 1}
                        className="text-slate-600 hover:text-red-400 transition-colors disabled:opacity-30 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>Batal</Button>
                <Button type="submit" size="sm" isLoading={isSaving} icon={<ArrowUpFromLine size={14} />}>Buat Picking List</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900 z-10">
              <div>
                <h3 className="font-semibold text-white font-mono">{showDetailModal.trx_code}</h3>
                <StatusBadge status={showDetailModal.status} />
              </div>
              <button onClick={() => setShowDetailModal(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {showDetailModal.reference_no && (
                <div className="text-xs text-slate-500">Referensi SO: <span className="text-slate-300">{showDetailModal.reference_no}</span></div>
              )}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Picking List Items</p>
                <div className="space-y-2">
                  {(showDetailModal.transaction_items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{item.products?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500 font-mono">{item.products?.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-200">{item.expected_qty} {item.products?.unit || 'pcs'}</p>
                        <p className="text-xs text-slate-500">Diambil: {item.actual_qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showDetailModal.status !== 'completed' && showDetailModal.status !== 'cancelled' && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {showDetailModal.status === 'pending' && (
                    <Button size="sm" icon={<Truck size={13} />} onClick={() => updateStatus(showDetailModal.id, 'processing')}>
                      Mulai Proses
                    </Button>
                  )}
                  {showDetailModal.status === 'processing' && (
                    <Button size="sm" variant="success" icon={<CheckCircle size={13} />} onClick={() => updateStatus(showDetailModal.id, 'completed')}>
                      Selesaikan
                    </Button>
                  )}
                  <Button size="sm" variant="danger" icon={<XCircle size={13} />} onClick={() => updateStatus(showDetailModal.id, 'cancelled')}>
                    Batalkan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
