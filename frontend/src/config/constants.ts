// ===== API Configuration =====
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// ===== Application Constants =====
export const APP_NAME = 'SimpanAja';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Warehouse Management System';

// ===== Navigation Items =====
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { id: 'master-data', label: 'Master Data', path: '/master-data', icon: 'Database' },
  { id: 'inventory', label: 'Inventory', path: '/inventory', icon: 'Package' },
  { id: 'stock-opname', label: 'Stock Opname', path: '/stock-opname', icon: 'ClipboardCheck' },
  { id: 'inbound', label: 'Inbound', path: '/inbound', icon: 'ArrowDownToLine' },
  { id: 'outbound', label: 'Outbound', path: '/outbound', icon: 'ArrowUpFromLine' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'FileBarChart' },
] as const;

// ===== Zone Configuration =====
export const ZONES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
export const RACKS_PER_ZONE = ['R1', 'R2', 'R3', 'R4'] as const;

// ===== Status Configurations =====
export const STOCK_STATUS = {
  HEALTHY: { label: 'Healthy', color: 'success', threshold: 50 },
  LOW: { label: 'Low Stock', color: 'warning', threshold: 20 },
  CRITICAL: { label: 'Critical', color: 'danger', threshold: 5 },
  OUT: { label: 'Out of Stock', color: 'danger', threshold: 0 },
} as const;

export const LOGISTICS_STATUS = {
  COMPLETED: { label: 'Completed', color: 'success' },
  PROCESSING: { label: 'Processing', color: 'info' },
  PENDING_QC: { label: 'Pending QC', color: 'warning' },
  DELAYED: { label: 'Delayed', color: 'danger' },
  VERIFIED: { label: 'Verified', color: 'success' },
} as const;

// ===== Shift Configuration =====
export const SHIFTS = {
  MORNING: { label: 'Morning', start: '06:00', end: '14:00' },
  AFTERNOON: { label: 'Afternoon', start: '14:00', end: '22:00' },
  NIGHT: { label: 'Night', start: '22:00', end: '06:00' },
} as const;

// ===== Pagination =====
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
