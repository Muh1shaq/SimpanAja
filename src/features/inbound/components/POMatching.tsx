import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../../../components/common/Button';

interface POMatchingProps {
  poNumber: string;
  supplier: string;
  onSearch: (poNumber: string) => void;
}

const MOCK_SUPPLIERS = [
  'PT. Sumber Makmur',
  'CV. Jaya Abadi',
  'PT. Global Trade',
  'UD. Sentosa',
  'PT. Nusantara Supply',
];

export function POMatching({ poNumber, supplier, onSearch }: POMatchingProps) {
  const [searchPO, setSearchPO] = useState(poNumber);
  const [selectedSupplier, setSelectedSupplier] = useState(supplier);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">PO Matching</h3>

      <div className="space-y-4">
        {/* Supplier Dropdown */}
        <div className="relative">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
            Supplier
          </label>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-200 hover:border-slate-600 transition-colors"
          >
            {selectedSupplier || 'Select supplier...'}
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-slide-up">
              {MOCK_SUPPLIERS.map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedSupplier(s); setShowDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700/60 transition-colors ${s === selectedSupplier ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PO Number Input */}
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
            PO Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchPO}
              onChange={e => setSearchPO(e.target.value)}
              placeholder="Enter PO number..."
              className="flex-1 px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
            />
            <Button variant="primary" size="md" onClick={() => onSearch(searchPO)}>
              Match
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-slate-400">Partial match — waiting for verification</span>
        </div>
      </div>
    </div>
  );
}
