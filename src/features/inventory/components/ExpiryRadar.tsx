import { AlertTriangle, Clock, Trash2, ClipboardCheck } from 'lucide-react';
import type { ExpiryAlert } from '../../../types/inventory';
import { Button } from '../../../components/common/Button';

interface ExpiryRadarProps {
  alerts: ExpiryAlert[];
}

const severityStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  urgent: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400' },
  notice: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' },
};

export function ExpiryRadar({ alerts }: ExpiryRadarProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Expiry Radar</h3>
        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-semibold">
          {alerts.length} alerts
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => {
          const style = severityStyles[alert.severity];
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${style.bg} ${style.border} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-indigo-400">{alert.sku}</span>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{alert.productName}</p>
                </div>
                <div className={`flex items-center gap-1 ${style.text}`}>
                  <Clock size={12} />
                  <span className="text-xs font-semibold">
                    {alert.remainingHours <= 24
                      ? `${alert.remainingHours}h left`
                      : `${Math.ceil(alert.remainingHours / 24)} days left`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-[10px] text-slate-500">
                  Qty: <span className="text-slate-300">{alert.quantity}</span> ·
                  Zone {alert.location.zone}-{alert.location.rack}
                </div>
                <div className="flex gap-1.5">
                  {alert.actions.includes('audit') && (
                    <Button variant="ghost" size="sm" icon={<ClipboardCheck size={12} />}>
                      Audit
                    </Button>
                  )}
                  {alert.actions.includes('dispose') && (
                    <Button variant="danger" size="sm" icon={<Trash2 size={12} />}>
                      Dispose
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
