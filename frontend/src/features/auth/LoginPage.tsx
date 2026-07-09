import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Package, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle, Warehouse } from 'lucide-react';
import { useAuth } from './AuthContext';
import { supabase } from '../../config/supabase';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setIsLoading(false);
  }

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    if (!email) {
      setError('Masukkan email Anda untuk reset password.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg('Tautan reset password telah dikirim ke email Anda.');
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Warehouse size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Masuk ke SimpanAja</h1>
            <p className="text-slate-500 text-sm mt-1">Warehouse Management System</p>
          </div>

          {/* Form */}
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button type="button" onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMsg(null); }} className="text-xs text-indigo-400 hover:text-indigo-300">Lupa password?</button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Masuk...
                  </>
                ) : 'Masuk ke Sistem'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm">
                  <CheckCircle size={16} className="flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </>
                ) : 'Kirim Link Reset Password'}
              </button>

              <button type="button" onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMsg(null); }} className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={16} /> Kembali ke Login
              </button>
            </form>
          )}

          {!isForgotPassword && (
            <div className="mt-5 pt-5 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500">
                Belum punya akun?{' '}
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
            <ArrowLeft size={12} /> Kembali ke Beranda
          </Link>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          SimpanAja v1.0.0 · Warehouse Management System
        </p>
      </div>
    </div>
  );
}
