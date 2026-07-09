import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Zap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { MetricCard } from '../../../types/dashboard';

const iconMap: Record<string, React.ReactNode> = {
  Package: <Package size={22} />,
  ArrowDownToLine: <ArrowDownToLine size={22} />,
  ArrowUpFromLine: <ArrowUpFromLine size={22} />,
  Zap: <Zap size={22} />,
};

const gradientMap: Record<string, string> = {
  Package: 'from-indigo-500 to-purple-600',
  ArrowDownToLine: 'from-emerald-500 to-teal-600',
  ArrowUpFromLine: 'from-amber-500 to-orange-600',
  Zap: 'from-cyan-500 to-blue-600',
};

interface OverviewCardsProps {
  metrics: MetricCard[];
}

export function OverviewCards({ metrics }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={metric.id}
          className="glass-card glass-card-hover p-5 animate-slide-up"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientMap[metric.icon]} shadow-lg`}>
              <span className="text-white">{iconMap[metric.icon]}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
          <p className="text-xs text-slate-500">{metric.title} · {metric.changeLabel}</p>
        </div>
      ))}
    </div>
  );
}
