// ===== Inventory Types =====

/** SKU product item */
export interface SKUItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  stockValue: number;
  status: 'healthy' | 'low' | 'critical' | 'out';
  location: MatrixLocation;
  expiryDate?: string;
  lastUpdated: string;
  imageUrl?: string;
}

/** Detailed item info for sidebar panel */
export interface ItemDetails extends SKUItem {
  turnoverRate: number;
  avgDailyUsage: number;
  reorderPoint: number;
  leadTime: number; // in days
  supplier: string;
  batchNumber: string;
  receivedDate: string;
  history: StockMovement[];
}

/** Stock movement record */
export interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  timestamp: string;
  reference: string;
  handler: string;
}

/** Warehouse rack location */
export interface MatrixLocation {
  zone: string;   // A-H
  rack: string;   // R1-R4
  shelf: number;  // 1-5
  position: number; // 1-10
}

/** Grid cell for location matrix */
export interface MatrixCell {
  zone: string;
  rack: string;
  occupancy: number; // 0-100
  totalSlots: number;
  usedSlots: number;
  items: string[]; // SKU IDs
  status: 'empty' | 'partial' | 'full' | 'reserved';
}

/** Expiry radar alert */
export interface ExpiryAlert {
  id: string;
  sku: string;
  productName: string;
  expiryDate: string;
  remainingHours: number;
  quantity: number;
  location: MatrixLocation;
  severity: 'urgent' | 'warning' | 'notice';
  actions: ('audit' | 'dispose' | 'transfer' | 'discount')[];
}

/** Product catalog filters */
export interface CatalogFilters {
  search: string;
  category: string;
  status: string;
  zone: string;
  sortBy: 'name' | 'sku' | 'quantity' | 'value' | 'expiry';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

/** Catalog summary stats */
export interface CatalogSummary {
  totalSKU: number;
  lowStockCount: number;
  inboundToday: number;
  pickingRate: number; // percentage
}
