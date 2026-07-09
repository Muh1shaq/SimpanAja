import { Package, AlertTriangle, ArrowDownToLine, Gauge } from 'lucide-react';
import type { CatalogSummary as CatalogSummaryType } from '../../../types/inventory';
import { formatNumber, formatPercent } from '../../../utils/format';

interface CatalogSummaryProps {
  summary: CatalogSummaryType;
}

const cards = [
  { key: 'totalSKU', title: 'Total SKU', icon: <Package size={18} />, gradient: 'from-indigo-500 to-purple-600', format: formatNumber },
  { key: 'lowStockCount', title: 'Low Stock', icon: <AlertTriangle size={18} />, gradient: 'from-amber-500 to-orange-600', format: formatNumber },
  { key: 'inboundToday', title: 'Inbound Today', icon: <ArrowDownToLine size={18} />, gradient: 'from-emerald-500 to-teal-600', format: formatNumber },
  { key: 'pickingRate', title: 'Picking Rate', icon: <Gauge size={18} />, gradient: 'from-cyan-500 to-blue-600', format: (v: number) => formatPercent(v) },
] as const;

export function CatalogSummary({ summary }: CatalogSummaryProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card, idx) => (
        <div
          key={card.key}
          className="glass-card glass-card-hover p-4 animate-slide-up"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient}`}>
              <span className="text-white">{card.icon}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {card.format(summary[card.key])}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{card.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
