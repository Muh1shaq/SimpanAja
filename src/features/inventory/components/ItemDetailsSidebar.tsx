import { X, TrendingUp, MapPin, BarChart3 } from 'lucide-react';
import type { SKUItem } from '../../../types/inventory';
import { Tag } from '../../../components/common/Tag';
import { formatCurrency, formatNumber } from '../../../utils/format';

interface ItemDetailsSidebarProps {
  item: SKUItem | null;
  onClose: () => void;
}

export function ItemDetailsSidebar({ item, onClose }: ItemDetailsSidebarProps) {
  if (!item) return null;

  return (
    <div className="glass-card p-5 animate-slide-in-right w-full lg:w-[340px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Item Details</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Product Info */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-indigo-400">{item.sku}</span>
          <Tag status={item.status} />
        </div>
        <h4 className="text-base font-semibold text-white">{item.name}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{item.category} · {item.unit}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Stock Value</p>
          <p className="text-sm font-bold text-white">{formatCurrency(item.stockValue)}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Quantity</p>
          <p className="text-sm font-bold text-white">{formatNumber(item.quantity)}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Unit Price</p>
          <p className="text-sm font-bold text-white">${item.price.toFixed(2)}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Turnover</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" />
            <p className="text-sm font-bold text-white">4.2x</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={12} className="text-indigo-400" />
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Location</p>
        </div>
        <p className="text-sm text-white font-medium">
          Zone {item.location.zone} · {item.location.rack} · Shelf {item.location.shelf} · Pos {item.location.position}
        </p>
      </div>

      {/* Stock Level Bars */}
      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart3 size={12} className="text-indigo-400" />
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Stock Level</p>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Current: {item.quantity}</span>
              <span>Max: {item.maxStock}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                style={{ width: `${Math.min(100, (item.quantity / item.maxStock) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-red-400">Min: {item.minStock}</span>
            <span className={item.quantity <= item.minStock ? 'text-red-400 font-semibold' : 'text-slate-500'}>
              {item.quantity <= item.minStock ? '⚠ Below minimum' : 'Above minimum'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
