import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Save, CheckCircle2, Home, Sparkles, Compass, AlertCircle } from 'lucide-react';

export const AdminHomeView: React.FC = () => {
  const { data, updateSettings } = useJatibarayaData();
  const { settings } = data;

  const [slogan, setSlogan] = useState(settings.slogan);
  const [motto, setMotto] = useState(settings.motto);
  const [description, setDescription] = useState(settings.description);
  const [ctaText, setCtaText] = useState(settings.ctaText);
  const [ctaSubtext, setCtaSubtext] = useState(settings.ctaSubtext || '');
  const [footerText, setFooterText] = useState(settings.footerText || '');

  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      slogan: slogan.trim(),
      motto: motto.trim(),
      description: description.trim(),
      ctaText: ctaText.trim(),
      ctaSubtext: ctaSubtext.trim() || undefined,
      footerText: footerText.trim() || undefined,
    });

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSavedTime(now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Home className="w-4 h-4 text-amber-500" />
            <span>Menu 2: Pengelolaan Beranda Publik</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            Pengaturan Konten Halaman Beranda
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuaikan teks sambutan, slogan utama, motto bahasa Sunda, dan ajakan bertindak pada halaman utama.
          </p>
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
              <p className="text-xs font-bold">Perubahan Beranda Berhasil Disimpan!</p>
              <p className="text-[11px] text-emerald-200">
                Pukul {savedTime} WIB • Teks langsung terpasang di tampilan website publik.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-800 rounded border border-emerald-700">
            Aktif
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Slogan & Motto */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-serif font-bold text-slate-900">
              Slogan & Motto Organisasi
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Slogan Resmi Website
            </label>
            <input
              type="text"
              required
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Satu Baraya, Satu Langkah, Berkhidmat untuk Umat."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400">Ditampilkan di header dan hero section halaman utama.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Motto Basa Sunda Jatibaraya
            </label>
            <input
              type="text"
              required
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="Ti Priangan, Mondok di Lirboyo, Berkhidmat Pikeun Umat."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium italic text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400">Motto kearifan lokal tanah Priangan.</p>
          </div>
        </div>

        {/* Card 2: Sambutan & Deskripsi Ringkas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Compass className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-serif font-bold text-slate-900">
              Sambutan & Deskripsi Wadah di Beranda
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Teks Pengantar / Deskripsi Beranda
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jatibaraya merupakan wadah kekeluargaan santri Priangan..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400">
              Penjelasan inti wadah kekeluargaan santri Bandung, Garut, Sumedang, dan Cimahi di Lirboyo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Teks Banner Ajakan (CTA)
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Merawat Ukhuwah, Menumbuhkan Pengabdian."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Subteks Ajakan (CTA Subtext)
              </label>
              <input
                type="text"
                value={ctaSubtext}
                onChange={(e) => setCtaSubtext(e.target.value)}
                placeholder="Bersama membangun sinergi santri Priangan untuk kemaslahatan umat..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-700 block">
              Teks Ringkas Kaki Halaman (Footer)
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="Wadah kekeluargaan santri Priangan..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Klik tombol untuk menyimpan perubahan ke halaman Beranda.</span>
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
            <span>{isSaved ? '✓ Perubahan Berhasil Disimpan!' : 'Simpan Perubahan Beranda'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
