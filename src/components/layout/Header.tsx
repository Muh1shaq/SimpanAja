import { useState, useEffect } from 'react';
import { ScanLine, Timer, Bell } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function Header() {
  const [shiftTime, setShiftTime] = useState('');
  const [notifCount] = useState(3);

  // Shift end countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const shiftEnd = new Date();
      shiftEnd.setHours(14, 0, 0, 0); // Morning shift ends at 14:00
      if (now > shiftEnd) shiftEnd.setDate(shiftEnd.getDate() + 1);

      const diff = shiftEnd.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setShiftTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-slate-900/60 border-b border-slate-700/50 backdrop-blur-xl">
      {/* Left: Scan SKU input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <Input
          variant="search"
          placeholder="Scan or search SKU..."
          className="flex-1"
          icon={<ScanLine size={16} />}
        />
        <Button variant="primary" size="sm" icon={<ScanLine size={14} />}>
          Quick Scan
        </Button>
      </div>

      {/* Right: Shift timer & Notifications */}
      <div className="flex items-center gap-4">
        {/* Shift Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <Timer size={14} className="text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">Shift Ends</span>
            <span className="text-sm font-mono font-semibold text-amber-400">{shiftTime}</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell size={18} />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
