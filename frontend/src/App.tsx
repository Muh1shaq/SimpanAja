import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AuthProvider, useAuth } from './features/auth/AuthContext';

// Public pages
import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';

// App page components
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
        <div className="xl:col-span-2"><StockFlowChart data={data.stockFlow} /></div>
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
        <p className="text-sm text-slate-500 mt-0.5">Receive &amp; verify incoming shipments</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <POMatching poNumber={activePO.poNumber} supplier={activePO.supplier} onSearch={() => {}} />
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
        <p className="text-sm text-slate-500 mt-0.5">SKU catalog, locations &amp; expiry monitoring</p>
      </div>
      <CatalogSummary summary={summary} />
      <ExpiryRadar alerts={expiryAlerts} />
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <LocationMatrix2D cells={matrixCells} onCellClick={setSelectedCell} selectedCell={selectedCell} />
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

// ===== Protected Route Guard =====
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 text-sm">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ===== Guest Route Guard (redirect if already logged in) =====
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

// ===== App Shell (sidebar + header layout) =====
function AppShell() {
  return (
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
            {/* Catch all inside /app */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ===== App Root =====
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<GuestRoute><LoginPage /></GuestRoute>}
          />
          <Route
            path="/register"
            element={<GuestRoute><RegisterPage /></GuestRoute>}
          />

          {/* Protected app routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
