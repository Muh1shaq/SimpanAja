import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Building2, MapPin, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { Button } from '../../../components/common/Button';

interface Warehouse { id: string; name: string; address: string; }
interface Zone { id: string; warehouse_id: string; name: string; description: string; }
interface Rack { id: string; zone_id: string; name: string; }
interface Bin { id: string; rack_id: string; name: string; barcode: string; }

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

export function LocationMaster() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  // Modal states
  const [modal, setModal] = useState<{ type: 'warehouse' | 'zone' | 'rack' | 'bin'; editing: any } | null>(null);
  const [form, setForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchAll() {
    setIsLoading(true);
    const [wRes, zRes, rRes, bRes] = await Promise.all([
      supabase.from('warehouses').select('*').order('name'),
      supabase.from('zones').select('*').order('name'),
      supabase.from('racks').select('*').order('name'),
      supabase.from('bins').select('*').order('name'),
    ]);
    if (!wRes.error) setWarehouses(wRes.data as Warehouse[]);
    if (!zRes.error) setZones(zRes.data as Zone[]);
    if (!rRes.error) setRacks(rRes.data as Rack[]);
    if (!bRes.error) setBins(bRes.data as Bin[]);
    setIsLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  function openModal(type: 'warehouse' | 'zone' | 'rack' | 'bin', editing: any = null) {
    setModal({ type, editing });
    if (editing) {
      setForm({ ...editing });
    } else {
      if (type === 'warehouse') setForm({ name: '', address: '' });
      if (type === 'zone') setForm({ name: '', description: '', warehouse_id: selectedWarehouse?.id || '' });
      if (type === 'rack') setForm({ name: '', zone_id: selectedZone?.id || '' });
      if (type === 'bin') setForm({ name: '', barcode: '', rack_id: selectedRack?.id || '' });
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setIsSaving(true);
    const table = modal.type === 'bin' ? 'bins' : modal.type === 'rack' ? 'racks' : modal.type === 'zone' ? 'zones' : 'warehouses';
    const payload = { ...form };
    delete payload.id; delete payload.created_at;
    const { error } = modal.editing
      ? await supabase.from(table).update(payload).eq('id', modal.editing.id)
      : await supabase.from(table).insert(payload);
    setIsSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', `${modal.type} berhasil ${modal.editing ? 'diperbarui' : 'ditambahkan'}!`);
    setModal(null);
    fetchAll();
  }

  async function remove(table: string, id: string) {
    if (!confirm('Yakin ingin menghapus item ini?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) showToast('error', error.message);
    else { showToast('success', 'Item dihapus.'); fetchAll(); }
  }

  const filteredZones = zones.filter(z => z.warehouse_id === selectedWarehouse?.id);
  const filteredRacks = racks.filter(r => r.zone_id === selectedZone?.id);
  const filteredBins = bins.filter(b => b.rack_id === selectedRack?.id);

  if (isLoading) return <div className="text-center py-12 text-slate-500 text-sm">Memuat data lokasi...</div>;

  return (
    <div className="space-y-4">
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => { setSelectedWarehouse(null); setSelectedZone(null); setSelectedRack(null); }}
          className={`hover:text-slate-300 transition-colors ${!selectedWarehouse ? 'text-indigo-400' : ''}`}>Gudang</button>
        {selectedWarehouse && (<><ChevronRight size={12} /><button onClick={() => { setSelectedZone(null); setSelectedRack(null); }}
          className={`hover:text-slate-300 transition-colors ${selectedWarehouse && !selectedZone ? 'text-indigo-400' : ''}`}>{selectedWarehouse.name}</button></>)}
        {selectedZone && (<><ChevronRight size={12} /><button onClick={() => setSelectedRack(null)}
          className={`hover:text-slate-300 transition-colors ${selectedZone && !selectedRack ? 'text-indigo-400' : ''}`}>{selectedZone.name}</button></>)}
        {selectedRack && (<><ChevronRight size={12} /><span className="text-indigo-400">{selectedRack.name}</span></>)}
      </div>

      {/* Level: Warehouses */}
      {!selectedWarehouse && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Building2 size={15} /> Daftar Gudang</h3>
            <Button icon={<Plus size={14} />} size="sm" onClick={() => openModal('warehouse')}>Tambah Gudang</Button>
          </div>
          {warehouses.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm"><Building2 size={28} className="mx-auto mb-2 text-slate-700" /> Belum ada gudang.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {warehouses.map(w => (
                <div key={w.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all group"
                  onClick={() => setSelectedWarehouse(w)}>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{w.name}</p>
                    {w.address && <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><MapPin size={10} /> {w.address}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openModal('warehouse', w)} className="text-slate-500 hover:text-indigo-400 p-1 rounded transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => remove('warehouses', w.id)} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"><Trash2 size={13} /></button>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level: Zones */}
      {selectedWarehouse && !selectedZone && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">Zona di {selectedWarehouse.name}</h3>
            <Button icon={<Plus size={14} />} size="sm" onClick={() => openModal('zone')}>Tambah Zona</Button>
          </div>
          {filteredZones.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">Belum ada zona di gudang ini.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredZones.map(z => (
                <div key={z.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all group text-center"
                  onClick={() => setSelectedZone(z)}>
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-bold text-indigo-400">{z.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Zona {z.name}</p>
                  <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal('zone', z)} className="text-slate-500 hover:text-indigo-400 p-1 rounded transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => remove('zones', z.id)} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level: Racks */}
      {selectedZone && !selectedRack && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">Rak di Zona {selectedZone.name}</h3>
            <Button icon={<Plus size={14} />} size="sm" onClick={() => openModal('rack')}>Tambah Rak</Button>
          </div>
          {filteredRacks.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">Belum ada rak di zona ini.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredRacks.map(r => (
                <div key={r.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 cursor-pointer hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all group text-center"
                  onClick={() => setSelectedRack(r)}>
                  <p className="text-sm font-bold text-slate-200">{r.name}</p>
                  <p className="text-xs text-slate-500">Rak</p>
                  <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal('rack', r)} className="text-slate-500 hover:text-indigo-400 p-1 rounded transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => remove('racks', r.id)} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level: Bins */}
      {selectedRack && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">Bin di Rak {selectedRack.name}</h3>
            <Button icon={<Plus size={14} />} size="sm" onClick={() => openModal('bin')}>Tambah Bin</Button>
          </div>
          {filteredBins.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">Belum ada bin di rak ini.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBins.map(b => (
                <div key={b.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center group hover:border-slate-600/50 transition-all">
                  <p className="text-sm font-bold text-slate-200">{b.name}</p>
                  {b.barcode && <p className="text-xs text-slate-500 font-mono mt-0.5">{b.barcode}</p>}
                  <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('bin', b)} className="text-slate-500 hover:text-indigo-400 p-1 rounded transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => remove('bins', b.id)} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="font-semibold text-white capitalize">
                {modal.editing ? 'Edit' : 'Tambah'} {modal.type === 'warehouse' ? 'Gudang' : modal.type === 'zone' ? 'Zona' : modal.type === 'rack' ? 'Rak' : 'Bin'}
              </h3>
              <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama *</label>
                <input value={form.name || ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder={modal.type === 'warehouse' ? 'Gudang Utama' : modal.type === 'zone' ? 'A' : modal.type === 'rack' ? 'R1' : 'B01'} />
              </div>
              {(modal.type === 'warehouse' || modal.type === 'zone') && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">{modal.type === 'warehouse' ? 'Alamat' : 'Deskripsi'}</label>
                  <textarea value={form.address || form.description || ''} onChange={e => setForm((f: any) => ({ ...f, [modal.type === 'warehouse' ? 'address' : 'description']: e.target.value }))} rows={2}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                </div>
              )}
              {modal.type === 'bin' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Barcode</label>
                  <input value={form.barcode || ''} onChange={e => setForm((f: any) => ({ ...f, barcode: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono" placeholder="BIN-A-R1-B01" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setModal(null)}>Batal</Button>
                <Button type="submit" size="sm" isLoading={isSaving}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
