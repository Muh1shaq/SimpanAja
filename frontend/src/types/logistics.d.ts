// ===== Logistics Types (Inbound / Outbound) =====

/** Purchase Order for matching */
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  expectedDate: string;
  status: 'pending' | 'partial' | 'matched' | 'discrepancy';
  lineItems: POLineItem[];
  totalItems: number;
  verifiedItems: number;
}

/** Individual PO line item */
export interface POLineItem {
  id: string;
  sku: string;
  productName: string;
  expectedQty: number;
  verifiedQty: number;
  status: 'pending' | 'verified' | 'discrepancy' | 'extra';
  scannedAt?: string;
  notes?: string;
}

/** Live scanner detection result */
export interface ScanResult {
  id: string;
  barcode: string;
  sku: string;
  productName: string;
  confidence: number; // 0-100 AI confidence
  timestamp: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  status: 'detected' | 'verified' | 'rejected' | 'unknown';
}

/** Real-time scanned log entry */
export interface ScannedLogEntry {
  id: string;
  timestamp: string;
  barcode: string;
  sku: string;
  productName: string;
  action: 'scanned' | 'verified' | 'rejected' | 'manual_entry';
  quantity: number;
  handler: string;
  poReference?: string;
}

/** Inbound reception session state */
export interface InboundSession {
  sessionId: string;
  poNumber: string;
  supplier: string;
  startedAt: string;
  handler: string;
  scanResults: ScanResult[];
  scannedLog: ScannedLogEntry[];
  matchedItems: number;
  totalExpected: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

/** Outbound shipment */
export interface OutboundShipment {
  id: string;
  shipmentCode: string;
  destination: string;
  carrier: string;
  itemCount: number;
  status: 'preparing' | 'packed' | 'shipped' | 'delivered';
  scheduledDate: string;
  actualDate?: string;
  handler: string;
}
