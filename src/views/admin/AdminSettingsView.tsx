import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  Save,
  CheckCircle2,
  Settings,
  Shield,
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  AlertCircle,
  Palette,
  Sparkles,
  Cloud,
  RefreshCw,
  Database,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const {
    data,
    updateSettings,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToInitial,
    cloudStatus,
    isCloudSyncing,
    lastCloudSync,
    saveToCloud,
  } = useJatibarayaData();
  const { updatePassword } = useAuth();
  const { settings } = data;

  // General branding
  const [name, setName] = useState(settings.name);
  const [fullName, setFullName] = useState(settings.fullName);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // Status feedback
  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);
  const [cloudNotice, setCloudNotice] = useState<string | null>(null);

  const handleManualCloudSync = async () => {
    try {
      await saveToCloud();
      setCloudNotice('Berhasil disinkronkan ke cloud database secara real-time!');
      setTimeout(() => setCloudNotice(null), 4000);
    } catch {
      setCloudNotice('Gagal melakukan sinkronisasi. Periksa koneksi internet.');
      setTimeout(() => setCloudNotice(null), 4000);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: name.trim(),
      fullName: fullName.trim(),
      primaryColor,
      accentColor,
      logoUrl: logoUrl || undefined,
    });

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSavedTime(now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (newPassword.length < 6) {
      setPasswordNotice({ text: 'Kata sandi baru minimal 6 karakter.', isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ text: 'Konfirmasi kata sandi baru tidak cocok.', isError: true });
      return;
    }

    const res = await updatePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordNotice({ text: res.message, isError: false });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordNotice({ text: res.message, isError: true });
    }
  };

  const handleExport = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_jatibaraya_database_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupNotice('File backup JSON berhasil diunduh ke komputer/HP Anda!');
    setTimeout(() => setBackupNotice(null), 5000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        setBackupNotice('Database berhasil dipulihkan dari file JSON!');
        setTimeout(() => setBackupNotice(null), 5000);
      } else {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Kembalikan semua data ke pengaturan awal resmi Jatibaraya? Perubahan lokal Anda akan di-reset.')) {
      resetToInitial();
      setBackupNotice('Data berhasil dikembalikan ke kondisi awal resmi.');
      setTimeout(() => setBackupNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Settings className="w-4 h-4 text-amber-500" />
          <span>Menu 13: Pengaturan Umum & Keamanan</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
          Pengaturan Sistem & Branding
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur nama identitas, logo, skema warna, ganti kata sandi pengurus, dan cadangan database.
        </p>
      </div>

      {/* Global Notice Banners */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border border-emerald-600 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Pengaturan Branding Berhasil Disimpan!</p>
              <p className="text-[11px] text-emerald-200">Pukul {savedTime} WIB • Perubahan langsung aktif.</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-800 rounded border border-emerald-700">
            Aktif
          </span>
        </div>
      )}

      {backupNotice && (
        <div className="p-4 rounded-2xl bg-amber-900 text-white shadow-lg border border-amber-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0" />
          <p className="text-xs font-bold">{backupNotice}</p>
        </div>
      )}

      {/* 1. Branding & Identitas Dasar */}
      <form onSubmit={handleSaveBranding} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-serif font-bold text-slate-900">
              Nama & Tampilan Identitas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Nama Singkat / Brand</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="JATIBARAYA"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold tracking-wider uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Nama Lengkap Organisasi</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jam'iyyah Thullabi Bandung Garut Sumedang Raya"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-700" />
                <span>Warna Primer (Hijau Pesantren)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                <span>Warna Aksen (Emas Priangan)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <ImageUploader
              label="Logo Organisasi (Opsional, jika ingin mengunggah file gambar kustom)"
              categoryFolder="LOGO"
              currentImageUrl={logoUrl}
              onImageSelected={setLogoUrl}
            />
            {logoUrl && logoUrl !== '/assets/jatibaraya-logo.svg' && (
              <button
                type="button"
                onClick={() => setLogoUrl('/assets/jatibaraya-logo.svg')}
                className="text-xs text-emerald-800 hover:text-emerald-950 underline font-medium cursor-pointer"
              >
                Gunakan Lambang Vektor Resmi (Default)
              </button>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer ${
                isSaved ? 'bg-emerald-600 text-white' : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{isSaved ? '✓ Branding Tersimpan!' : 'Simpan Pengaturan Branding'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. Ganti Kata Sandi Portal Pengurus */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-serif font-bold text-slate-900">
              Ganti Kata Sandi Portal Pengurus
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            ✓ Sinkron Lintas Perangkat (Cloud Firestore)
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Pembaruan kata sandi di sini langsung disinkronkan ke database cloud. Seluruh perangkat dan laptop pengurus yang mengakses portal CMS akan otomatis menggunakan kata sandi baru.
        </p>

        {passwordNotice && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordNotice.isError
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            {passwordNotice.isError ? (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            )}
            <span>{passwordNotice.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama (cth: jatibaraya2026 atau admin123)"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Ulangi Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang kata sandi baru"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Perbarui Kata Sandi</span>
          </button>
        </form>
      </div>

      {/* 3. Database Cloud Online (Firebase Firestore Real-time) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-serif font-bold text-slate-900">
              Database Cloud Online (Firebase Firestore)
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Tersambung & Aktif</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Sistem database online terhubung langsung ke <strong>Google Cloud Firebase Firestore</strong>. Setiap kali Anda mengedit logo, berita, artikel, program, atau profil dari browser/perangkat manapun, perubahannya <strong>otomatis tersimpan di cloud</strong> dan langsung tampil secara real-time di seluruh HP dan laptop pengunjung.
        </p>

        {cloudNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{cloudNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Status Koneksi</span>
            <span className="text-xs font-bold text-emerald-800 mt-0.5 block flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              {cloudStatus === 'connected' ? 'Real-time Terhubung' : 'Sedang Sinkronisasi...'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Sinkronisasi Terakhir</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5 block font-mono">
              {lastCloudSync ? `${lastCloudSync} WIB` : 'Baru Saja'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Proyek Cloud ID</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5 block font-mono">
              valued-striker-w0w9t
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleManualCloudSync}
            disabled={isCloudSyncing}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isCloudSyncing ? 'animate-spin' : ''}`} />
            <span>{isCloudSyncing ? 'Menyinkronkan ke Cloud...' : 'Sinkronkan ke Cloud Sekarang'}</span>
          </button>
          <span className="text-[11px] text-slate-500">
            *Data juga otomatis disimpan setiap kali Anda menekan tombol simpan di tiap menu admin.
          </span>
        </div>
      </div>

      {/* 4. Cadangan & Pemulihan Database (Ekspor/Impor JSON) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Download className="w-4 h-4 text-emerald-700" />
          <h2 className="text-base font-serif font-bold text-slate-900">
            Cadangan & Pemulihan Database (JSON)
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Gunakan fitur ini untuk menyimpan seluruh data website (program, berita, artikel, galeri, kontak) ke dalam file JSON di komputer/HP Anda, atau memulihkan data jika berganti perangkat atau browser.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Unduh Cadangan Database (.json)</span>
          </button>

          <label className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer border border-slate-200">
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>Pulihkan dari File (.json)</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-2 border border-red-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Reset ke Standar Awal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
