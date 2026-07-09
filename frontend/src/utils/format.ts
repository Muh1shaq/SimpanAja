/**
 * Format number as compact currency (e.g., $1.4M, $230K)
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

/**
 * Format number with comma separators (e.g., 1,234,567)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format percentage (e.g., 82.5%)
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format timestamp to relative time (e.g., "2m ago", "1h ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = Math.floor((now - time) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Format timestamp to time string (e.g., "14:32")
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format date (e.g., "Jul 07, 2026")
 */
export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/**
 * Get CSS class for status color
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    healthy: 'text-green-400 bg-green-400/10 border-green-400/30',
    completed: 'text-green-400 bg-green-400/10 border-green-400/30',
    verified: 'text-green-400 bg-green-400/10 border-green-400/30',
    low: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    pending_qc: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    critical: 'text-red-400 bg-red-400/10 border-red-400/30',
    delayed: 'text-red-400 bg-red-400/10 border-red-400/30',
    out: 'text-red-400 bg-red-400/10 border-red-400/30',
    processing: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    info: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  };
  return map[status] || 'text-slate-400 bg-slate-400/10 border-slate-400/30';
}

/**
 * Get status label text
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    healthy: 'Healthy',
    completed: 'Completed',
    verified: 'Verified',
    low: 'Low Stock',
    warning: 'Warning',
    pending_qc: 'Pending QC',
    critical: 'Critical',
    delayed: 'Delayed',
    out: 'Out of Stock',
    processing: 'Processing',
  };
  return map[status] || status;
}
