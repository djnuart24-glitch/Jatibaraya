import React from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { useMetaTags } from '../../hooks/useMetaTags';
import { ContactForm } from '../../components/common/ContactForm';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { data } = useJatibarayaData();
  const { contact, socials, settings } = data;

  // Dynamic SEO & Title for Contact Page
  useMetaTags(
    `Kontak & Sekretariat — ${settings.name}`,
    `Hubungi pengurus resmi ${settings.fullName || settings.name}. Saluran silaturahmi santri, alumni, walisantri Priangan (Bandung, Garut, Sumedang, Cimahi).`,
    settings.logoUrl || '/assets/jatibaraya-logo.png'
  );

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

      {/* Main Grid: Contact Form (Left) & Info Cards + Socials (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          <ContactForm />
        </div>

        {/* Right Col: Official Contact Info & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Informasi Kontak Resmi
          </h2>

          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Layanan WhatsApp
                </span>
                <p className="text-sm font-semibold text-slate-900">
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
                  Saluran komunikasi cepat seputar rombongan dan kegiatan santri.
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Surel Resmi (Email)
                </span>
                <p className="text-sm font-semibold text-slate-900">
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
                  Korespondensi administratif, surat delegasi, dan undangan formal.
                </p>
              </div>
            </div>

            {/* Alamat Sekretariat */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Sekretariat / Alamat
                </span>
                <p className="text-xs font-medium text-slate-900 leading-relaxed">
                  {contact.address ? (
                    contact.address
                  ) : (
                    <span className="text-slate-400 italic font-normal">Belum tersedia (—)</span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  Posko koordinasi santri Priangan di Pondok Pesantren Lirboyo Kediri dan koordinator Jawa Barat.
                </p>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="pt-2 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">
              Kanal Media Sosial
            </h3>
            <div className="space-y-2.5">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                      {social.platform === 'instagram' ? 'IG' : social.platform === 'tiktok' ? 'TT' : 'YT'}
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {social.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono">{social.handle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-5 rounded-2xl bg-emerald-950 text-emerald-100 space-y-2 border border-emerald-800">
            <div className="flex items-center gap-2 text-amber-400 font-serif font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi Resmi Organisasi</span>
            </div>
            <p className="text-[11px] text-emerald-300/90 leading-relaxed">
              Seluruh pengumuman resmi mengenai rombongan santri dan agenda walisantri hanya dipublikasikan melalui kanal resmi di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
