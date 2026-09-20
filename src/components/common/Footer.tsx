import React, { useState, useEffect } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { JatibarayaLogo } from './JatibarayaLogo';
import { MapPin, Mail, Phone, ExternalLink, Shield, Activity } from 'lucide-react';
import { subscribeVisitorAnalytics } from '../../services/visitorService';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdmin }) => {
  const { data } = useJatibarayaData();
  const { settings, contact, socials } = data;
  const currentYear = new Date().getFullYear();

  const [visitorStats, setVisitorStats] = useState<{ total: number; today: number; online: number } | null>(null);

  useEffect(() => {
    const unsub = subscribeVisitorAnalytics((stats) => {
      const threeMinutesAgo = Date.now() - 3.5 * 60 * 1000;
      const online = Object.values(stats.activeSessions || {}).filter(
        (s) => s.lastActive && s.lastActive > threeMinutesAgo
      ).length;
      setVisitorStats({
        total: stats.totalVisitors || 0,
        today: stats.todayVisitors || 0,
        online: Math.max(1, online),
      });
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      {/* 4-Color Identity Accent Line: Emerald, Sky Blue, Amber, Rose */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600 via-sky-500 via-amber-500 to-rose-600 opacity-75" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Identity & Description */}
          <div className="lg:col-span-5 space-y-4">
            <JatibarayaLogo size="lg" showText={true} light={true} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-md pt-2">
              {settings.description}
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block mb-1">
                Wilayah Khidmah:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {settings.regions.map((reg) => (
                  <span
                    key={reg}
                    className="text-xs px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-mono">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-nav-beranda"
                  onClick={() => {
                    onSelectTab('beranda');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-tentang"
                  onClick={() => {
                    onSelectTab('tentang');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                >
                  Tentang, Visi & Misi
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-identitas"
                  onClick={() => {
                    onSelectTab('identitas');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                >
                  Filosofi Lambang
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-program"
                  onClick={() => {
                    onSelectTab('program');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                >
                  Program Khidmah
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-informasi"
                  onClick={() => {
                    onSelectTab('informasi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                >
                  Berita & Artikel
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-bahtsul"
                  onClick={() => {
                    window.location.hash = 'informasi?tipe=bahtsul';
                    onSelectTab('informasi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Hasil Bahtsul Masail</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-amber-300 border border-emerald-800/80">Fiqih</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-dokumentasi"
                  onClick={() => {
                    onSelectTab('dokumentasi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                >
                  Galeri Dokumentasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Media Sosial & Kontak */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-mono">
              Saluran Resmi & Kontak
            </h4>

            {/* Social Media Links */}
            <div className="flex flex-col gap-2">
              {socials
                .filter((s) => s.active)
                .map((social) => (
                  <a
                    key={social.id}
                    id={`footer-social-${social.platform}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-300 transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-amber-500/50 text-xs font-bold text-amber-400">
                      {social.platform === 'instagram' ? 'IG' : social.platform === 'tiktok' ? 'TT' : 'YT'}
                    </span>
                    <span>{social.name}: <strong className="text-white font-normal">{social.handle}</strong></span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 ml-auto" />
                  </a>
                ))}
            </div>

            {/* Real Contact Fields */}
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              {contact.address ? (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{contact.address}</span>
                </div>
              ) : null}

              {contact.whatsapp ? (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>WhatsApp: {contact.whatsapp}</span>
                </div>
              ) : null}

              {contact.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{contact.email}</span>
                </div>
              ) : null}

              {!contact.address && !contact.whatsapp && !contact.email && (
                <p className="italic text-slate-500 text-[11px]">
                  *Kontak resmi akan segera dilengkapi oleh pengurus.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Visitor Stats Live Counter Badge */}
        {visitorStats && (
          <div className="pt-6 pb-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] font-mono text-slate-400 border-t border-slate-900/90">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-bold">{visitorStats.online}</span>
              <span>Online Sekarang</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-xs">
              <span className="text-slate-500">Hari Ini:</span>
              <strong className="text-amber-400">{visitorStats.today}</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-xs">
              <span className="text-slate-500">Total Kunjungan:</span>
              <strong className="text-white">{visitorStats.total.toLocaleString('id-ID')}</strong>
            </span>
          </div>
        )}

        {/* Bottom Bar: Copyright & Admin Shortcut */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} <strong>{settings.name}</strong> — {settings.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="italic text-amber-500/80">&ldquo;{settings.slogan}&rdquo;</span>
            <button
              id="footer-admin-login-link"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors border border-slate-800 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Kelola Website (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
