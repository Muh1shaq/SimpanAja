import { useState, useEffect } from 'react';
import type { SKUItem, MatrixCell, ExpiryAlert, CatalogSummary, CatalogFilters } from '../../types/inventory';
import { ZONES, RACKS_PER_ZONE } from '../../config/constants';
import { supabase } from '../../config/supabase';

function generateMatrixCells(): MatrixCell[] {
  const cells: MatrixCell[] = [];
  ZONES.forEach(zone => {
    RACKS_PER_ZONE.forEach(rack => {
      const occupancy = Math.floor(Math.random() * 100);
      cells.push({
        zone,
        rack,
        occupancy,
        totalSlots: 50,
        usedSlots: Math.floor(occupancy / 2),
        items: [],
        status: occupancy === 0 ? 'empty' : occupancy >= 90 ? 'full' : occupancy >= 50 ? 'partial' : 'empty',
      });
    });
  });
  return cells;
}

export function useInventoryMatrix() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<CatalogSummary>({
    totalSKU: 0,
    lowStockCount: 0,
    inboundToday: 0,
    pickingRate: 0,
  });
  const [products, setProducts] = useState<SKUItem[]>([]);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [matrixCells] = useState<MatrixCell[]>(generateMatrixCells());
  const [selectedCell, setSelectedCell] = useState<MatrixCell | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SKUItem | null>(null);
  const [filters, setFilters] = useState<CatalogFilters>({
    search: '',
    category: '',
    status: '',
    zone: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch inventory joined with products, bins, racks, zones, categories
        const { data: invData, error: invError } = await supabase
          .from('inventory')
          .select(`
            *,
            products (
              *,
              categories (name)
            ),
            bins (
              name,
              racks (
                name,
                zones (
                  name,
                  warehouses (name)
                )
              )
            )
          `);

        if (invError) throw invError;

        // Group inventory by product if needed, or map each inventory record as a SKUItem representing a batch/location
        // In this implementation, we will map each inventory record to a SKUItem to show specific locations
        const fetchedProducts: SKUItem[] = (invData || []).map((inv: any) => {
          const p = inv.products;
          const categoryName = p.categories?.name || 'Uncategorized';
          const bin = inv.bins;
          const rack = bin?.racks;
          const zone = rack?.zones;
          const warehouse = zone?.warehouses;

          const quantity = inv.quantity || 0;
          const minStock = p.min_stock || 0;
          let status: SKUItem['status'] = 'healthy';
          if (quantity === 0) status = 'out';
          else if (quantity <= minStock) status = 'critical';
          else if (quantity <= minStock * 1.5) status = 'low';

          return {
            id: inv.id, // Using inventory ID to uniquely identify this batch
            sku: p.sku,
            name: p.name,
            category: categoryName,
            quantity: quantity,
            minStock: minStock,
            maxStock: minStock * 3, // mock max stock
            unit: p.unit,
            price: p.price,
            stockValue: quantity * (p.price || 0),
            status: status,
            location: {
              warehouse: warehouse?.name || 'Main Warehouse',
              zone: zone?.name || 'Unzoned',
              rack: rack?.name || 'Unracked',
              bin: bin?.name || 'Unbinned'
            },
            expiryDate: inv.expiry_date,
            lastUpdated: inv.updated_at || inv.created_at
          };
        });

        // Mock expiry alerts for now until we build a proper function
        const fetchedAlerts: ExpiryAlert[] = fetchedProducts
          .filter(p => p.expiryDate)
          .map(p => {
             const daysToExpiry = Math.floor((new Date(p.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
             return {
                id: p.id,
                sku: p.sku,
                productName: p.name,
                expiryDate: p.expiryDate!,
                remainingHours: daysToExpiry * 24,
                quantity: p.quantity,
                location: p.location,
                severity: daysToExpiry < 7 ? 'urgent' : daysToExpiry < 30 ? 'warning' : 'notice',
                actions: ['audit', 'discount']
             } as ExpiryAlert;
          })
          .filter(a => a.remainingHours < 30 * 24); // only show within 30 days

        setProducts(fetchedProducts);
        setExpiryAlerts(fetchedAlerts);

        setSummary({
          totalSKU: new Set(fetchedProducts.map(p => p.sku)).size,
          lowStockCount: fetchedProducts.filter(p => p.status === 'low' || p.status === 'critical').length,
          inboundToday: 0, // TODO: fetch from transactions
          pickingRate: 100,
        });
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) && !p.sku.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.zone && p.location.zone !== filters.zone) return false;
    return true;
  });

  return {
    isLoading,
    summary,
    products: filteredProducts,
    expiryAlerts,
    matrixCells,
    selectedCell,
    setSelectedCell,
    selectedProduct,
    setSelectedProduct,
    filters,
    setFilters,
  };
}
