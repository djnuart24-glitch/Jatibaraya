import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { Send, MessageCircle, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormData {
  nama: string;
  asalDaerah: string;
  keperluan: string;
  pesan: string;
}

interface FormErrors {
  nama?: string;
  asalDaerah?: string;
  keperluan?: string;
  pesan?: string;
}

const REGION_OPTIONS = [
  'Bandung (Kota / Kab / KBB)',
  'Garut',
  'Sumedang',
  'Cimahi',
  'Lainnya (Luar Priangan)',
];

const PURPOSE_OPTIONS = [
  'Silaturahmi & Kemitraan',
  'Informasi Rombongan Liburan Santri',
  'Pendaftaran Anggota / Pendataan Warga',
  'Pertanyaan Fiqih & Bahtsul Masail',
  'Media, Dokumentasi & Publikasi',
  'Lainnya',
];

export const ContactForm: React.FC = () => {
  const { data } = useJatibarayaData();
  const { contact, settings } = data;

  const [formData, setFormData] = useState<FormData>({
    nama: '',
    asalDaerah: '',
    keperluan: '',
    pesan: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pure TypeScript Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama lengkap wajib diisi.';
    } else if (formData.nama.trim().length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter.';
    }

    if (!formData.asalDaerah) {
      newErrors.asalDaerah = 'Silakan pilih asal daerah Anda.';
    }

    if (!formData.keperluan) {
      newErrors.keperluan = 'Silakan pilih keperluan komunikasi.';
    }

    if (!formData.pesan.trim()) {
      newErrors.pesan = 'Isi pesan tidak boleh kosong.';
    } else if (formData.pesan.trim().length < 5) {
      newErrors.pesan = 'Pesan minimal 5 karakter.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 1. Send via WhatsApp
  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const rawPhone = contact.whatsapp || '6281234567890';
    // Normalize to international digits (remove leading 0 or + or spaces)
    let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const messageText = `*Pesan Masuk Website ${settings.name}*\n` +
      `--------------------------------\n` +
      `👤 *Nama Pengirim:* ${formData.nama.trim()}\n` +
      `📍 *Asal Daerah:* ${formData.asalDaerah}\n` +
      `📌 *Keperluan:* ${formData.keperluan}\n` +
      `--------------------------------\n` +
      `💬 *Isi Pesan:*\n${formData.pesan.trim()}\n\n` +
      `_Dikirim melalui formulir kontak resmi Jatibaraya._`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSuccessMessage('Membuka WhatsApp untuk mengirim pesan...');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // 2. Send via Email (mailto)
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const emailTarget = contact.email || 'sekretariat.jatibaraya@gmail.com';
    const emailSubject = `[Kontak Website ${settings.name}] - ${formData.keperluan} dari ${formData.nama}`;
    const emailBody = `Yth. Pengurus ${settings.fullName || settings.name},\n\n` +
      `Berikut adalah rincian pesan yang dikirim melalui formulir resmi website:\n\n` +
      `Nama Pengirim: ${formData.nama.trim()}\n` +
      `Asal Daerah  : ${formData.asalDaerah}\n` +
      `Keperluan    : ${formData.keperluan}\n\n` +
      `Isi Pesan:\n${formData.pesan.trim()}\n\n` +
      `Salam silaturahmi,\n${formData.nama.trim()}`;

    const mailtoUrl = `mailto:${emailTarget}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;

    setSuccessMessage('Membuka aplikasi surel (email) Anda...');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <span>Kirim Pesan Langsung</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pesan akan otomatis diformat dan diteruskan ke saluran WhatsApp atau Email resmi pengurus {settings.name}.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form className="space-y-4">
        {/* Field: Nama Pengirim */}
        <div className="space-y-1">
          <label htmlFor="form-nama" className="block text-xs font-semibold text-slate-700">
            Nama Pengirim <span className="text-red-500">*</span>
          </label>
          <input
            id="form-nama"
            name="nama"
            type="text"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap atau panggilan..."
            className={`w-full px-4 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.nama
                ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
            }`}
          />
          {errors.nama && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.nama}</span>
            </p>
          )}
        </div>

        {/* Row: Asal Daerah & Keperluan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field: Asal Daerah */}
          <div className="space-y-1">
            <label htmlFor="form-asal-daerah" className="block text-xs font-semibold text-slate-700">
              Asal Daerah <span className="text-red-500">*</span>
            </label>
            <select
              id="form-asal-daerah"
              name="asalDaerah"
              value={formData.asalDaerah}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.asalDaerah
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
              }`}
            >
              <option value="">Pilih Asal Daerah...</option>
              {REGION_OPTIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.asalDaerah && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.asalDaerah}</span>
              </p>
            )}
          </div>

          {/* Field: Keperluan */}
          <div className="space-y-1">
            <label htmlFor="form-keperluan" className="block text-xs font-semibold text-slate-700">
              Keperluan Komunikasi <span className="text-red-500">*</span>
            </label>
            <select
              id="form-keperluan"
              name="keperluan"
              value={formData.keperluan}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.keperluan
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
              }`}
            >
              <option value="">Pilih Keperluan...</option>
              {PURPOSE_OPTIONS.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
            {errors.keperluan && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.keperluan}</span>
              </p>
            )}
          </div>
        </div>

        {/* Field: Pesan */}
        <div className="space-y-1">
          <label htmlFor="form-pesan" className="block text-xs font-semibold text-slate-700">
            Isi Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="form-pesan"
            name="pesan"
            rows={4}
            value={formData.pesan}
            onChange={handleChange}
            placeholder="Tuliskan pesan, pertanyaan, atau permohonan informasi Anda secara jelas..."
            className={`w-full px-4 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all leading-relaxed ${
              errors.pesan
                ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
            }`}
          />
          {errors.pesan && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.pesan}</span>
            </p>
          )}
        </div>

        {/* Action Buttons: WhatsApp & Email */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Kirim via WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Kirim via Email</span>
          </button>
        </div>
      </form>
    </div>
  );
};
