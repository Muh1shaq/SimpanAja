import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import type { PurchaseOrder, POLineItem, ScannedLogEntry, InboundSession } from '../../types/logistics';

export function useInboundScanner() {
  const [activePO, setActivePO] = useState<PurchaseOrder | null>(null);
  const [scannedLog, setScannedLog] = useState<ScannedLogEntry[]>([]);
  const [session, setSession] = useState<InboundSession | null>(null);

  useEffect(() => {
    fetchActiveInbound();
  }, []);

  async function fetchActiveInbound() {
    // Fetch the first pending inbound transaction
    const { data: tx, error } = await supabase
      .from('transactions')
      .select('*, suppliers(name), transaction_items(*, products(sku, name))')
      .eq('type', 'inbound')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !tx) {
      console.log("No pending inbound found");
      return;
    }

    const lineItems: POLineItem[] = (tx.transaction_items || []).map((item: any) => ({
      id: item.id,
      sku: item.products?.sku,
      productName: item.products?.name,
      expectedQty: item.expected_qty,
      verifiedQty: item.actual_qty,
      status: item.actual_qty >= item.expected_qty ? 'verified' : 'pending',
      productId: item.product_id, // keep for updates
    }));

    const po: PurchaseOrder = {
      id: tx.id,
      poNumber: tx.trx_code,
      supplier: tx.suppliers?.name || 'Unknown Supplier',
      expectedDate: new Date(tx.created_at).toISOString().slice(0,10),
      status: 'pending',
      lineItems,
      totalItems: lineItems.length,
      verifiedItems: lineItems.filter(i => i.status === 'verified').length,
    };

    setActivePO(po);

    setSession({
      sessionId: `sess-${tx.id}`,
      poNumber: po.poNumber,
      supplier: po.supplier,
      startedAt: new Date().toISOString(),
      handler: 'Current User', // Could get from auth
      scanResults: [],
      scannedLog: [],
      matchedItems: po.verifiedItems,
      totalExpected: po.totalItems,
      status: 'active',
    });
  }

  const verifyItem = async (lineItemId: string) => {
    if (!activePO) return;

    const item = activePO.lineItems.find(i => i.id === lineItemId);
    if (!item) return;

    // Update transaction_items
    const { error: txError } = await supabase
      .from('transaction_items')
      .update({ actual_qty: item.expectedQty })
      .eq('id', lineItemId);

    if (!txError) {
      // Find a default bin or just insert without bin for now
      // This is a simplified inventory addition. In a real app, user selects bin.
      const { data: bin } = await supabase.from('bins').select('id').limit(1).single();

      await supabase.from('inventory').insert({
        product_id: (item as any).productId,
        quantity: item.expectedQty,
        bin_id: bin?.id || null
      });

      // Log it
      const newLog: ScannedLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        barcode: item.sku,
        sku: item.sku,
        productName: item.productName,
        action: 'verified',
        quantity: item.expectedQty,
        handler: 'Current User',
        poReference: activePO.poNumber
      };

      setScannedLog(prev => [newLog, ...prev]);

      setActivePO(prev => {
        if (!prev) return prev;
        const newItems = prev.lineItems.map(i =>
          i.id === lineItemId ? { ...i, status: 'verified' as const, verifiedQty: i.expectedQty } : i
        );
        return {
          ...prev,
          lineItems: newItems,
          verifiedItems: newItems.filter(i => i.status === 'verified').length
        };
      });
    }
  };

  return { 
    activePO: activePO || {
      id: '', poNumber: 'Loading...', supplier: '', expectedDate: '', status: 'pending', lineItems: [], totalItems: 0, verifiedItems: 0
    }, 
    scannedLog, 
    session: session || {
      sessionId: '', poNumber: '', supplier: '', startedAt: '', handler: '', scanResults: [], scannedLog: [], matchedItems: 0, totalExpected: 0, status: 'active'
    }, 
    verifyItem 
  };
}
