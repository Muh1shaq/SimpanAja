import { useState } from 'react';
import type { SKUItem, MatrixCell, ExpiryAlert, CatalogSummary, CatalogFilters } from '../../types/inventory';
import { ZONES, RACKS_PER_ZONE } from '../../config/constants';

const mockCatalogSummary: CatalogSummary = {
  totalSKU: 1247,
  lowStockCount: 23,
  inboundToday: 847,
  pickingRate: 92.4,
};

const mockProducts: SKUItem[] = [
  { id: '1', sku: 'SKU-00142', name: 'Organic Brown Rice 5kg', category: 'Grains', quantity: 1200, minStock: 200, maxStock: 2000, unit: 'bags', price: 8.50, stockValue: 10200, status: 'healthy', location: { zone: 'A', rack: 'R1', shelf: 2, position: 3 }, expiryDate: '2026-12-15', lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '2', sku: 'SKU-00287', name: 'Premium Cooking Oil 2L', category: 'Oils', quantity: 85, minStock: 100, maxStock: 500, unit: 'bottles', price: 5.20, stockValue: 442, status: 'low', location: { zone: 'B', rack: 'R2', shelf: 1, position: 5 }, expiryDate: '2026-09-20', lastUpdated: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '3', sku: 'SKU-00391', name: 'Instant Noodle Box (40pcs)', category: 'Noodles', quantity: 3, minStock: 50, maxStock: 300, unit: 'boxes', price: 12.00, stockValue: 36, status: 'critical', location: { zone: 'C', rack: 'R1', shelf: 3, position: 1 }, expiryDate: '2026-07-08', lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: '4', sku: 'SKU-00455', name: 'Canned Sardines 155g', category: 'Canned', quantity: 750, minStock: 200, maxStock: 1500, unit: 'cans', price: 2.30, stockValue: 1725, status: 'healthy', location: { zone: 'A', rack: 'R3', shelf: 4, position: 7 }, expiryDate: '2027-03-01', lastUpdated: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: '5', sku: 'SKU-00512', name: 'Wheat Flour 1kg', category: 'Grains', quantity: 450, minStock: 150, maxStock: 800, unit: 'packs', price: 1.80, stockValue: 810, status: 'healthy', location: { zone: 'D', rack: 'R1', shelf: 1, position: 2 }, expiryDate: '2027-01-10', lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '6', sku: 'SKU-00623', name: 'Soy Sauce 600ml', category: 'Condiments', quantity: 15, minStock: 50, maxStock: 400, unit: 'bottles', price: 3.10, stockValue: 46.5, status: 'critical', location: { zone: 'B', rack: 'R4', shelf: 2, position: 4 }, expiryDate: '2026-08-05', lastUpdated: new Date(Date.now() - 6 * 3600000).toISOString() },
];

const mockExpiryAlerts: ExpiryAlert[] = [
  { id: 'exp-1', sku: 'SKU-00391', productName: 'Instant Noodle Box (40pcs)', expiryDate: new Date(Date.now() + 20 * 3600000).toISOString(), remainingHours: 20, quantity: 3, location: { zone: 'C', rack: 'R1', shelf: 3, position: 1 }, severity: 'urgent', actions: ['audit', 'dispose'] },
  { id: 'exp-2', sku: 'SKU-00623', productName: 'Soy Sauce 600ml', expiryDate: new Date(Date.now() + 68 * 3600000).toISOString(), remainingHours: 68, quantity: 15, location: { zone: 'B', rack: 'R4', shelf: 2, position: 4 }, severity: 'warning', actions: ['audit', 'discount', 'transfer'] },
];

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
  const [summary] = useState<CatalogSummary>(mockCatalogSummary);
  const [products] = useState<SKUItem[]>(mockProducts);
  const [expiryAlerts] = useState<ExpiryAlert[]>(mockExpiryAlerts);
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

  const filteredProducts = products.filter(p => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) && !p.sku.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.zone && p.location.zone !== filters.zone) return false;
    return true;
  });

  return {
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
