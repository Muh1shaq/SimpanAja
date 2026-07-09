import { useState, useEffect } from 'react';
import type { DashboardData, MetricCard, StockFlowDataPoint, ZoneUtilization, LogisticsTransaction } from '../../types/dashboard';
import { supabase } from '../../config/supabase';

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    metrics: [],
    stockFlow: [],
    zoneUtilization: [],
    recentTransactions: [],
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [metricsRes, flowRes, zonesRes, txRes] = await Promise.all([
          supabase.from('dashboard_metrics').select('*'),
          supabase.from('stock_flow').select('*').order('id', { ascending: true }),
          supabase.from('zone_utilization').select('*'),
          supabase.from('transactions').select('*').order('timestamp', { ascending: false }).limit(5)
        ]);

        if (metricsRes.error) throw metricsRes.error;
        if (flowRes.error) throw flowRes.error;
        if (zonesRes.error) throw zonesRes.error;
        if (txRes.error) throw txRes.error;

        const metrics: MetricCard[] = metricsRes.data.map((m: any) => ({
          id: m.id,
          title: m.title,
          value: m.value,
          change: m.change,
          changeLabel: m.change_label,
          icon: m.icon as any,
          trend: m.trend as any,
        }));

        const stockFlow: StockFlowDataPoint[] = flowRes.data.map((f: any) => ({
          time: f.time,
          inbound: f.inbound,
          outbound: f.outbound,
          netFlow: f.net_flow,
        }));

        const zoneUtilization: ZoneUtilization[] = zonesRes.data.map((z: any) => ({
          zoneId: z.zone_id,
          zoneName: z.zone_name,
          totalCapacity: z.total_capacity,
          usedCapacity: z.used_capacity,
          utilizationPercent: z.utilization_percent,
          status: z.status as any,
        }));

        const recentTransactions: LogisticsTransaction[] = txRes.data.map((t: any) => ({
          id: t.id,
          trxCode: t.trx_code,
          type: t.type as any,
          supplier: t.supplier,
          itemCount: t.item_count,
          status: t.status as any,
          timestamp: t.timestamp,
          handler: t.handler,
        }));

        setData({
          metrics,
          stockFlow,
          zoneUtilization,
          recentTransactions,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading };
}
