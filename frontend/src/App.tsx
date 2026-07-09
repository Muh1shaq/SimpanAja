import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Page components (inline for now)
import { OverviewCards } from './features/dashboard/components/OverviewCards';
import { StockFlowChart } from './features/dashboard/components/StockFlowChart';
import { ZoneUtilization } from './features/dashboard/components/ZoneUtilization';
import { RecentLogistics } from './features/dashboard/components/RecentLogistics';
import { useDashboardData } from './features/dashboard/useDashboardData';

import { POMatching } from './features/inbound/components/POMatching';
import { LineItemsList } from './features/inbound/components/LineItemsList';
import { LiveScannerView } from './features/inbound/components/LiveScannerView';
import { RealTimeScannedLog } from './features/inbound/components/RealTimeScannedLog';
import { useInboundScanner } from './features/inbound/useInboundScanner';

import { CatalogSummary } from './features/inventory/components/CatalogSummary';
import { ExpiryRadar } from './features/inventory/components/ExpiryRadar';
import { LocationMatrix2D } from './features/inventory/components/LocationMatrix2D';
import { ItemDetailsSidebar } from './features/inventory/components/ItemDetailsSidebar';
import { ProductTable } from './features/inventory/components/ProductTable';
import { useInventoryMatrix } from './features/inventory/useInventoryMatrix';

import MasterDataPage from './features/master-data/MasterDataPage';
import OutboundPage from './features/outbound/OutboundPage';
import ReportsPage from './features/reports/ReportsPage';
import StockOpnamePage from './features/inventory/StockOpnamePage';

// ===== Dashboard Page =====
function DashboardPage() {
  const { data } = useDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Warehouse Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time overview of warehouse operations</p>
      </div>
      <OverviewCards metrics={data.metrics} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <StockFlowChart data={data.stockFlow} />
        </div>
        <ZoneUtilization zones={data.zoneUtilization} />
      </div>
      <RecentLogistics transactions={data.recentTransactions} />
    </div>
  );
}

// ===== Inbound Page =====
function InboundPage() {
  const { activePO, scannedLog, verifyItem } = useInboundScanner();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Inbound Reception</h1>
        <p className="text-sm text-slate-500 mt-0.5">Receive & verify incoming shipments</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <POMatching
            poNumber={activePO.poNumber}
            supplier={activePO.supplier}
            onSearch={() => {}}
          />
          <LineItemsList items={activePO.lineItems} onVerify={verifyItem} />
        </div>
        <div className="space-y-6">
          <LiveScannerView />
          <RealTimeScannedLog entries={scannedLog} />
        </div>
      </div>
    </div>
  );
}

// ===== Inventory Page =====
function InventoryPage() {
  const {
    summary, products, expiryAlerts, matrixCells,
    selectedCell, setSelectedCell, selectedProduct, setSelectedProduct,
    filters, setFilters,
  } = useInventoryMatrix();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Inventory Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">SKU catalog, locations & expiry monitoring</p>
      </div>
      <CatalogSummary summary={summary} />
      <ExpiryRadar alerts={expiryAlerts} />
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <LocationMatrix2D
            cells={matrixCells}
            onCellClick={setSelectedCell}
            selectedCell={selectedCell}
          />
          <ProductTable
            products={products}
            onProductClick={setSelectedProduct}
            searchValue={filters.search}
            onSearchChange={(v) => setFilters(prev => ({ ...prev, search: v }))}
          />
        </div>
        <ItemDetailsSidebar item={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </div>
  );
}

// ===== Placeholder Pages =====

// ===== App Root =====
export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/master-data" element={<MasterDataPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/stock-opname" element={<StockOpnamePage />} />
              <Route path="/inbound" element={<InboundPage />} />
              <Route path="/outbound" element={<OutboundPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
