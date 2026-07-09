import { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

interface UserProfileProps {
  collapsed: boolean;
}

export function UserProfile({ collapsed }: UserProfileProps) {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!user) return null;

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const displayRole = profile?.role || 'Staff Gudang';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div
      ref={menuRef}
      className={`relative px-3 py-3 border-t border-slate-700/50 ${collapsed ? 'flex justify-center' : ''}`}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center gap-3 w-full rounded-xl px-2 py-1.5 hover:bg-slate-800/60 transition-colors ${collapsed ? 'justify-center' : ''}`}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
        </div>

        {/* Info */}
        {!collapsed && (
          <div className="flex-1 min-w-0 text-left animate-fade-in">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500">{displayRole}</p>
          </div>
        )}

        {!collapsed && (
          <ChevronDown size={14} className={`text-slate-500 flex-shrink-0 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className={`absolute bottom-full ${collapsed ? 'left-full ml-2 mb-0' : 'left-3 right-3 mb-2'} bg-slate-800 border border-slate-700/60 rounded-xl shadow-xl overflow-hidden z-50`}>
          <div className="px-3 py-2.5 border-b border-slate-700/50">
            <p className="text-xs font-medium text-white truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors">
              <User size={14} />
              Profil Saya
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors">
              <Settings size={14} />
              Pengaturan
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
