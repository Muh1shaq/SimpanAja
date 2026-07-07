import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { NAV_ITEMS, APP_NAME } from '../../config/constants';
import { UserProfile } from './UserProfile';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Package: <Package size={20} />,
  ArrowDownToLine: <ArrowDownToLine size={20} />,
  ArrowUpFromLine: <ArrowUpFromLine size={20} />,
  FileBarChart: <FileBarChart size={20} />,
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`
        flex flex-col h-screen bg-slate-900/80 border-r border-slate-700/50
        backdrop-blur-xl transition-all duration-300 ease-out
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Package size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-bold text-white tracking-wide">{APP_NAME}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Warehouse</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}
              `}
              title={collapsed ? item.label : undefined}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {iconMap[item.icon]}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <UserProfile collapsed={collapsed} />

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-slate-700/50 text-slate-500 hover:text-white hover:bg-slate-800/60 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
