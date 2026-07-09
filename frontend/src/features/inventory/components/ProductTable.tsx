import { useState } from 'react';
import type { SKUItem } from '../../../types/inventory';
import { Tag } from '../../../components/common/Tag';
import { formatCurrency } from '../../../utils/format';
import { Input } from '../../../components/common/Input';
import { Printer } from 'lucide-react';
import { BarcodeGenerator } from '../../../components/common/BarcodeGenerator';

interface ProductTableProps {
  products: SKUItem[];
  onProductClick: (product: SKUItem) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function ProductTable({ products, onProductClick, searchValue, onSearchChange }: ProductTableProps) {
  const [printProduct, setPrintProduct] = useState<SKUItem | null>(null);

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Product Catalog</h3>
        <div className="w-64">
          <Input
            variant="search"
            placeholder="Search products..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="pb-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
              <th className="pb-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr
                key={product.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <td className="py-3 pr-4" onClick={() => onProductClick(product)}>
                  <span className="font-mono text-xs font-semibold text-indigo-400">{product.sku}</span>
                </td>
                <td className="py-3 pr-4 text-slate-200 text-xs font-medium" onClick={() => onProductClick(product)}>{product.name}</td>
                <td className="py-3 pr-4 text-slate-400 text-xs" onClick={() => onProductClick(product)}>{product.category}</td>
                <td className="py-3 pr-4 text-right text-slate-300 text-xs font-medium" onClick={() => onProductClick(product)}>{product.quantity.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right text-slate-300 text-xs" onClick={() => onProductClick(product)}>{formatCurrency(product.stockValue)}</td>
                <td className="py-3 pr-4 text-xs text-slate-400" onClick={() => onProductClick(product)}>
                  {product.location.zone}-{product.location.rack}-{product.location.bin}
                </td>
                <td className="py-3" onClick={() => onProductClick(product)}>
                  <Tag status={product.status} />
                </td>
                <td className="py-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPrintProduct(product); }} 
                    className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                    title="Cetak Label"
                  >
                    <Printer size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {printProduct && (
        <BarcodeGenerator
          value={printProduct.sku}
          title={printProduct.name}
          subtitle={`SKU: ${printProduct.sku}`}
          type="barcode"
          onClose={() => setPrintProduct(null)}
        />
      )}
    </div>
  );
}
