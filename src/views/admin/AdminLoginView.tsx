import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { JatibarayaLogo } from '../../components/common/JatibarayaLogo';
import { Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginViewProps {
  onBackToPublic: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBackToPublic }) => {
  const { login } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(passcode);
      if (!result.success) {
        setErrorMessage(result.message || 'Kata sandi tidak sesuai.');
      }
    } catch {
      setErrorMessage('Terjadi kendala saat memproses login.');
    } finally {
      setLoading(false);
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

      <div className="max-w-md w-full bg-slate-900/90 rounded-3xl p-8 sm:p-10 border border-emerald-800/40 shadow-2xl space-y-6 backdrop-blur-md">
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-700/40 shadow-md">
            <JatibarayaLogo size="lg" showText={false} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Admin CMS Jatibaraya
            </h1>
            <p className="text-xs text-emerald-300/80 mt-1">
              Jam'iyyah Thullabi Bandung Garut Sumedang Raya
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Kata Sandi Pengurus
            </label>
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
            <p className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
              <span>*Kata sandi awal: <strong className="text-amber-300 font-mono">jatibaraya2026</strong></span>
              <span className="text-emerald-400 text-[10px]">● Real-time Cloud Sync</span>
            </p>
          </div>

          <button
            id="admin-submit-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-600/40"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'Memverifikasi...' : 'Masuk Dashboard Admin'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-1">
          <p>Portal Khusus Pengurus & Administrator Resmi.</p>
          <p>Sesi terproteksi dengan enkripsi Web Crypto SHA-256.</p>
        </div>
      </div>
    </div>
  );
};
