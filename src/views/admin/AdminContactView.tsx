import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { Save, CheckCircle2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

export const AdminContactView: React.FC = () => {
  const { data, updateContact } = useJatibarayaData();
  const { contact } = data;

  const [whatsapp, setWhatsapp] = useState(contact.whatsapp || '');
  const [email, setEmail] = useState(contact.email || '');
  const [address, setAddress] = useState(contact.address || '');
  const [gmapsUrl, setGmapsUrl] = useState(contact.gmapsUrl || '');
  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact({
      whatsapp: whatsapp.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      gmapsUrl: gmapsUrl.trim() || undefined,
    });
    
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSavedTime(now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Inline Feedback Banner */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border border-emerald-600 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Informasi Kontak Berhasil Diperbarui!</p>
              <p className="text-[11px] text-emerald-200">Pukul {savedTime} WIB • Perubahan langsung tampil di halaman kontak publik.</p>
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
          11. Pengaturan Kontak Resmi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perbarui saluran WhatsApp, surel email, dan alamat sekretariat Jatibaraya.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <span>
          Bila ada saluran yang belum memiliki nomor atau email operasional resmi, kosongkan kolom tersebut. Website publik akan secara otomatis menampilkan status <em>&ldquo;Belum tersedia (—)&rdquo;</em> tanpa data palsu.
        </span>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Nomor WhatsApp Resmi</span>
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 081234567890 (atau kosongkan jika belum ada)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-700" />
              <span>Alamat Surel (Email) Resmi</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: jatibaraya@example.com (atau kosongkan)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>Alamat Sekretariat Lengkap</span>
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat sekretariat atau domisili posko koordinasi..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Tautan Google Maps (Opsional)</label>
            <input
              type="url"
              value={gmapsUrl}
              onChange={(e) => setGmapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {isSaved ? '✓ Data kontak terverifikasi tersimpan' : 'Klik tombol untuk menyimpan perubahan'}
          </span>
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved ? 'bg-emerald-600 text-white' : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{isSaved ? '✓ Berhasil Disimpan!' : 'Simpan Informasi Kontak'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
