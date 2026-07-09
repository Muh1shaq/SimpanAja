import { useState } from 'react';
import { Grid3x3, Box } from 'lucide-react';
import type { MatrixCell } from '../../../types/inventory';
import { ZONES, RACKS_PER_ZONE } from '../../../config/constants';

interface LocationMatrix2DProps {
  cells: MatrixCell[];
  onCellClick: (cell: MatrixCell) => void;
  selectedCell: MatrixCell | null;
}

const occupancyColor = (pct: number) => {
  if (pct >= 90) return { bg: 'bg-red-500', glow: 'shadow-red-500/30' };
  if (pct >= 75) return { bg: 'bg-amber-500', glow: 'shadow-amber-500/30' };
  if (pct >= 40) return { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30' };
  if (pct > 0) return { bg: 'bg-blue-500', glow: 'shadow-blue-500/30' };
  return { bg: 'bg-slate-700', glow: '' };
};

export function LocationMatrix2D({ cells, onCellClick, selectedCell }: LocationMatrix2DProps) {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');

  const getCell = (zone: string, rack: string) =>
    cells.find(c => c.zone === zone && c.rack === rack);

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Location Matrix</h3>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('2D')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === '2D' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            2D
          </button>
          <button
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === '3D' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            3D
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-700" /> Empty</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Low</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> High</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Full</span>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-12 pb-2 text-xs text-slate-600 font-medium">Zone</th>
              {RACKS_PER_ZONE.map(rack => (
                <th key={rack} className="pb-2 text-xs text-slate-600 font-medium text-center">{rack}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ZONES.map(zone => (
              <tr key={zone}>
                <td className="py-1.5 text-xs font-semibold text-slate-400 text-center">{zone}</td>
                {RACKS_PER_ZONE.map(rack => {
                  const cell = getCell(zone, rack);
                  if (!cell) return <td key={rack} />;
                  const colors = occupancyColor(cell.occupancy);
                  const isSelected = selectedCell?.zone === zone && selectedCell?.rack === rack;

                  return (
                    <td key={rack} className="py-1.5 px-1">
                      <button
                        onClick={() => onCellClick(cell)}
                        className={`
                          zone-cell w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5
                          border transition-all duration-200
                          ${isSelected
                            ? 'border-indigo-400 ring-2 ring-indigo-500/30 scale-105'
                            : 'border-slate-700/50 hover:border-slate-500'}
                          ${colors.bg}/20
                        `}
                      >
                        <Box size={14} className={`${colors.bg.replace('bg-', 'text-')}`} />
                        <span className="text-[10px] font-bold text-white">{cell.occupancy}%</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
