import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  CheckCircle,
  ArrowLeft,
  Warehouse,
} from 'lucide-react';
import { supabase } from '../../config/supabase';

const ROLES = ['Staff Gudang', 'Kepala Gudang', 'Admin'] as const;
type Role = (typeof ROLES)[number];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('Staff Gudang');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    setIsLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Insert profile row
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        role,
      });
    }

    setSuccess(true);
    setIsLoading(false);

    // Auto-redirect to login after 3s
    setTimeout(() => navigate('/login'), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>

        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Warehouse size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-500 text-sm mt-1">Mulai kelola gudang Anda hari ini</p>
          </div>

          {success ? (
            /* Success state */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Akun berhasil dibuat!</p>
                <p className="text-sm text-slate-500 mt-1">
                  Cek email Anda untuk verifikasi. Anda akan diarahkan ke halaman login...
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Ke halaman Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    required
                    className={`w-full bg-slate-800/60 border rounded-xl pl-9 pr-10 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-all text-slate-200 ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-red-500/50 focus:border-red-500/70'
                        : 'border-slate-700/50 focus:border-indigo-500/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mendaftar...
                  </>
                ) : 'Buat Akun'}
              </button>

              {/* Link to login */}
              <p className="text-center text-sm text-slate-500 pt-1">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          SimpanAja v1.0.0 · Warehouse Management System
        </p>
      </div>
    </div>
  );
}
