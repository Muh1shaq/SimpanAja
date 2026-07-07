import { Check, AlertTriangle, Clock } from 'lucide-react';
import type { POLineItem } from '../../../types/logistics';
import { Tag } from '../../../components/common/Tag';

interface LineItemsListProps {
  items: POLineItem[];
  onVerify: (id: string) => void;
}

export function LineItemsList({ items, onVerify }: LineItemsListProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Line Items</h3>
        <span className="text-xs text-slate-500">
          {items.filter(i => i.status === 'verified').length}/{items.length} verified
        </span>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${
              item.status === 'verified'
                ? 'bg-green-500/5 border-green-500/20'
                : item.status === 'discrepancy'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              item.status === 'verified' ? 'bg-green-500/20 text-green-400' :
              item.status === 'discrepancy' ? 'bg-red-500/20 text-red-400' :
              'bg-slate-700/50 text-slate-500'
            }`}>
              {item.status === 'verified' ? <Check size={16} /> :
               item.status === 'discrepancy' ? <AlertTriangle size={16} /> :
               <Clock size={16} />}
            </div>

            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400">{item.sku}</span>
                <Tag status={item.status} />
              </div>
              <p className="text-sm text-slate-200 truncate mt-0.5">{item.productName}</p>
              {item.notes && (
                <p className="text-xs text-red-400 mt-0.5">⚠ {item.notes}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-white">
                {item.verifiedQty}<span className="text-slate-500">/{item.expectedQty}</span>
              </p>
              <p className="text-[10px] text-slate-500 uppercase">units</p>
            </div>

            {/* Verify Button */}
            {item.status === 'pending' && (
              <button
                onClick={() => onVerify(item.id)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-colors"
              >
                Verify
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
