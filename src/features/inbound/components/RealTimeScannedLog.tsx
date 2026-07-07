import { Check, X, ScanLine, Pencil } from 'lucide-react';
import type { ScannedLogEntry } from '../../../types/logistics';
import { formatTime } from '../../../utils/format';

interface RealTimeScannedLogProps {
  entries: ScannedLogEntry[];
}

const actionIcons: Record<string, React.ReactNode> = {
  verified: <Check size={12} />,
  scanned: <ScanLine size={12} />,
  rejected: <X size={12} />,
  manual_entry: <Pencil size={12} />,
};

const actionColors: Record<string, string> = {
  verified: 'text-green-400 bg-green-500/20 border-green-500/30',
  scanned: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  rejected: 'text-red-400 bg-red-500/20 border-red-500/30',
  manual_entry: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
};

export function RealTimeScannedLog({ entries }: RealTimeScannedLogProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Scanned Log</h3>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
            {entries.length} entries
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Real-time
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className="relative flex gap-3 animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Timeline line */}
            {idx < entries.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-700/50" />
            )}

            {/* Action icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${actionColors[entry.action]}`}>
              {actionIcons[entry.action]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-mono text-indigo-400">{entry.sku}</span>
                <span className="text-[10px] text-slate-600">·</span>
                <span className="text-[10px] text-slate-500 font-mono">{formatTime(entry.timestamp)}</span>
              </div>
              <p className="text-sm text-slate-200 truncate">{entry.productName}</p>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                <span>Qty: <span className="text-slate-300 font-medium">{entry.quantity}</span></span>
                <span>Barcode: <span className="font-mono text-slate-400">{entry.barcode}</span></span>
                <span>By: {entry.handler}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
