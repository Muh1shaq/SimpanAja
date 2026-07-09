import { Link } from 'react-router-dom';
import {
  Package,
  BarChart3,
  Scan,
  Shield,
  ArrowRight,
  CheckCircle,
  Layers,
  TrendingUp,
  Warehouse,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: <Package size={24} />,
    title: 'Master Data Terpusat',
    desc: 'Kelola produk, kategori, supplier, dan lokasi gudang dari satu tempat dengan mudah.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: <Scan size={24} />,
    title: 'Inbound & Outbound Otomatis',
    desc: 'Verifikasi penerimaan barang lewat QR scan dan proses pengiriman dengan tracking real-time.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Layers size={24} />,
    title: 'Multi-Warehouse & Bin Location',
    desc: 'Pantau stok hingga level zona, rak, dan bin di beberapa gudang sekaligus.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Laporan & Analitik',
    desc: 'Ekspor laporan stok, pergerakan barang, dan alert low-stock ke PDF maupun Excel.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: <Shield size={24} />,
    title: 'Kontrol Akses & Role',
    desc: 'Batasi hak akses berdasarkan peran — Admin, Kepala Gudang, hingga Staff Gudang.',
    color: 'from-rose-500 to-red-500',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Stock Opname Digital',
    desc: 'Cocokkan stok sistem dan fisik, lakukan penyesuaian otomatis, semua tanpa kertas.',
    color: 'from-sky-500 to-cyan-500',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime Sistem' },
  { value: '< 2s', label: 'Response Time' },
  { value: '10+', label: 'Modul Terintegrasi' },
  { value: 'Real-time', label: 'Update Stok' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-indigo-700/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-purple-700/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5 border-b border-slate-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Warehouse size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">SimpanAja</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-all"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center gap-1.5"
          >
            Coba Gratis <ChevronRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Sistem Manajemen Gudang Modern
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-tight">
          Kelola Gudang Anda
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Lebih Cerdas
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          SimpanAja adalah platform manajemen inventaris terintegrasi — dari penerimaan barang,
          pelacakan lokasi, hingga laporan analitik — semuanya dalam satu sistem real-time.
        </p>

        <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
          >
            Mulai Gratis <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-800/60"
          >
            Masuk ke Sistem
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex items-center gap-6 flex-wrap justify-center text-sm text-slate-500">
          {['Gratis untuk memulai', 'Tanpa kartu kredit', 'Setup dalam 5 menit'].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div
              key={s.label}
              className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 text-center backdrop-blur-sm"
            >
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-slate-500 mt-3 text-base max-w-xl mx-auto">
              Platform lengkap untuk operasional gudang dari skala kecil hingga enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div
                key={f.title}
                className="group bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/70 hover:bg-slate-800/60 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/30 rounded-3xl p-12 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Siap Modernisasi Gudang Anda?
          </h2>
          <p className="text-slate-400 text-base mb-8">
            Bergabung dan rasakan perbedaannya — dari pencatatan manual ke sistem digital terintegrasi.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 text-base"
          >
            Daftar Sekarang — Gratis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Warehouse size={16} />
            <span>SimpanAja v1.0.0 · Warehouse Management System</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link to="/login" className="hover:text-slate-400 transition-colors">Masuk</Link>
            <Link to="/register" className="hover:text-slate-400 transition-colors">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
