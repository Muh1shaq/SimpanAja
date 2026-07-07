import type { ZoneUtilization as ZoneData } from '../../../types/dashboard';

interface ZoneUtilizationProps {
  zones: ZoneData[];
}

export function ZoneUtilization({ zones }: ZoneUtilizationProps) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">Zone Utilization</h3>
        <p className="text-xs text-slate-500 mt-0.5">Current capacity usage per zone</p>
      </div>

      <div className="space-y-5">
        {zones.map(zone => {
          const statusColor =
            zone.status === 'critical' ? '#ef4444' :
            zone.status === 'warning' ? '#f59e0b' : '#22c55e';

          return (
            <div key={zone.zoneId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}80` }}
                  />
                  <span className="text-sm font-medium text-slate-200">{zone.zoneName}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: statusColor }}>
                  {zone.utilizationPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${zone.utilizationPercent}%`,
                    background: `linear-gradient(90deg, ${statusColor}90, ${statusColor})`,
                    boxShadow: `0 0 8px ${statusColor}40`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-600">
                  {zone.usedCapacity.toLocaleString()} used
                </span>
                <span className="text-[10px] text-slate-600">
                  {zone.totalCapacity.toLocaleString()} total
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall occupancy ring */}
      <div className="mt-6 flex items-center justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#gaugeGradient)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${82 * 2.64} ${264 - 82 * 2.64}`}
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">82%</span>
            <span className="text-[10px] text-slate-500">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
