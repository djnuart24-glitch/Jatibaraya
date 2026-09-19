import React, { useState, useEffect } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { AuditLogItem } from '../../types';
import { subscribeAuditLogs } from '../../services/auditService';
import {
  Layers,
  Newspaper,
  BookOpen,
  Image,
  Bell,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Shield,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface OverviewProps {
  onSelectSection: (section: string) => void;
  onViewPublic: () => void;
}

export const AdminDashboardOverview: React.FC<OverviewProps> = ({
  onSelectSection,
  onViewPublic,
}) => {
  const { data, exportDatabaseJSON, importDatabaseJSON, resetToInitial } = useJatibarayaData();
  const { programs, news, articles, announcements, media, settings } = data;

  const [notification, setNotification] = useState('');
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    const unsub = subscribeAuditLogs((logs) => {
      setRecentLogs(logs.slice(0, 4));
    });
    return () => unsub();
  }, []);

  const handleExport = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_jatibaraya_database_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice('Backup database JSON berhasil diunduh!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        showNotice('Database Jatibaraya berhasil dipulihkan dari file JSON!');
      } else {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Kembalikan semua data ke pengaturan awal Jatibaraya? Perubahan Anda akan di-reset.')) {
      resetToInitial();
      showNotice('Data telah dikembalikan ke kondisi awal resmi.');
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-800/50 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            Jatibaraya Website Builder
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Selamat Datang di Dashboard Admin
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
            Kelola seluruh konten website resmi Jatibaraya secara instan tanpa perlu coding. Setiap perubahan yang disimpan langsung tayang di website publik.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onViewPublic}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Buka Website Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600/40 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Klik Backup JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards (Mobile Friendly) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectSection('program')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Program Kerja</span>
            <Layers className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            {programs.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            {programs.filter((p) => p.published).length} Tayang Publik
          </span>
        </div>

        <div
          onClick={() => onSelectSection('berita')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Berita Resmi</span>
            <Newspaper className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            {news.length}
          </span>
          <span className="text-[11px] text-slate-500">
            {news.filter((n) => n.published).length} Terbit
          </span>
        </div>

        <div
          onClick={() => onSelectSection('artikel')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Artikel Santri</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            {articles.length}
          </span>
          <span className="text-[11px] text-slate-500">
            {articles.filter((a) => a.published).length} Terbit
          </span>
        </div>

        <div
          onClick={() => onSelectSection('dokumentasi')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pustaka Media</span>
            <Image className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            {media.length}
          </span>
          <span className="text-[11px] text-slate-500">Foto Tersimpan</span>
        </div>
      </div>

      {/* Shortcut Management Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-serif font-bold text-slate-900">
          Aksi Cepat Pengurus
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onSelectSection('program')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-950 block">Kelola 12 Program Kerja</span>
            <span className="text-[11px] text-slate-500 block">Edit jadwal, kategori, status publish, atau tambah agenda baru.</span>
          </button>

          <button
            onClick={() => onSelectSection('berita')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-950 block">Tulis Berita Baru</span>
            <span className="text-[11px] text-slate-500 block">Buat rilis kabar kegiatan santri dan upload dokumentasi.</span>
          </button>

          <button
            onClick={() => onSelectSection('statistik')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-950 block">Perbarui Data Statistik</span>
            <span className="text-[11px] text-slate-500 block">Ubah angka santri, alumni, program, atau pertahankan tanda strip (—).</span>
          </button>
        </div>
      </div>

      {/* Live Audit Trail Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Log Aktivitas & Audit Trail Terkini
              </h3>
              <p className="text-xs text-slate-500">
                Aktivitas login, pembaruan kata sandi, dan perubahan data tersinkronisasi real-time antar perangkat.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectSection('audit')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Buka Log Lengkap (14)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Belum ada aktivitas tercatat hari ini. Semua tindakan perubahan konten dan sesi login akan otomatis dicatat di sini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{log.description}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded hidden sm:inline">
                    {log.action}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-shrink-0">
                  <span>{log.actor.name}</span>
                  <span>•</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Database Backup & Maintenance Panel */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-serif font-bold text-white">
            Pencadangan & Pemulihan Database (JSON)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simpan salinan cadangan seluruh data website (program, berita, dokumentasi, pengaturan) ke file lokal atau pulihkan kapan saja.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Unduh Backup Database (.json)</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Pulihkan Database dari File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 text-xs font-semibold transition-colors cursor-pointer border border-red-900/50 ml-auto"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>Reset ke Default Resmi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
