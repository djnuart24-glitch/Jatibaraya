import React, { useState, useEffect } from 'react';
import { AuditLogItem, AuditLogCategory } from '../../types';
import { subscribeAuditLogs, clearAuditLogs, getCachedAuditLogs } from '../../services/auditService';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Clock,
  User,
  Smartphone,
  CheckCircle2,
  KeyRound,
  FileText,
  Layers,
  Settings,
  Database,
  Calendar,
} from 'lucide-react';

export const AdminAuditView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(() => getCachedAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    const unsubscribe = subscribeAuditLogs((newLogs) => {
      setLogs(newLogs);
    });
    return () => unsubscribe();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs(getCachedAuditLogs());
      setIsRefreshing(false);
      showToast('Log aktivitas telah dimutakhirkan dari cloud.');
    }, 400);
  };

  const handleClearLogs = async () => {
    try {
      await clearAuditLogs();
      setLogs([]);
      setIsClearModalOpen(false);
      showToast('Seluruh riwayat log audit berhasil dibersihkan.');
    } catch (err: any) {
      showToast('Gagal membersihkan log audit: ' + (err?.message || 'Error'));
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jatibaraya-audit-trail-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Log audit berhasil diekspor.');
  };

  // Filtering
  const filteredLogs = logs.filter((log) => {
    const matchCategory =
      selectedCategory === 'all' ||
      log.category === selectedCategory ||
      (selectedCategory === 'content' &&
        ['program', 'news', 'article', 'announcement', 'media'].includes(log.category));

    const query = searchQuery.toLowerCase();
    const matchQuery =
      !query ||
      log.action.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query) ||
      (log.details && log.details.toLowerCase().includes(query)) ||
      log.actor.name.toLowerCase().includes(query) ||
      (log.deviceInfo && log.deviceInfo.toLowerCase().includes(query));

    return matchCategory && matchQuery;
  });

  // Category counts
  const totalCount = logs.length;
  const authCount = logs.filter((l) => l.category === 'auth').length;
  const contentCount = logs.filter((l) =>
    ['program', 'news', 'article', 'announcement', 'media'].includes(l.category)
  ).length;

  const formatLogDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getActionBadge = (log: AuditLogItem) => {
    const act = log.action.toUpperCase();
    if (act.includes('DELETE')) {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        label: 'HAPUS',
      };
    }
    if (act.includes('ADD') || act.includes('CREATE')) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'TAMBAH',
      };
    }
    if (act.includes('PASSWORD') || act.includes('LOGIN') || act.includes('AUTH')) {
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        label: 'KEAMANAN',
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'PERBARUI',
    };
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 text-white shadow-xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Bersihkan Semua Log Aktivitas?"
        message="Apakah Anda yakin ingin mengosongkan seluruh riwayat aktivitas admin? Tindakan ini akan menghapus log audit dari penyimpanan cloud dan tidak dapat dibatalkan."
        confirmText="Ya, Bersihkan Log"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleClearLogs}
        onCancel={() => setIsClearModalOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Log Aktivitas & Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Cloud Real-time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak setiap perubahan data, autentikasi pengurus, pembaruan kata sandi, dan sinkronisasi lintas perangkat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Muat Ulang Log"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={logs.length === 0}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Unduh Cadangan JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Ekspor JSON</span>
          </button>

          <button
            onClick={() => setIsClearModalOpen(true)}
            disabled={logs.length === 0}
            className="px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Bersihkan Riwayat Log"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Bersihkan</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Aktivitas</p>
            <p className="text-xl font-bold text-slate-900">{totalCount} Entri</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-50 text-sky-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Keamanan & Login</p>
            <p className="text-xl font-bold text-sky-800">{authCount} Rekaman</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perubahan Konten</p>
            <p className="text-xl font-bold text-emerald-800">{contentCount} Operasi</p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aksi, deskripsi, pengurus, atau perangkat..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'auth', label: 'Keamanan / Auth' },
            { id: 'content', label: 'Konten CMS' },
            { id: 'settings', label: 'Pengaturan' },
            { id: 'backup', label: 'Cadangan' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Belum ada riwayat aktivitas yang sesuai</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Setiap tindakan admin seperti menambah konten, mengubah kata sandi, atau mengubah pengaturan akan otomatis terekam di sini secara real-time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log);
              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatLogDate(log.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {log.description}
                    </p>

                    {log.details && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-[11px]">
                        {log.details}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col sm:items-end gap-3 text-[11px] text-slate-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-700">{log.actor.name}</span>
                      <span className="text-[10px] text-slate-400">({log.actor.role})</span>
                    </div>
                    {log.deviceInfo && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Smartphone className="w-3 h-3 text-slate-400" />
                        <span>{log.deviceInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
