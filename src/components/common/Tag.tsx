import { getStatusColor, getStatusLabel } from '../../utils/format';

interface TagProps {
  status: string;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Tag({ status, size = 'sm', dot = true, className = '' }: TagProps) {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium border rounded-full
        ${colors}
        ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full bg-current
            ${status === 'critical' || status === 'delayed' ? 'animate-pulse' : ''}
          `}
        />
      )}
      {label}
    </span>
  );
}
