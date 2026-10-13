import React, { useState } from 'react';
import { useAuth, PRIMARY_SUPERADMIN_EMAIL, RENEWED_ADMIN_PASSWORD } from '../../context/AuthContext';
import { JatibarayaLogo } from '../../components/common/JatibarayaLogo';
import { Lock, ArrowLeft, KeyRound, AlertCircle, ShieldCheck, Mail, Info } from 'lucide-react';

interface AdminLoginViewProps {
  onBackToPublic: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBackToPublic }) => {
  const { login, loginWithGoogle } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPasscode, setLoadingPasscode] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoadingPasscode(true);

    try {
      const result = await login(passcode);
      if (!result.success) {
        setErrorMessage(result.message || 'Kata sandi tidak sesuai.');
      }
    } catch {
      setErrorMessage('Terjadi kendala saat memproses login.');
    } finally {
      setLoadingPasscode(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setLoadingGoogle(true);

    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrorMessage(result.message || 'Gagal masuk dengan akun Google.');
      }
    } catch {
      setErrorMessage('Terjadi kendala saat menghubungkan akun Google.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-white relative">
      <button
        onClick={onBackToPublic}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400" />
        <span>Kembali ke Website Publik</span>
      </button>

      <div className="max-w-md w-full bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-2xl space-y-6 backdrop-blur-md">
        {/* Logo and Title */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-700/40 shadow-md">
            <JatibarayaLogo size="lg" showText={false} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Portal Admin Jatibaraya
            </h1>
            <p className="text-xs text-emerald-300/80 mt-1">
              Jam'iyyah Thullabi Bandung Garut Sumedang Raya
            </p>
          </div>
        </div>

        {/* Security Policy Badge */}
        <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-700/50 flex items-start gap-2.5 text-[11px] text-emerald-200 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">
              Otoritas Admin Terverifikasi
            </p>
            <p className="text-slate-300 mt-0.5">
              Admin Utama: <strong className="text-white font-mono">{PRIMARY_SUPERADMIN_EMAIL}</strong>.
              Akses Gmail dibatasi ketat hanya untuk akun yang diajukan oleh Admin Utama.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* PRIMARY METHOD: Google / Gmail Sign-In */}
        <div className="space-y-3">
          <button
            id="admin-google-login-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle || loadingPasscode}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-300 disabled:opacity-60"
          >
            {/* Google SVG Logo */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {loadingGoogle ? 'Memverifikasi Akun Google...' : 'Masuk dengan Akun Google (Gmail)'}
            </span>
          </button>
          <p className="text-[11px] text-center text-slate-400">
            Hanya akun Gmail yang telah terdaftar/diajukan yang dapat masuk.
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-700/80 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            atau kata sandi pengurus
          </span>
          <div className="border-t border-slate-700/80 w-full" />
        </div>

        {/* SECONDARY METHOD: Passcode Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 block">
                Kata Sandi Pengurus
              </label>
              <button
                type="button"
                onClick={() => setShowPasswordHint(!showPasswordHint)}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline cursor-pointer flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                <span>Sandi Baru</span>
              </button>
            </div>

            {showPasswordHint && (
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs">
                Sandi resmi yang telah diperbarui:{' '}
                <strong className="font-mono text-white selection:bg-amber-500 selection:text-black">
                  {RENEWED_ADMIN_PASSWORD}
                </strong>
              </div>
            )}

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-passcode-input"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-500"
              />
            </div>
          </div>

          <button
            id="admin-submit-login-btn"
            type="submit"
            disabled={loadingPasscode || loadingGoogle}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-600/40 disabled:opacity-60"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>{loadingPasscode ? 'Memverifikasi Sandi...' : 'Masuk dengan Sandi'}</span>
          </button>
        </form>

        {/* Footer Info */}
        <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-1">
          <p>Akses khusus pengurus dan pengelola resmi organisasi.</p>
        </div>
      </div>
    </div>
  );
};
