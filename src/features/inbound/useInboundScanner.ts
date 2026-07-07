import { useState } from 'react';
import type { PurchaseOrder, POLineItem, ScannedLogEntry, InboundSession } from '../../types/logistics';

const mockPO: PurchaseOrder = {
  id: 'po-001',
  poNumber: 'PO-2026-07845',
  supplier: 'PT. Sumber Makmur',
  expectedDate: '2026-07-07',
  status: 'partial',
  totalItems: 12,
  verifiedItems: 8,
  lineItems: [
    { id: 'li-1', sku: 'SKU-00142', productName: 'Organic Brown Rice 5kg', expectedQty: 200, verifiedQty: 200, status: 'verified', scannedAt: new Date(Date.now() - 10 * 60000).toISOString() },
    { id: 'li-2', sku: 'SKU-00287', productName: 'Premium Cooking Oil 2L', expectedQty: 150, verifiedQty: 150, status: 'verified', scannedAt: new Date(Date.now() - 8 * 60000).toISOString() },
    { id: 'li-3', sku: 'SKU-00391', productName: 'Instant Noodle Box (40pcs)', expectedQty: 300, verifiedQty: 180, status: 'discrepancy', scannedAt: new Date(Date.now() - 5 * 60000).toISOString(), notes: '120 units missing' },
    { id: 'li-4', sku: 'SKU-00455', productName: 'Canned Sardines 155g', expectedQty: 500, verifiedQty: 0, status: 'pending' },
    { id: 'li-5', sku: 'SKU-00512', productName: 'Wheat Flour 1kg', expectedQty: 250, verifiedQty: 250, status: 'verified' },
  ],
};

const mockScannedLog: ScannedLogEntry[] = [
  { id: 'sl-1', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), barcode: '8992761112001', sku: 'SKU-00142', productName: 'Organic Brown Rice 5kg', action: 'verified', quantity: 50, handler: 'Ahmad R.', poReference: 'PO-2026-07845' },
  { id: 'sl-2', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), barcode: '8992761113002', sku: 'SKU-00287', productName: 'Premium Cooking Oil 2L', action: 'scanned', quantity: 30, handler: 'Ahmad R.', poReference: 'PO-2026-07845' },
  { id: 'sl-3', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), barcode: '8992761114003', sku: 'SKU-00391', productName: 'Instant Noodle Box (40pcs)', action: 'rejected', quantity: 0, handler: 'Ahmad R.', poReference: 'PO-2026-07845' },
  { id: 'sl-4', timestamp: new Date(Date.now() - 7 * 60000).toISOString(), barcode: '8992761115004', sku: 'SKU-00512', productName: 'Wheat Flour 1kg', action: 'verified', quantity: 100, handler: 'Ahmad R.' },
];

export function useInboundScanner() {
  const [activePO, setActivePO] = useState<PurchaseOrder>(mockPO);
  const [scannedLog] = useState<ScannedLogEntry[]>(mockScannedLog);
  const [session] = useState<InboundSession>({
    sessionId: 'sess-001',
    poNumber: mockPO.poNumber,
    supplier: mockPO.supplier,
    startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    handler: 'Ahmad R.',
    scanResults: [],
    scannedLog: mockScannedLog,
    matchedItems: 8,
    totalExpected: 12,
    status: 'active',
  });

  const verifyItem = (lineItemId: string) => {
    setActivePO(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === lineItemId ? { ...item, status: 'verified' as const, verifiedQty: item.expectedQty } : item
      ),
    }));
  };

  return { activePO, scannedLog, session, verifyItem };
}
