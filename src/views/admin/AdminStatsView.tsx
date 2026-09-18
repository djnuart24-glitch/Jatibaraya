import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { Save, CheckCircle2, AlertTriangle, BarChart3, HelpCircle } from 'lucide-react';

export const AdminStatsView: React.FC = () => {
  const { data, updateStats } = useJatibarayaData();
  const { stats } = data;

  const [wargaCount, setWargaCount] = useState(stats.wargaCount);
  const [alumniCount, setAlumniCount] = useState(stats.alumniCount);
  const [programCount, setProgramCount] = useState(stats.programCount);
  const [kegiatanCount, setKegiatanCount] = useState(stats.kegiatanCount);
  const [referenceYear, setReferenceYear] = useState(stats.referenceYear);
  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStats({
      wargaCount: wargaCount.trim() || '—',
      alumniCount: alumniCount.trim() || '—',
      programCount: programCount.trim() || '—',
      kegiatanCount: kegiatanCount.trim() || '—',
      referenceYear: referenceYear.trim() || '2026',
    });
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSavedTime(now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Inline Feedback Banner */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border border-emerald-600 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Data Statistik Berhasil Disimpan!</p>
              <p className="text-[11px] text-emerald-200">Pukul {savedTime} WIB • Angka metrik langsung terpasang di Beranda.</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-800 rounded border border-emerald-700">
            Aktif
          </span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          10. Pengaturan Data Statistik Organisasi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Atur metrik statistik yang ditampilkan pada bagian ringkasan Beranda publik.
        </p>
      </div>

      {/* Warning Notice on Data Integrity */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <strong className="block font-bold">Prinsip Integritas Data Jatibaraya:</strong>
          <span>
            Sesuai arahan, jika data sensus riil santri/alumni belum dihimpun secara final oleh sekretariat, biarkan kolom berisi tanda strip <strong>&ldquo;—&rdquo;</strong>. Hindari mengarang angka perkiraan tanpa verifikasi.
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Jumlah Warga Santri Aktif
            </label>
            <input
              type="text"
              value={wargaCount}
              onChange={(e) => setWargaCount(e.target.value)}
              placeholder="Contoh: — atau 350"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Santri aktif asal Bandung, Garut, Sumedang, Cimahi.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Jumlah Alumni Terdata
            </label>
            <input
              type="text"
              value={alumniCount}
              onChange={(e) => setAlumniCount(e.target.value)}
              placeholder="Contoh: — atau 800"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Alumni yang telah menyelesaikan jenjang di Lirboyo.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Jumlah Program Kerja
            </label>
            <input
              type="text"
              value={programCount}
              onChange={(e) => setProgramCount(e.target.value)}
              placeholder="Contoh: 12"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Default program resmi Jatibaraya adalah 12 program.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Jumlah Kegiatan Berjalan
            </label>
            <input
              type="text"
              value={kegiatanCount}
              onChange={(e) => setKegiatanCount(e.target.value)}
              placeholder="Contoh: — atau 24"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Akumulasi agenda yang terlaksana sepanjang periode.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Tahun Basis Statistik
            </label>
            <input
              type="text"
              value={referenceYear}
              onChange={(e) => setReferenceYear(e.target.value)}
              placeholder="2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Tahun acuan data statistik.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {isSaved ? '✓ Metrik statistik berhasil diperbarui' : 'Gunakan "—" jika data sensus belum final'}
          </span>
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved ? 'bg-emerald-600 text-white' : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{isSaved ? '✓ Berhasil Disimpan!' : 'Simpan Data Statistik'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
