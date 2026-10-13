import React, { useState } from 'react';
import { useAuth, PRIMARY_SUPERADMIN_EMAIL, RENEWED_ADMIN_PASSWORD } from '../../context/AuthContext';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  KeyRound,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminUsersView: React.FC = () => {
  const {
    currentUser,
    authorizedAdmins,
    addAuthorizedAdmin,
    removeAuthorizedAdmin,
    isPrimaryAdmin,
  } = useAuth();

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'superadmin'>('admin');
  const [newNotes, setNewNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // Confirm delete modal
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!newEmail || !newEmail.includes('@')) {
      setNotice({ text: 'Mohon masukkan alamat email yang valid.', isError: true });
      return;
    }

    setLoading(true);
    try {
      const res = await addAuthorizedAdmin(newEmail, newName, newRole, newNotes);
      setNotice({ text: res.message, isError: !res.success });
      if (res.success) {
        setNewEmail('');
        setNewName('');
        setNewNotes('');
        setNewRole('admin');
      }
    } catch (err: any) {
      setNotice({ text: 'Terjadi kesalahan: ' + (err?.message || ''), isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!emailToDelete) return;
    try {
      const res = await removeAuthorizedAdmin(emailToDelete);
      setNotice({ text: res.message, isError: !res.success });
    } catch (err: any) {
      setNotice({ text: 'Gagal mencabut akses admin: ' + (err?.message || ''), isError: true });
    } finally {
      setEmailToDelete(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-mono font-medium border border-emerald-600/40">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>KONTROL AKSES KETAT GOOGLE GMAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Manajemen Akses Akun Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Hanya akun Google/Gmail yang diajukan oleh Admin Utama{' '}
            <strong className="text-amber-300 font-mono">({PRIMARY_SUPERADMIN_EMAIL})</strong> yang
            diizinkan masuk ke portal admin Jatibaraya.
          </p>
        </div>
      </div>

      {/* Status Notice */}
      {notice && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-200 ${
            notice.isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
          }`}
        >
          {notice.isError ? (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* 1. Primary Admin Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Shield className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-700">
                Otoritas Tertinggi
              </span>
              <h2 className="text-base font-serif font-bold text-slate-900">
                Admin Utama (Primary Super Admin)
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
            Permanen & Pengaju Resmi
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold font-mono">
              @
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 font-mono">
                {PRIMARY_SUPERADMIN_EMAIL}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Akun Google resmi organisasi pengelola website Jatibaraya
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Selalu Aktif</span>
            </span>
          </div>
        </div>

        {/* Current Renewed Password Info */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <KeyRound className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Kata Sandi Pengurus Terbaru: <span className="font-mono text-sm px-2 py-0.5 rounded bg-white border border-amber-300 text-slate-900 select-all">{RENEWED_ADMIN_PASSWORD}</span>
            </p>
            <p className="text-amber-800 text-[11px]">
              Sandi ini telah diperbarui secara otomatis dan disinkronkan ke cloud database untuk mengatasi masalah lupa kata sandi.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Form Ajukan Admin Baru */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              Ajukan / Daftarkan Akun Gmail Admin Baru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan alamat email Google (Gmail) pengurus yang ingin diberikan hak login admin.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>Alamat Akun Gmail *</span>
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="contoh: nama.pengurus@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400">
                Harus berupa email Google yang aktif digunakan oleh pengurus.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Nama Pengurus / Jabatan *</span>
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="contoh: Ust. Ahmad / Bidang Publikasi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tingkat Hak Akses</span>
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'superadmin')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="admin">Admin Standar (Kelola Berita, Artikel, Program, dll)</option>
                <option value="superadmin">Super Admin (Akses Penuh Pengelolaan)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Catatan / Keterangan (Opsional)
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="cth: Pengurus Cabang Garut masa khidmah 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Mendaftarkan...' : 'Daftarkan Akun Gmail Admin'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Daftar Admin yang Diajukan & Diizinkan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              Daftar Akun Gmail Admin yang Telah Diajukan ({authorizedAdmins.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akun-akun di bawah ini memiliki izin sah untuk masuk melalui tombol "Masuk dengan Google".
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Whitelist Real-time
          </span>
        </div>

        {authorizedAdmins.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
            <Mail className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              Belum Ada Admin Tambahan yang Diajukan
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Saat ini hanya Admin Utama ({PRIMARY_SUPERADMIN_EMAIL}) yang dapat masuk. Gunakan form di atas untuk mendaftarkan akun Gmail pengurus lainnya.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {authorizedAdmins.map((admin) => (
              <div
                key={admin.id || admin.email}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold font-mono flex-shrink-0">
                    {admin.name.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        {admin.email}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        admin.role === 'superadmin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {admin.role === 'superadmin' ? 'Super Admin' : 'Admin Konten'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      {admin.name} {admin.notes && <span className="text-slate-400 font-normal">({admin.notes})</span>}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Diajukan oleh: <strong>{admin.addedBy}</strong></span>
                      <span>•</span>
                      <span>{new Date(admin.addedAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setEmailToDelete(admin.email)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Cabut Izin Akses Admin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cabut Akses</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!emailToDelete}
        title="Cabut Izin Akses Admin"
        message={`Apakah Anda yakin ingin mencabut izin admin untuk akun Google "${emailToDelete}"? Pengguna ini tidak akan dapat login lagi ke portal.`}
        confirmText="Ya, Cabut Izin"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmailToDelete(null)}
      />
    </div>
  );
};
