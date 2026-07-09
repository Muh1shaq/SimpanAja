// ===== Dashboard Types =====

/** Overview metric card data */
export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number; // percentage change (+/-)
  changeLabel: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

/** Stock flow chart data point (hourly) */
export interface StockFlowDataPoint {
  time: string; // "08:00", "09:00", etc.
  inbound: number;
  outbound: number;
  netFlow: number;
}

/** Zone utilization gauge data */
export interface ZoneUtilization {
  zoneId: string;
  zoneName: string;
  totalCapacity: number;
  usedCapacity: number;
  utilizationPercent: number;
  status: 'healthy' | 'warning' | 'critical';
}

/** Recent logistics transaction */
export interface LogisticsTransaction {
  id: string;
  trxCode: string; // e.g., "#TRX-94012"
  type: 'inbound' | 'outbound';
  supplier: string;
  itemCount: number;
  status: 'completed' | 'processing' | 'pending_qc' | 'delayed';
  timestamp: string;
  handler: string;
}

/** Dashboard summary state */
export interface DashboardData {
  metrics: MetricCard[];
  stockFlow: StockFlowDataPoint[];
  zoneUtilization: ZoneUtilization[];
  recentTransactions: LogisticsTransaction[];
  lastUpdated: string;
}
