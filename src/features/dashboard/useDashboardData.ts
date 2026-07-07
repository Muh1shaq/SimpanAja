import { useState } from 'react';
import type { DashboardData, MetricCard, StockFlowDataPoint, ZoneUtilization, LogisticsTransaction } from '../../types/dashboard';

// Mock data for dashboard
const mockMetrics: MetricCard[] = [
  {
    id: 'total-stock',
    title: 'Total Stock Value',
    value: '$1.4M',
    change: 12.5,
    changeLabel: 'vs last week',
    icon: 'Package',
    trend: 'up',
  },
  {
    id: 'inbound',
    title: 'Inbound Today',
    value: '2,847',
    change: 8.2,
    changeLabel: 'vs yesterday',
    icon: 'ArrowDownToLine',
    trend: 'up',
  },
  {
    id: 'outbound',
    title: 'Outbound Today',
    value: '1,923',
    change: -3.1,
    changeLabel: 'vs yesterday',
    icon: 'ArrowUpFromLine',
    trend: 'down',
  },
  {
    id: 'efficiency',
    title: 'Floor Efficiency',
    value: '94.2%',
    change: 2.4,
    changeLabel: 'vs last shift',
    icon: 'Zap',
    trend: 'up',
  },
];

const mockStockFlow: StockFlowDataPoint[] = [
  { time: '08:00', inbound: 320, outbound: 180, netFlow: 140 },
  { time: '09:00', inbound: 480, outbound: 290, netFlow: 190 },
  { time: '10:00', inbound: 410, outbound: 350, netFlow: 60 },
  { time: '11:00', inbound: 550, outbound: 420, netFlow: 130 },
  { time: '12:00', inbound: 290, outbound: 380, netFlow: -90 },
  { time: '13:00', inbound: 620, outbound: 310, netFlow: 310 },
  { time: '14:00', inbound: 530, outbound: 450, netFlow: 80 },
  { time: '15:00', inbound: 470, outbound: 520, netFlow: -50 },
  { time: '16:00', inbound: 380, outbound: 290, netFlow: 90 },
  { time: '17:00', inbound: 310, outbound: 410, netFlow: -100 },
  { time: '18:00', inbound: 250, outbound: 340, netFlow: -90 },
  { time: '19:00', inbound: 180, outbound: 220, netFlow: -40 },
];

const mockZones: ZoneUtilization[] = [
  { zoneId: 'A', zoneName: 'Zone A', totalCapacity: 1000, usedCapacity: 820, utilizationPercent: 82, status: 'warning' },
  { zoneId: 'B', zoneName: 'Zone B', totalCapacity: 800, usedCapacity: 560, utilizationPercent: 70, status: 'healthy' },
  { zoneId: 'C', zoneName: 'Zone C', totalCapacity: 1200, usedCapacity: 1080, utilizationPercent: 90, status: 'critical' },
  { zoneId: 'D', zoneName: 'Zone D', totalCapacity: 600, usedCapacity: 330, utilizationPercent: 55, status: 'healthy' },
];

const mockTransactions: LogisticsTransaction[] = [
  { id: '1', trxCode: '#TRX-94012', type: 'inbound', supplier: 'PT. Sumber Makmur', itemCount: 450, status: 'completed', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), handler: 'Ahmad R.' },
  { id: '2', trxCode: '#TRX-94013', type: 'outbound', supplier: 'CV. Jaya Abadi', itemCount: 230, status: 'processing', timestamp: new Date(Date.now() - 32 * 60000).toISOString(), handler: 'Budi S.' },
  { id: '3', trxCode: '#TRX-94014', type: 'inbound', supplier: 'PT. Global Trade', itemCount: 180, status: 'pending_qc', timestamp: new Date(Date.now() - 48 * 60000).toISOString(), handler: 'Dewi L.' },
  { id: '4', trxCode: '#TRX-94015', type: 'outbound', supplier: 'UD. Sentosa', itemCount: 320, status: 'delayed', timestamp: new Date(Date.now() - 95 * 60000).toISOString(), handler: 'Eko P.' },
  { id: '5', trxCode: '#TRX-94016', type: 'inbound', supplier: 'PT. Nusantara Supply', itemCount: 510, status: 'completed', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), handler: 'Fitri H.' },
];

export function useDashboardData() {
  const [isLoading] = useState(false);
  const [data] = useState<DashboardData>({
    metrics: mockMetrics,
    stockFlow: mockStockFlow,
    zoneUtilization: mockZones,
    recentTransactions: mockTransactions,
    lastUpdated: new Date().toISOString(),
  });

  return { data, isLoading };
}
