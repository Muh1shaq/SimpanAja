import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Truck, Search, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { Button } from '../../../components/common/Button';

interface Supplier {
  id: string;
  name: string;
  contact_name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

const emptySupplier: Omit<Supplier, 'id' | 'created_at'> = { name: '', contact_name: '', phone: '', email: '', address: '' };

type Toast = { type: 'success' | 'error'; message: string } | null;

function ToastMessage({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up
      ${toast.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-red-500/20 border border-red-500/30 text-red-400'}`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity"><X size={14} /></button>
    </div>
  );
}

export function SupplierMaster() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptySupplier);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchData() {
    setIsLoading(true);
    const { data, error } = await supabase.from('suppliers').select('*').order('name');
    if (!error) setSuppliers(data as Supplier[]);
    setIsLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function openAdd() {
    setEditingSupplier(null);
    setForm(emptySupplier);
    setShowModal(true);
  }

  function openEdit(s: Supplier) {
    setEditingSupplier(s);
    setForm({ name: s.name, contact_name: s.contact_name || '', phone: s.phone || '', email: s.email || '', address: s.address || '' });
    setShowModal(true);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const { error } = editingSupplier
      ? await supabase.from('suppliers').update(form).eq('id', editingSupplier.id)
      : await supabase.from('suppliers').insert(form);
    setIsSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', editingSupplier ? 'Supplier diperbarui!' : 'Supplier ditambahkan!');
    setShowModal(false);
    fetchData();
  }

  async function remove(id: string) {
    if (!confirm('Yakin ingin menghapus supplier ini?')) return;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) showToast('error', error.message);
    else { showToast('success', 'Supplier dihapus.'); fetchData(); }
  }

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.contact_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari supplier..."
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <Button icon={<Plus size={14} />} size="sm" onClick={openAdd}>Tambah Supplier</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          <Truck size={32} className="mx-auto mb-3 text-slate-700" />
          Belum ada supplier. Klik "Tambah Supplier" untuk mulai.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3 hover:border-slate-600/50 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{s.name}</p>
                  {s.contact_name && <p className="text-xs text-slate-500 mt-0.5">{s.contact_name}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(s)} className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded"><Pencil size={13} /></button>
                  <button onClick={() => remove(s.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="space-y-1.5">
                {s.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone size={11} className="text-slate-600" /> {s.phone}
                  </div>
                )}
                {s.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail size={11} className="text-slate-600" /> {s.email}
                  </div>
                )}
                {s.address && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={11} className="text-slate-600" /> {s.address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="font-semibold text-white">{editingSupplier ? 'Edit Supplier' : 'Tambah Supplier'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Perusahaan *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="PT. Supplier Jaya" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Kontak</label>
                <input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="Budi Santoso" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">No. Telepon</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="08123456789" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="supplier@mail.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Alamat</label>
                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none" placeholder="Jl. Contoh No. 1, Jakarta" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" size="sm" isLoading={isSaving}>{editingSupplier ? 'Simpan Perubahan' : 'Tambah Supplier'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
