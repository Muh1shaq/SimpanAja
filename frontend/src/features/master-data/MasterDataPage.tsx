import { useState } from 'react';
import { Database, Package, Truck, LayoutTemplate } from 'lucide-react';
import { ProductMaster } from './components/ProductMaster';
import { SupplierMaster } from './components/SupplierMaster';
import { LocationMaster } from './components/LocationMaster';

type Tab = 'products' | 'suppliers' | 'locations';

const TABS = [
  { id: 'products', label: 'Produk & Kategori', icon: Package },
  { id: 'suppliers', label: 'Supplier', icon: Truck },
  { id: 'locations', label: 'Lokasi Gudang', icon: LayoutTemplate },
] as const;

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<Tab>('products');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Database size={24} className="text-indigo-400" />
          Master Data
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Kelola entitas inti warehouse: produk, supplier, dan lokasi</p>
      </div>

      <div className="flex space-x-1 border-b border-slate-700/50">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`master-data-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-400 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card p-6">
        {activeTab === 'products' && <ProductMaster />}
        {activeTab === 'suppliers' && <SupplierMaster />}
        {activeTab === 'locations' && <LocationMaster />}
      </div>
    </div>
  );
}
