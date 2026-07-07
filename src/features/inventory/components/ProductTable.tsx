import type { SKUItem } from '../../../types/inventory';
import { Tag } from '../../../components/common/Tag';
import { formatCurrency } from '../../../utils/format';
import { Input } from '../../../components/common/Input';

interface ProductTableProps {
  products: SKUItem[];
  onProductClick: (product: SKUItem) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function ProductTable({ products, onProductClick, searchValue, onSearchChange }: ProductTableProps) {
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
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr
                key={product.id}
                onClick={() => onProductClick(product)}
                className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <td className="py-3 pr-4">
                  <span className="font-mono text-xs font-semibold text-indigo-400">{product.sku}</span>
                </td>
                <td className="py-3 pr-4 text-slate-200 text-xs font-medium">{product.name}</td>
                <td className="py-3 pr-4 text-slate-400 text-xs">{product.category}</td>
                <td className="py-3 pr-4 text-right text-slate-300 text-xs font-medium">{product.quantity.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right text-slate-300 text-xs">{formatCurrency(product.stockValue)}</td>
                <td className="py-3 pr-4 text-xs text-slate-400">
                  {product.location.zone}-{product.location.rack}
                </td>
                <td className="py-3">
                  <Tag status={product.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
