import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { SocialMediaItem } from '../../types';
import { Save, CheckCircle2, Share2, ExternalLink, Plus, Trash2 } from 'lucide-react';

export const AdminSocialView: React.FC = () => {
  const { data, updateSocials } = useJatibarayaData();
  const { socials } = data;

  const [localSocials, setLocalSocials] = useState<SocialMediaItem[]>(socials);
  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handleUpdateField = (id: string, field: keyof SocialMediaItem, value: any) => {
    setLocalSocials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocials(localSocials);
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
              <p className="text-xs font-bold">Kanal Media Sosial Berhasil Disimpan!</p>
              <p className="text-[11px] text-emerald-200">Pukul {savedTime} WIB • Tautan aktif diperbarui di website.</p>
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
          12. Pengaturan Kanal Media Sosial
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola tautan akun resmi Instagram, TikTok, dan YouTube milik Media Baraya.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-4">
        {localSocials.map((social) => (
          <div
            key={social.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
                  {social.platform === 'instagram' ? 'IG' : social.platform === 'tiktok' ? 'TT' : 'YT'}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 capitalize">
                    {social.name} ({social.platform})
                  </h3>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Uji Tautan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={social.active}
                  onChange={(e) => handleUpdateField(social.id, 'active', e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span>Aktifkan di Website</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Username / Handle</label>
                <input
                  type="text"
                  value={social.handle}
                  onChange={(e) => handleUpdateField(social.id, 'handle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">URL Tautan Profil</label>
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => handleUpdateField(social.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {isSaved ? '✓ Media sosial terverifikasi tersimpan' : 'Pastikan tautan dapat diakses publik'}
          </span>
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved ? 'bg-emerald-600 text-white' : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{isSaved ? '✓ Berhasil Disimpan!' : 'Simpan Semua Media Sosial'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
