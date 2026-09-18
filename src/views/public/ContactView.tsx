import React from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Clock,
  Send,
  ShieldCheck,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { data } = useJatibarayaData();
  const { contact, socials, settings } = data;

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Silaturahmi & Komunikasi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
          Kontak & Saluran Resmi
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Ruang silaturahmi bagi santri, alumni, walisantri se-Priangan (Bandung, Garut, Sumedang, Cimahi) dan masyarakat umum.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Contact Information Cards */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Informasi Kontak Resmi
          </h2>

          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Layanan WhatsApp
                </span>
                <p className="text-base font-semibold text-slate-900">
                  {contact.whatsapp ? (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 hover:underline"
                    >
                      {contact.whatsapp}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic font-normal">Belum tersedia (—)</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  Saluran komunikasi cepat seputar informasi kegiatan dan rombongan.
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Surel Resmi (Email)
                </span>
                <p className="text-base font-semibold text-slate-900">
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-emerald-800 hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic font-normal">Belum tersedia (—)</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  Korespondensi administratif, persuratan delegasi, dan undangan formal.
                </p>
              </div>
            </div>

            {/* Alamat */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Sekretariat / Alamat
                </span>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {contact.address ? (
                    contact.address
                  ) : (
                    <span className="text-slate-400 italic font-normal">Belum tersedia (—)</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  Posko koordinasi santri Priangan di Pondok Pesantren Lirboyo Kediri dan koordinator wilayah Jawa Barat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Media Sosial Resmi */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Kanal Media Sosial
          </h2>
          <p className="text-xs text-slate-500">
            Ikuti informasi terkini, kajian live, dan dokumentasi khidmah santri di saluran resmi Media Baraya.
          </p>

          <div className="space-y-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                    {social.platform === 'instagram' ? 'IG' : social.platform === 'tiktok' ? 'TT' : 'YT'}
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {social.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">{social.handle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                  <span>Kunjungi</span>
                  <ExternalLink className="w-4 h-4 text-amber-600" />
                </div>
              </a>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950 text-emerald-100 space-y-2 border border-emerald-800">
            <div className="flex items-center gap-2 text-amber-400 font-serif font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi Resmi Organisasi</span>
            </div>
            <p className="text-xs text-emerald-300/90 leading-relaxed">
              Seluruh pengumuman mengenai rombongan liburan santri, safari dakwah Ramadan, dan agenda walisantri hanya dipublikasikan melalui kanal resmi di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
