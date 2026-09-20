import React, { useState, useEffect } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { AuditLogItem, VisitorAnalyticsData } from '../../types';
import { subscribeAuditLogs } from '../../services/auditService';
import { subscribeVisitorAnalytics } from '../../services/visitorService';
import {
  Layers,
  Newspaper,
  BookOpen,
  Scroll,
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
  Activity,
  Users,
  Eye,
  Globe,
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
  const { programs, news, articles, bahtsulMasail, announcements, media, settings } = data;
  const bahtsulCount = (bahtsulMasail || []).length;
  const bahtsulPublishedCount = (bahtsulMasail || []).filter((b) => b.published).length;

  const [notification, setNotification] = useState('');
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorAnalyticsData | null>(null);

  useEffect(() => {
    const unsubAudit = subscribeAuditLogs((logs) => {
      setRecentLogs(logs.slice(0, 4));
    });
    const unsubVisitor = subscribeVisitorAnalytics((stats) => {
      setVisitorStats(stats);
    });
    return () => {
      unsubAudit();
      unsubVisitor();
    };
  }, []);

  const activeOnlineCount = React.useMemo(() => {
    if (!visitorStats?.activeSessions) return 0;
    const threeAndHalfMinutesAgo = Date.now() - 3.5 * 60 * 1000;
    return Object.values(visitorStats.activeSessions).filter(
      (s) => s.lastActive && s.lastActive > threeAndHalfMinutesAgo
    ).length;
  }, [visitorStats]);

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

      {/* Live Visitor Monitoring Highlight Widget */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 relative">
            <Activity className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Live Traffic Monitoring
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                ● Real-Time
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-0.5">
              {activeOnlineCount} Pengunjung Sedang Online
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hari ini: <strong className="text-slate-800">{visitorStats?.todayVisitors ?? 0} pengunjung</strong> ({visitorStats?.todayPageviews ?? 0} tayangan) • Total: {(visitorStats?.totalVisitors ?? 0).toLocaleString('id-ID')} orang
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectSection('pengunjung')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Buka Pantau Pengunjung Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Summary Cards (Mobile Friendly) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
          onClick={() => onSelectSection('bahtsul')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Bahtsul Masail</span>
            <Scroll className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            {bahtsulCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            {bahtsulPublishedCount} Terpublikasi
          </span>
        </div>

        <div
          onClick={() => onSelectSection('dokumentasi')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2 col-span-2 sm:col-span-1"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => onSelectSection('bahtsul')}
            className="p-4 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-300 transition-all text-left space-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 block">Input Hasil Bahtsul Masail</span>
              <Scroll className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-[11px] text-emerald-900 block">Ketetapan hukum fikih, as-su&apos;al, al-jawab, dan kutipan ta&apos;bir turats.</span>
          </button>

          <button
            onClick={() => onSelectSection('artikel')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 block">Tulis Artikel Santri</span>
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <span className="text-[11px] text-slate-500 block">Karya tulis, refleksi spiritual, kajian ilmiah santri Priangan.</span>
          </button>

          <button
            onClick={() => onSelectSection('berita')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 block">Tulis Berita Kegiatan</span>
              <Newspaper className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-[11px] text-slate-500 block">Rilis kabar agenda, safari, atau pengumuman resmi organisasi.</span>
          </button>

          <button
            onClick={() => onSelectSection('program')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-950 block">Kelola 12 Program Kerja</span>
            <span className="text-[11px] text-slate-500 block">Edit jadwal, status publish, atau tambah agenda baru.</span>
          </button>

          <button
            onClick={() => onSelectSection('statistik')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-950 block">Perbarui Data Statistik</span>
            <span className="text-[11px] text-slate-500 block">Ubah angka santri, alumni, atau pertahankan tanda strip (—).</span>
          </button>

          <button
            onClick={() => onSelectSection('dokumentasi')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all text-left space-y-1 cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-950 block">Upload Dokumentasi Foto</span>
            <span className="text-[11px] text-slate-500 block">Tambahkan foto kegiatan galeri santri dan safari dakwah.</span>
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
