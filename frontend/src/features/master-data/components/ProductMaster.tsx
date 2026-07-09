import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Package, Tag, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { Button } from '../../../components/common/Button';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category_id: string;
  unit: string;
  price: number;
  min_stock: number;
  photo_url: string;
  created_at: string;
  categories?: { name: string };
}

const emptyProduct: Omit<Product, 'id' | 'created_at' | 'categories'> = {
  sku: '', name: '', description: '', category_id: '', unit: 'pcs', price: 0, min_stock: 0, photo_url: '',
};

const emptyCategory: Omit<Category, 'id'> = { name: '', description: '' };

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

export function ProductMaster() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories'>('products');

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchData() {
    setIsLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('name'),
      supabase.from('categories').select('*').order('name'),
    ]);
    if (!prodRes.error) setProducts(prodRes.data as Product[]);
    if (!catRes.error) setCategories(catRes.data as Category[]);
    setIsLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  // ===== Product CRUD =====
  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductModal(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({ sku: p.sku, name: p.name, description: p.description || '', category_id: p.category_id || '', unit: p.unit, price: p.price, min_stock: p.min_stock, photo_url: p.photo_url || '' });
    setShowProductModal(true);
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...productForm, price: Number(productForm.price), min_stock: Number(productForm.min_stock) };
    const { error } = editingProduct
      ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
      : await supabase.from('products').insert(payload);
    setIsSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', editingProduct ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!');
    setShowProductModal(false);
    fetchData();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) showToast('error', error.message);
    else { showToast('success', 'Produk dihapus.'); fetchData(); }
  }

  // ===== Category CRUD =====
  function openAddCategory() {
    setEditingCategory(null);
    setCategoryForm(emptyCategory);
    setShowCategoryModal(true);
  }

  function openEditCategory(c: Category) {
    setEditingCategory(c);
    setCategoryForm({ name: c.name, description: c.description || '' });
    setShowCategoryModal(true);
  }

  async function saveCategory(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const { error } = editingCategory
      ? await supabase.from('categories').update(categoryForm).eq('id', editingCategory.id)
      : await supabase.from('categories').insert(categoryForm);
    setIsSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', editingCategory ? 'Kategori diperbarui!' : 'Kategori ditambahkan!');
    setShowCategoryModal(false);
    fetchData();
  }

  async function deleteCategory(id: string) {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) showToast('error', error.message);
    else { showToast('success', 'Kategori dihapus.'); fetchData(); }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-slate-700/50">
        {[{ key: 'products', label: 'Produk', icon: <Package size={14} /> }, { key: 'categories', label: 'Kategori', icon: <Tag size={14} /> }].map(t => (
          <button key={t.key} onClick={() => setActiveSubTab(t.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeSubTab === t.key ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'products' && (
        <>
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari produk / SKU..."
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
            <Button icon={<Plus size={14} />} size="sm" onClick={openAddProduct}>Tambah Produk</Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Memuat data...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Package size={32} className="mx-auto mb-3 text-slate-700" />
              Belum ada produk. Klik "Tambah Produk" untuk mulai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    {['SKU', 'Nama Produk', 'Kategori', 'Unit', 'Harga', 'Min Stok', 'Aksi'].map(h => (
                      <th key={h} className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-indigo-400 font-semibold">{p.sku}</td>
                      <td className="py-3 pr-4 text-slate-200 text-xs font-medium">{p.name}</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{p.categories?.name || '-'}</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{p.unit}</td>
                      <td className="py-3 pr-4 text-slate-300 text-xs">Rp {p.price?.toLocaleString('id-ID')}</td>
                      <td className="py-3 pr-4 text-slate-300 text-xs">{p.min_stock}</td>
                      <td className="py-3 flex gap-2">
                        <button onClick={() => openEditProduct(p)} className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded"><Pencil size={14} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeSubTab === 'categories' && (
        <>
          <div className="flex justify-end">
            <Button icon={<Plus size={14} />} size="sm" onClick={openAddCategory}>Tambah Kategori</Button>
          </div>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">Belum ada kategori.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(c => (
                <div key={c.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-start justify-between group hover:border-slate-600/50 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{c.name}</p>
                    {c.description && <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditCategory(c)} className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded"><Pencil size={13} /></button>
                    <button onClick={() => deleteCategory(c.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="font-semibold text-white">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={saveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">SKU *</label>
                  <input value={productForm.sku} onChange={e => setProductForm(f => ({ ...f, sku: e.target.value }))} required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="PRD-001" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Unit *</label>
                  <select value={productForm.unit} onChange={e => setProductForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all">
                    {['pcs', 'box', 'kg', 'liter', 'carton', 'pack', 'roll', 'set'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Produk *</label>
                <input value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="Nama produk lengkap" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Kategori</label>
                <select value={productForm.category_id} onChange={e => setProductForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all">
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Harga (Rp)</label>
                  <input type="number" min="0" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Minimum Stok</label>
                  <input type="number" min="0" value={productForm.min_stock} onChange={e => setProductForm(f => ({ ...f, min_stock: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Deskripsi</label>
                <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none" placeholder="Deskripsi produk..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowProductModal(false)}>Batal</Button>
                <Button type="submit" size="sm" isLoading={isSaving}>{editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="font-semibold text-white">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={saveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Kategori *</label>
                <input value={categoryForm.name} onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="e.g. Elektronik, Makanan" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Deskripsi</label>
                <textarea value={categoryForm.description} onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowCategoryModal(false)}>Batal</Button>
                <Button type="submit" size="sm" isLoading={isSaving}>{editingCategory ? 'Simpan' : 'Tambah'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
