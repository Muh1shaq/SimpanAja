import { Camera, Maximize2, Pause, Play } from 'lucide-react';
import { useState } from 'react';

export function LiveScannerView() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Live Scanner</h3>
          {isActive && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-semibold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Scanner viewport */}
      <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-700/50">
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Scanner line animation */}
        {isActive && (
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scanner-line shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        )}

        {/* Mock bounding box */}
        <div className="absolute top-[25%] left-[20%] w-[30%] h-[40%] border-2 border-green-400 rounded-lg">
          <span className="absolute -top-5 left-0 text-[10px] font-mono text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded">
            SKU-00142 (96.4%)
          </span>
          {/* Corner markers */}
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-400" />
          <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-400" />
        </div>

        {/* Second detection */}
        <div className="absolute top-[30%] left-[60%] w-[25%] h-[35%] border-2 border-amber-400/70 rounded-lg">
          <span className="absolute -top-5 left-0 text-[10px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
            SKU-00287 (78.2%)
          </span>
        </div>

        {/* Camera icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera size={48} className="text-slate-800" />
        </div>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-mono">CAM-01 · 1280×720 · 30fps</span>
            <span className="text-green-400 font-mono">AI: Active · 2 detected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
