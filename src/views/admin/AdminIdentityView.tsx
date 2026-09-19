import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { SymbolElement } from '../../types';
import { Save, CheckCircle2, Sparkles, Shield, AlertCircle, Upload } from 'lucide-react';
import { JatibarayaLogo } from '../../components/common/JatibarayaLogo';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const AdminIdentityView: React.FC = () => {
  const { data, updateSymbols, updateSettings } = useJatibarayaData();
  const { symbols, settings } = data;

  const [localSymbols, setLocalSymbols] = useState<SymbolElement[]>(symbols);
  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [logoNotice, setLogoNotice] = useState<string | null>(null);

  const handleLogoUpdate = (url: string) => {
    updateSettings({ logoUrl: url });
    setLogoNotice('Foto logo resmi berhasil disimpan ke database!');
    setTimeout(() => setLogoNotice(null), 4000);
  };

  React.useEffect(() => {
    setLocalSymbols(symbols);
  }, [symbols]);

  const handleMeaningChange = (index: number, meaning: string) => {
    const updated = [...localSymbols];
    updated[index] = { ...updated[index], meaning };
    setLocalSymbols(updated);
  };

  const handleColorChange = (index: number, elementColor: string) => {
    const updated = [...localSymbols];
    updated[index] = { ...updated[index], elementColor };
    setLocalSymbols(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSymbols(localSymbols);

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSavedTime(now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Pengelolaan Filosofi Identitas & Lambang Resmi</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
          Filosofi Elemen Lambang Resmi Jatibaraya
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola narasi filosofis resmi untuk Globe Biru, Tiga Kitab, Kujang Pasundan, 9 Bintang Merah, Pita Hijau, dan Kaligrafi Arab &ldquo;جاتي برايا&rdquo;.
        </p>
      </div>

      {/* Ketetapan Pedoman */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Pedoman Baku:</span> Lambang resmi ini tidak boleh diubah sedikitpun. Cukup tempelkan logo resmi ke seluruh media organisasi, kemudian jabarkan filosofi masing-masing elemen di bawah ini sesuai amanat AD/ART.
        </div>
      </div>

      {/* Inline Feedback Banner */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border border-emerald-600 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Filosofi Lambang Berhasil Disimpan!</p>
              <p className="text-[11px] text-emerald-200">
                Pukul {savedTime} WIB • Penjelasan langsung aktif di halaman Identitas publik.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-800 rounded border border-emerald-700">
            Aktif
          </span>
        </div>
      )}

      {/* Inline Feedback Banner for Logo */}
      {logoNotice && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border border-emerald-600 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">{logoNotice}</p>
              <p className="text-[11px] text-emerald-200">
                Logo resmi langsung diperbarui di seluruh halaman website publik dan admin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Lambang & Logo Uploader */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex-shrink-0 flex items-center justify-center min-w-[90px] min-h-[90px]">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Resmi"
                className="w-16 h-16 object-contain rounded-xl"
              />
            ) : (
              <JatibarayaLogo size="lg" light={true} />
            )}
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
              Pratinjau Lambang Asli
            </span>
            <h3 className="text-base font-serif font-bold text-white">
              Logo Resmi Jatibaraya Lirboyo
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Menghubungkan identitas santri Priangan (Kujang Emas) dengan tradisi keilmuan pesantren (Tiga Kitab), wawasan global (Globe Biru), serta keteladanan para wali (9 Bintang Merah).
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <ImageUploader
            label="Unggah File Foto Logo Resmi Asli (Pilih IMG_9022.png atau file logo resmi Anda)"
            categoryFolder="LOGO"
            currentImageUrl={settings.logoUrl || ''}
            onImageSelected={handleLogoUpdate}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {localSymbols.map((sym, index) => (
          <div
            key={sym.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-slate-300"
                  style={{ backgroundColor: sym.elementColor }}
                />
                <div>
                  <h3 className="text-sm font-serif font-bold text-slate-900">
                    Elemen {index + 1}: {sym.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Kode Elemen: {sym.iconName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-500 font-medium">Aksen Warna:</label>
                <input
                  type="color"
                  value={sym.elementColor}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Uraian Makna Filosofis
              </label>
              <textarea
                rows={3}
                required
                value={sym.meaning}
                onChange={(e) => handleMeaningChange(index, e.target.value)}
                placeholder={`Uraian makna filosofis dari ${sym.name}...`}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        ))}

        {/* Action Button */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Klik tombol untuk menyimpan narasi filosofi identitas.</span>
          </div>

          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaved ? 'text-white' : 'text-amber-400'}`} />
            <span>{isSaved ? '✓ Filosofi Lambang Berhasil Disimpan!' : 'Simpan Perubahan Identitas'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
