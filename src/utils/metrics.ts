/**
 * Calculate turnover rate = (Total Units Sold / Average Inventory) over a period
 */
export function calcTurnoverRate(totalSold: number, avgInventory: number): number {
  if (avgInventory === 0) return 0;
  return Number((totalSold / avgInventory).toFixed(2));
}

/**
 * Calculate zone capacity percentage
 */
export function calcZoneCapacity(used: number, total: number): number {
  if (total === 0) return 0;
  return Number(((used / total) * 100).toFixed(1));
}

/**
 * Calculate efficiency score (0-100) based on multiple factors
 */
export function calcEfficiency(params: {
  processedItems: number;
  totalItems: number;
  avgProcessingTime: number; // in minutes
  targetTime: number; // in minutes
}): number {
  const throughputScore = (params.processedItems / Math.max(params.totalItems, 1)) * 50;
  const timeScore = Math.min(params.targetTime / Math.max(params.avgProcessingTime, 1), 1) * 50;
  return Math.round(throughputScore + timeScore);
}

/**
 * Calculate stock health across all zones
 */
export function calcStockHealth(zones: { used: number; total: number }[]): {
  overallPercent: number;
  healthyZones: number;
  warningZones: number;
  criticalZones: number;
} {
  let totalUsed = 0;
  let totalCapacity = 0;
  let healthy = 0;
  let warning = 0;
  let critical = 0;

  zones.forEach(zone => {
    totalUsed += zone.used;
    totalCapacity += zone.total;
    const pct = calcZoneCapacity(zone.used, zone.total);
    if (pct >= 90) critical++;
    else if (pct >= 75) warning++;
    else healthy++;
  });

  return {
    overallPercent: calcZoneCapacity(totalUsed, totalCapacity),
    healthyZones: healthy,
    warningZones: warning,
    criticalZones: critical,
  };
}

/**
 * Calculate remaining hours until expiry
 */
export function calcExpiryHours(expiryDate: string): number {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
}

/**
 * Determine expiry severity
 */
export function getExpirySeverity(hours: number): 'urgent' | 'warning' | 'notice' {
  if (hours <= 24) return 'urgent';
  if (hours <= 72) return 'warning';
  return 'notice';
}
