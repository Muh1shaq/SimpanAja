import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  variant?: 'default' | 'search';
}

export function Input({
  icon,
  label,
  error,
  variant = 'default',
  className = '',
  ...props
}: InputProps) {
  const isSearch = variant === 'search';

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {(icon || isSearch) && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon || <Search size={16} />}
          </span>
        )}
        <input
          className={`
            w-full bg-slate-800/60 border border-slate-700 rounded-xl
            text-sm text-slate-200 placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60
            transition-all duration-200
            ${icon || isSearch ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error ? 'border-red-500/50 focus:ring-red-500/40' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}
