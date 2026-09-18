import React from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { JatibarayaLogo, JatibarayaOfficialEmblem } from '../../components/common/JatibarayaLogo';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Users,
  Compass,
  Sparkles,
  ChevronRight,
  MapPin,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onOpenNewsDetail?: (newsId: string) => void;
  onOpenProgramDetail?: (progId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenNewsDetail,
  onOpenProgramDetail,
}) => {
  const { data } = useJatibarayaData();
  const { settings, stats, programs, news, articles, media } = data;

  const hasCustomLogo =
    Boolean(settings.logoUrl) &&
    !settings.logoUrl.endsWith('jatibaraya-logo.svg') &&
    !settings.logoUrl.includes('assets/jatibaraya-logo.svg');

  const featuredPrograms = programs.filter((p) => p.published && p.featured).slice(0, 4);
  const latestNews = news.filter((n) => n.published).slice(0, 3);
  const latestArticles = articles.filter((a) => a.published).slice(0, 2);
  const highlightMedia = media.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-sky-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Ambient Glows mirroring Logo Colors: Sky Blue, Amber Gold, Emerald Green */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-8 text-center lg:text-left space-y-6">
              {/* Badge Wilayah */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 shadow-xs text-xs font-medium text-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Wilayah:</span>
                <span className="text-white font-semibold">
                  {settings.regions.join(' • ')}
                </span>
              </div>

              {/* Title & Name */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
                  {settings.name}
                </h1>
                <p className="text-lg sm:text-xl text-emerald-200 font-medium tracking-wide">
                  {settings.fullName}
                </p>
              </div>

              {/* Slogan */}
              <blockquote className="border-l-0 lg:border-l-4 border-amber-400/80 lg:pl-4 py-1 text-xl sm:text-2xl font-serif italic text-amber-300/95 font-normal">
                &ldquo;{settings.slogan}&rdquo;
              </blockquote>

              <p className="text-base text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {settings.description}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-btn-about"
                  onClick={() => onSelectTab('tentang')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Tentang Jatibaraya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="hero-btn-programs"
                  onClick={() => onSelectTab('program')}
                  className="px-6 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/90 text-white font-semibold text-sm border border-emerald-600/50 shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Lihat Program</span>
                </button>
              </div>
            </div>

            {/* Emblem / Logo Representation */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-400/30 backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-4 max-w-xs">
                <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-400/15 via-sky-500/10 to-transparent border border-amber-400/40 flex items-center justify-center min-w-[100px] min-h-[100px]">
                  {hasCustomLogo ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl drop-shadow-md"
                    />
                  ) : (
                    <JatibarayaOfficialEmblem size="xl" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                    {hasCustomLogo ? 'Foto Profil & Logo' : 'Lambang Resmi'}
                  </h3>
                  <p className="text-xs text-emerald-300 mt-1">
                    {hasCustomLogo
                      ? settings.fullName
                      : 'Globe Biru • Kujang Pasundan • 3 Kitab • 9 Bintang • Pita Hijau'}
                  </p>
                </div>
                <button
                  id="hero-view-symbol-btn"
                  onClick={() => onSelectTab('identitas')}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-amber-300 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pelajari Filosofi Lambang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TENTANG SINGKAT & STATISTIK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Tentang Singkat */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sekilas Organisasi</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Wadah Kekeluargaan Santri Priangan di Lirboyo
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              {settings.description}
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-serif font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Motto Perjuangan Santri:</span>
              </div>
              <p className="text-base font-serif italic text-emerald-900 font-medium pl-2 border-l-2 border-emerald-700">
                &ldquo;{settings.motto}&rdquo;
              </p>
            </div>
            <div className="pt-2">
              <button
                id="about-explore-btn"
                onClick={() => onSelectTab('tentang')}
                className="inline-flex items-center gap-2 text-emerald-800 font-semibold text-sm hover:text-emerald-950 transition-colors group cursor-pointer"
              >
                <span>Baca Visi, Misi, Sifat & Fungsi Selengkapnya</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-600" />
              </button>
            </div>
          </div>

          {/* 3. STATISTIK REALISTIS DENGAN KOMBINASI 4 WARNA LAMBANG */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-slate-700/60">
              <div>
                <h3 className="text-lg font-serif font-bold text-white">Statistik Organisasi</h3>
                <p className="text-xs text-slate-300">Tahun Rujukan: {stats.referenceYear}</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                Data Resmi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              {/* 1. Warga Santri - Emerald Green (Nafas Pesantren) */}
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-center shadow-xs">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono block">
                  {stats.wargaCount || '—'}
                </span>
                <span className="text-xs text-emerald-200 mt-1 block">Warga Santri</span>
              </div>

              {/* 2. Alumni - Cerulean Sky Blue (Wawasan Global) */}
              <div className="p-4 rounded-2xl bg-sky-950/70 border border-sky-500/30 text-center shadow-xs">
                <span className="text-3xl font-extrabold text-sky-400 font-mono block">
                  {stats.alumniCount || '—'}
                </span>
                <span className="text-xs text-sky-200 mt-1 block">Alumni</span>
              </div>

              {/* 3. Program Kerja - Amber Gold (Kujang Priangan) */}
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-center shadow-xs">
                <span className="text-3xl font-extrabold text-amber-400 font-mono block">
                  {stats.programCount || programs.length || '—'}
                </span>
                <span className="text-xs text-amber-200 mt-1 block">Program Kerja</span>
              </div>

              {/* 4. Kegiatan - Ruby Crimson (9 Bintang Walisongo) */}
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-center shadow-xs">
                <span className="text-3xl font-extrabold text-rose-400 font-mono block">
                  {stats.kegiatanCount || '—'}
                </span>
                <span className="text-xs text-rose-200 mt-1 block">Kegiatan</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-6 text-center italic">
              *Angka statistik dikelola secara berkala oleh pengurus melalui Dashboard Admin.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PROGRAM UNGGULAN SECTION */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Khidmah Nyata</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900">
                Program Unggulan Jatibaraya
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Rangkaian kegiatan terencana santri Priangan untuk spiritual, keilmuan, dan pelayanan umat.
              </p>
            </div>
            <button
              id="view-all-programs-btn"
              onClick={() => onSelectTab('program')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-900 bg-white border border-emerald-200 shadow-xs hover:bg-emerald-50 transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Semua Program (12)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {prog.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {prog.schedule.split('(')[0].trim()}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Prioritas Khidmah</span>
                  <button
                    onClick={() => {
                      if (onOpenProgramDetail) onOpenProgramDetail(prog.id);
                      else onSelectTab('program');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BERITA & ARTIKEL TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Kabar & Wawasan</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Berita & Publikasi Terbaru
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Informasi terkini kegiatan Jatibaraya dan karya tulis reflektif warga santri.
            </p>
          </div>
          <button
            id="view-all-info-btn"
            onClick={() => onSelectTab('informasi')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Buka Arsip Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Berita Utama Column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">
              Berita Kegiatan Terkini
            </h3>
            {latestNews.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-sm">
                Belum ada berita yang dipublikasikan.
              </div>
            ) : (
              latestNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="w-full sm:w-44 h-32 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-800 flex items-center justify-center p-3 text-center">
                        <span className="text-[11px] text-amber-300 font-serif font-semibold">
                          Media Baraya
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                        {item.category}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.summary}
                    </p>
                    <button
                      onClick={() => {
                        if (onOpenNewsDetail) onOpenNewsDetail(item.id);
                        else onSelectTab('informasi');
                      }}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Artikel Santri Column */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">
              Artikel & Refleksi Santri
            </h3>
            {latestArticles.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-sm">
                Belum ada artikel yang dipublikasikan.
              </div>
            ) : (
              latestArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="text-amber-700 font-semibold">{art.category}</span>
                    <span>{art.date}</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {art.summary}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Oleh: <strong className="text-slate-700 font-medium">{art.author}</strong></span>
                    <button
                      onClick={() => onSelectTab('informasi')}
                      className="font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    >
                      Baca Artikel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. DOKUMENTASI FOTO KEGIATAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Dokumentasi</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Galeri Momen & Kegiatan
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Rekam jejak kebersamaan warga Jatibaraya di Lirboyo dan Priangan.
            </p>
          </div>
          <button
            id="view-gallery-btn"
            onClick={() => onSelectTab('dokumentasi')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <span>Buka Galeri Foto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlightMedia.map((m) => (
            <div
              key={m.id}
              className="group relative h-64 rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200"
            >
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 p-5 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                  {m.category}
                </span>
                <h4 className="text-sm font-serif font-bold text-white leading-snug mt-1">
                  {m.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {m.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white p-8 sm:p-14 text-center relative overflow-hidden border border-emerald-800/40 shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          <div className="relative max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              Khidmah Santri Priangan
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
              &ldquo;{settings.ctaText}&rdquo;
            </h2>
            <p className="text-base text-emerald-200 max-w-xl mx-auto leading-relaxed">
              {settings.ctaSubtext}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                id="cta-contact-btn"
                onClick={() => onSelectTab('kontak')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                Hubungi Pengurus
              </button>
              <button
                id="cta-programs-btn"
                onClick={() => onSelectTab('program')}
                className="px-6 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-sm border border-emerald-600/40 transition-all cursor-pointer"
              >
                Lihat Agenda Kegiatan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
