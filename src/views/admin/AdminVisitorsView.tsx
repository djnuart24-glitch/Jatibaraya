import React, { useState, useEffect, useMemo } from 'react';
import {
  subscribeVisitorAnalytics,
  resetAnalyticsData,
  exportVisitsToCSV,
} from '../../services/visitorService';
import { VisitorAnalyticsData, VisitLogEntry } from '../../types';
import {
  Users,
  Activity,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  Download,
  RotateCcw,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const PAGE_NAMES: Record<string, string> = {
  beranda: 'Beranda Utama',
  tentang: 'Tentang & Profil Organisasi',
  identitas: 'Identitas 5 Simbol Logo',
  program: 'Program Kerja & Agenda',
  informasi: 'Berita & Pengumuman',
  dokumentasi: 'Galeri & Dokumentasi',
  kontak: 'Kontak & Sekretariat',
  admin: 'Panel Manajemen Admin',
};

export const AdminVisitorsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<VisitorAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<'7days' | '14days'>('7days');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  const [notification, setNotification] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeVisitorAnalytics((data) => {
      setAnalytics(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Calculate real-time active online visitors within last 3.5 minutes
  const activeSessionsList = useMemo(() => {
    if (!analytics?.activeSessions) return [];
    const threeAndHalfMinutesAgo = Date.now() - 3.5 * 60 * 1000;
    return Object.values(analytics.activeSessions)
      .filter((s) => s.lastActive && s.lastActive > threeAndHalfMinutesAgo)
      .sort((a, b) => b.lastActive - a.lastActive);
  }, [analytics]);

  const activeOnlineCount = activeSessionsList.length;

  // Format daily chart data
  const chartDays = useMemo(() => {
    if (!analytics?.dailyStats) return [];
    const count = timeRange === '7days' ? 7 : 14;
    const days = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const stat = analytics.dailyStats[key] || { visitors: 0, pageviews: 0, date: key };
      const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      days.push({ ...stat, label });
    }
    return days;
  }, [analytics, timeRange]);

  const maxChartValue = useMemo(() => {
    if (chartDays.length === 0) return 10;
    const max = Math.max(...chartDays.map((d) => Math.max(d.visitors, d.pageviews)));
    return Math.max(max, 10);
  }, [chartDays]);

  // Page breakdown sorted
  const sortedPages = useMemo(() => {
    if (!analytics?.pageBreakdown) return [];
    const entries = Object.entries(analytics.pageBreakdown);
    const total = entries.reduce((acc, curr) => acc + curr[1], 0) || 1;
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([path, count]) => ({
        path,
        name: PAGE_NAMES[path] || `Halaman /${path}`,
        count,
        percent: Math.round((count / total) * 100),
      }));
  }, [analytics]);

  // Filtered recent visits
  const filteredVisits = useMemo(() => {
    if (!analytics?.recentVisits) return [];
    if (filterDevice === 'all') return analytics.recentVisits;
    return analytics.recentVisits.filter(
      (v) => v.device.toLowerCase() === filterDevice.toLowerCase()
    );
  }, [analytics, filterDevice]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (!analytics || !analytics.recentVisits) {
      showToast('Belum ada log kunjungan untuk diekspor.');
      return;
    }
    const csvContent = exportVisitsToCSV(analytics.recentVisits);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan_pengunjung_jatibaraya_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Laporan kunjungan (CSV) berhasil diunduh!');
  };

  // Reset analytics handler
  const handleResetConfirm = async () => {
    setIsResetting(true);
    try {
      await resetAnalyticsData();
      setShowResetModal(false);
      showToast('Data analitik berhasil di-reset.');
    } catch {
      alert('Gagal mereset data analitik.');
    } finally {
      setIsResetting(false);
    }
  };

  const deviceTotal =
    (analytics?.deviceBreakdown?.mobile || 0) +
    (analytics?.deviceBreakdown?.desktop || 0) +
    (analytics?.deviceBreakdown?.tablet || 0) || 1;

  const mobilePercent = Math.round(((analytics?.deviceBreakdown?.mobile || 0) / deviceTotal) * 100);
  const desktopPercent = Math.round(((analytics?.deviceBreakdown?.desktop || 0) / deviceTotal) * 100);
  const tabletPercent = Math.round(((analytics?.deviceBreakdown?.tablet || 0) / deviceTotal) * 100);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <Activity className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  Pemantau Pengunjung & Analitik Web
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Real-Time
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pantau statistik kunjungan, pengguna aktif online saat ini, perangkat, dan halaman terpopuler secara langsung.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2 transition-all border border-rose-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* 4 Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Live Online Right Now */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Activity className="w-24 h-24" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 font-mono">
                Aktif Saat Ini
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/80 text-[11px] text-emerald-200 border border-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Online</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-black tracking-tight text-white">
                {activeOnlineCount}
              </span>
              <span className="text-xs text-emerald-200 font-medium">pengunjung</span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Pengguna yang sedang membuka website dalam 3 menit terakhir.
            </p>
          </div>
        </div>

        {/* Card 2: Today's Visitors */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Pengunjung Hari Ini
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900">
              {analytics?.todayVisitors ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">orang</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Tayangan hari ini: <strong className="text-slate-800">{analytics?.todayPageviews ?? 0}</strong> kali
            </span>
          </div>
        </div>

        {/* Card 3: Total Visitors All-Time */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Total Pengunjung
            </span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900">
              {(analytics?.totalVisitors ?? 0).toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500 font-medium">akumulasi</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Jumlah pengunjung unik yang pernah mengakses website.
          </p>
        </div>

        {/* Card 4: Total Pageviews */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Total Tayangan Halaman
            </span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Eye className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900">
              {(analytics?.totalPageviews ?? 0).toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500 font-medium">tayangan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Rata-rata{' '}
            <strong className="text-slate-800">
              {analytics && analytics.totalVisitors > 0
                ? ((analytics.totalPageviews || 0) / (analytics.totalVisitors || 1)).toFixed(1)
                : '1.0'}
            </strong>{' '}
            halaman per pengunjung.
          </p>
        </div>
      </div>

      {/* Live Online Visitors Panel (If any active) */}
      {activeOnlineCount > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                Aktivitas Pengunjung yang Sedang Berlangsung ({activeOnlineCount})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Pembaruan Real-Time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeSessionsList.map((session, idx) => (
              <div
                key={session.sessionId || idx}
                className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    {session.device === 'Mobile' ? (
                      <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    ) : session.device === 'Tablet' ? (
                      <Tablet className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                    <span>{session.device} ({session.browser})</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                    Aktif
                  </span>
                </div>
                <div className="text-slate-600">
                  Membuka:{' '}
                  <strong className="text-slate-900 font-medium">
                    {PAGE_NAMES[session.currentPath] || session.pageTitle || `/${session.currentPath}`}
                  </strong>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 border-t border-emerald-200/50">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>
                    Terakhir aktif: {new Date(session.lastActive).toLocaleTimeString('id-ID')} WIB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Trend Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
              Grafik Tren Kunjungan Harian
            </h3>
            <p className="text-xs text-slate-500">
              Perbandingan jumlah pengunjung unik dan total tayangan halaman
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                timeRange === '7days'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setTimeRange('14days')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                timeRange === '14days'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              14 Hari Terakhir
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4">
          <div className="h-56 flex items-end gap-2 sm:gap-4 pb-6 border-b border-slate-200">
            {chartDays.map((day) => {
              const visitorHeightPercent = Math.max(8, Math.round((day.visitors / maxChartValue) * 100));
              const pageviewHeightPercent = Math.max(8, Math.round((day.pageviews / maxChartValue) * 100));

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] shadow-lg whitespace-nowrap pointer-events-none">
                    <span className="font-bold">{day.label}</span>
                    <span>{day.visitors} Pengunjung • {day.pageviews} Tayangan</span>
                  </div>

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Visitors Bar */}
                    <div
                      style={{ height: `${visitorHeightPercent}%` }}
                      className="w-1/2 max-w-[24px] rounded-t-lg bg-emerald-700 group-hover:bg-emerald-600 transition-all relative flex justify-center"
                    >
                      <span className="text-[10px] font-bold text-white absolute -top-5 hidden group-hover:block">
                        {day.visitors}
                      </span>
                    </div>
                    {/* Pageviews Bar */}
                    <div
                      style={{ height: `${pageviewHeightPercent}%` }}
                      className="w-1/2 max-w-[24px] rounded-t-lg bg-amber-400 group-hover:bg-amber-300 transition-all relative flex justify-center"
                    >
                      <span className="text-[10px] font-bold text-slate-800 absolute -top-5 hidden group-hover:block">
                        {day.pageviews}
                      </span>
                    </div>
                  </div>
                  {/* Day Label */}
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono mt-2 truncate max-w-full">
                    {day.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-700" />
              <span className="text-slate-600 font-medium">Pengunjung Unik</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-400" />
              <span className="text-slate-600 font-medium">Tayangan Halaman (Pageviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Deep Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Top Visited Pages */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-800" />
              <span>Halaman Paling Banyak Dikunjungi</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Popularitas</span>
          </div>

          <div className="space-y-4">
            {sortedPages.map((page, idx) => (
              <div key={page.path} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-mono text-slate-500">
                      {idx + 1}
                    </span>
                    <span>{page.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">
                      (/{page.path})
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{page.count}</strong>
                    <span className="text-slate-400 font-mono text-[11px]">
                      ({page.percent}%)
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(5, page.percent)}%` }}
                    className="h-full rounded-full bg-emerald-800 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Device & Browser Distribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-800" />
            <span>Distribusi Perangkat & Browser</span>
          </h3>

          {/* Device Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              Jenis Perangkat
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                <Smartphone className="w-5 h-5 mx-auto text-emerald-800" />
                <span className="text-xs font-medium text-slate-600 block">Smartphone</span>
                <span className="text-lg font-serif font-bold text-slate-900 block">
                  {mobilePercent}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {analytics?.deviceBreakdown?.mobile || 0} hits
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                <Monitor className="w-5 h-5 mx-auto text-sky-700" />
                <span className="text-xs font-medium text-slate-600 block">Komputer / Laptop</span>
                <span className="text-lg font-serif font-bold text-slate-900 block">
                  {desktopPercent}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {analytics?.deviceBreakdown?.desktop || 0} hits
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                <Tablet className="w-5 h-5 mx-auto text-amber-600" />
                <span className="text-xs font-medium text-slate-600 block">Tablet</span>
                <span className="text-lg font-serif font-bold text-slate-900 block">
                  {tabletPercent}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {analytics?.deviceBreakdown?.tablet || 0} hits
                </span>
              </div>
            </div>
          </div>

          {/* Browser Breakdown */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              Browser Web Pengguna
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-700">Google Chrome</span>
                <span className="font-bold text-slate-900">
                  {analytics?.browserBreakdown?.chrome || 0} kunjungan
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-700">Apple Safari</span>
                <span className="font-bold text-slate-900">
                  {analytics?.browserBreakdown?.safari || 0} kunjungan
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-700">Mozilla Firefox</span>
                <span className="font-bold text-slate-900">
                  {analytics?.browserBreakdown?.firefox || 0} kunjungan
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-semibold text-slate-700">Microsoft Edge & Lainnya</span>
                <span className="font-bold text-slate-900">
                  {(analytics?.browserBreakdown?.edge || 0) + (analytics?.browserBreakdown?.other || 0)} kunjungan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Visit Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-800" />
              <span>Log Aktivitas Kunjungan Terbaru</span>
            </h3>
            <p className="text-xs text-slate-500">
              Daftar sesi kunjungan yang tercatat secara real-time
            </p>
          </div>

          {/* Filter by device */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Filter:</span>
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-800"
            >
              <option value="all">Semua Perangkat</option>
              <option value="mobile">Smartphone Saja</option>
              <option value="desktop">Komputer Saja</option>
              <option value="tablet">Tablet Saja</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Halaman Diakses</th>
                <th className="py-3 px-4">Perangkat</th>
                <th className="py-3 px-4">Browser</th>
                <th className="py-3 px-4">Session ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length > 0 ? (
                filteredVisits.slice(0, 30).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(v.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })} WIB
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px]">
                          /{v.path}
                        </span>
                        <span>{PAGE_NAMES[v.path] || v.pageTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {v.device === 'Mobile' ? (
                          <Smartphone className="w-3 h-3 text-emerald-700" />
                        ) : v.device === 'Tablet' ? (
                          <Tablet className="w-3 h-3 text-amber-600" />
                        ) : (
                          <Monitor className="w-3 h-3 text-sky-700" />
                        )}
                        <span>{v.device}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{v.browser}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                      {v.sessionId}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    Belum ada riwayat kunjungan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-serif font-bold text-slate-900">
                Reset Data Statistik Pengunjung?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini akan mengosongkan log kunjungan dan memulai hitungan statistik analitik dari awal. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleResetConfirm}
                disabled={isResetting}
                className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 shadow-xs"
              >
                {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>Ya, Reset Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
