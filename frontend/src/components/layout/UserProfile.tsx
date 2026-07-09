import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface UserProfileProps {
  collapsed: boolean;
}

export function UserProfile({ collapsed }: UserProfileProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className={`px-3 py-3 border-t border-slate-700/50 ${collapsed ? 'flex justify-center' : ''}`}>
      <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="flex-1 min-w-0 animate-fade-in">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}

        {/* Actions */}
        {!collapsed && (
          <div className="flex gap-1 animate-fade-in">
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
              <Settings size={14} />
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
