import React from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { JatibarayaLogo } from '../../components/common/JatibarayaLogo';
import {
  Sparkles,
  Globe,
  BookOpen,
  Star,
  Compass,
  Award,
  Palette,
  CheckCircle2,
  Download,
  ShieldCheck,
  FileCheck,
  Layers,
  Feather
} from 'lucide-react';

interface IdentityViewProps {
  onSelectTab: (tab: string) => void;
}

export const IdentityView: React.FC<IdentityViewProps> = ({ onSelectTab }) => {
  const { data } = useJatibarayaData();
  const { settings, symbols } = data;

  // Metadata mapping for icons and colors corresponding to the 6 official elements
  const metaMap: Record<
    string,
    {
      number: string;
      badge: string;
      colorClass: string;
      borderClass: string;
      tagColor: string;
      icon: React.ElementType;
      category: string;
    }
  > = {
    globe: {
      number: '01',
      badge: 'Wawasan Intelektual & Global',
      colorClass: 'from-sky-500 via-sky-600 to-blue-700',
      borderClass: 'border-sky-500/30',
      tagColor: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: Globe,
      category: 'Dimensi Global',
    },
    books: {
      number: '02',
      badge: 'Tradisi Keilmuan Pesantren',
      colorClass: 'from-slate-700 via-slate-800 to-slate-900',
      borderClass: 'border-slate-400/30',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: BookOpen,
      category: 'Dimensi Turats',
    },
    kujang: {
      number: '03',
      badge: 'Identitas & Marwah Priangan',
      colorClass: 'from-amber-400 via-amber-500 to-orange-600',
      borderClass: 'border-amber-500/30',
      tagColor: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: Sparkles,
      category: 'Kearifan Lokal Sunda',
    },
    stars: {
      number: '04',
      badge: 'Sanad Spiritual & Keteladanan',
      colorClass: 'from-rose-500 via-red-600 to-red-700',
      borderClass: 'border-red-500/30',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: Star,
      category: 'Spiritualitas Walisongo',
    },
    ribbon: {
      number: '05',
      badge: 'Ukhuwah & Ikatan Baraya',
      colorClass: 'from-emerald-600 via-emerald-700 to-emerald-800',
      borderClass: 'border-emerald-500/30',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Award,
      category: 'Ikatan Kekeluargaan',
    },
    calligraphy: {
      number: '06',
      badge: 'Aksara Pegon & Janji Setia',
      colorClass: 'from-emerald-700 via-emerald-800 to-slate-950',
      borderClass: 'border-emerald-500/30',
      tagColor: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      icon: Feather,
      category: 'Identitas Santri Lirboyo',
    },
  };

  const symbolDetails = symbols.map((sym, index) => {
    const meta = metaMap[sym.iconName] || {
      number: `0${index + 1}`,
      badge: 'Unsur Lambang Resmi',
      colorClass: 'from-emerald-600 to-teal-700',
      borderClass: 'border-emerald-500/30',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Award,
      category: 'Identitas',
    };

    return {
      id: sym.id,
      number: meta.number,
      name: sym.name,
      badge: meta.badge,
      meaning: sym.meaning,
      colorClass: meta.colorClass,
      borderClass: meta.borderClass,
      tagColor: meta.tagColor,
      icon: meta.icon,
      category: meta.category,
      elementColor: sym.elementColor,
    };
  });

  const colorPalette = [
    {
      name: 'Kuning Emas Pasundan (Golden Amber)',
      hex: '#f59e0b',
      role: 'Warna Kujang & Marwah Priangan',
      description: 'Melambangkan keluhuran akhlak, martabat luhur tatar Pasundan, kebijaksanaan, dan cahaya ilmu pengetahuan santri.',
      bgClass: 'bg-amber-500',
    },
    {
      name: 'Biru Samudera (Cerulean Blue)',
      hex: '#0284c7',
      role: 'Warna Bola Dunia (Globe)',
      description: 'Melambangkan wawasan peradaban dunia, intelektualitas luas, keterbukaan respon global, dan ketenangan jiwa.',
      bgClass: 'bg-sky-600',
    },
    {
      name: 'Merah Walisongo (Crimson Red)',
      hex: '#dc2626',
      role: 'Warna 9 Bintang Melengkung',
      description: 'Melambangkan keberanian menegakkan kebenaran, daya juang santri yang menyala, dan cinta tanah air (hubbul wathan).',
      bgClass: 'bg-red-600',
    },
    {
      name: 'Hijau Ukhuwah (Emerald Green)',
      hex: '#16a34a',
      role: 'Warna Pita & Nafas Pesantren',
      description: 'Melambangkan kesejukan akhlak, ukhuwah islamiyah, kedamaian, dan nafas perjuangan Ahlussunnah wal Jama\'ah.',
      bgClass: 'bg-emerald-600',
    },
    {
      name: 'Hitam & Putih Turats (Charcoal & White)',
      hex: '#1e293b',
      role: 'Warna Kitab & Aksara Kaligrafi',
      description: 'Melambangkan ketegasan membedakan yang haq dan bathil, serta kesucian sanad tradisi literasi kitab kuning salafus salih.',
      bgClass: 'bg-slate-800',
    },
  ];

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 text-slate-800 text-xs font-semibold border border-amber-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Identitas Visual & Falsafah Lambang Resmi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
          Filosofi Lambang Jatibaraya
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Setiap guratan ornamen, perpaduan warna, dan tata letak dalam lambang resmi kebesaran Jatibaraya mengandung nilai luhur perpaduan sanad pesantren Lirboyo, wawasan dunia, dan kekayaan budaya tatar Sunda Priangan.
        </p>
      </div>

      {/* Ketetapan & Larangan Perubahan Logo Resmi */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Ketetapan Paten Lambang Resmi Jatibaraya
            </h4>
            <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl mt-0.5">
              Lambang resmi ini tidak boleh diubah sedikitpun, baik susunan elemen, proporsi, maupun warna, karena setiap komponen melambangkan marwah, ukhuwah, dan filosofi sakral organisasi.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 border border-amber-500/30 whitespace-nowrap">
          SK Resmi AD/ART
        </span>
      </div>

      {/* Central Emblem Spotlight - Harmonized Multi-Color Canvas */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-sky-950 text-white rounded-3xl p-8 sm:p-14 border border-emerald-800/40 shadow-2xl relative overflow-hidden">
        {/* Ambient Glows mirroring Logo Colors */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual Logo Centerpiece */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-amber-400/40 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center relative group min-h-[240px] w-full max-w-sm">
              <img
                src={settings.logoUrl || "/assets/jatibaraya-logo.png"}
                alt="Lambang Resmi Jatibaraya"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-2xl drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/jatibaraya-logo.svg";
                }}
              />
            </div>

            <div className="pt-2">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400">
                Lambang Resmi Jatibaraya
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                JATIBARAYA
              </h3>
              <p className="text-xs text-emerald-200 mt-1 max-w-xs">
                {settings.fullName}
              </p>
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <a
                href={settings.logoUrl || "/assets/jatibaraya-logo.png"}
                download="lambang-resmi-jatibaraya.png"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                title="Unduh file lambang resmi Jatibaraya"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Lambang Resmi</span>
              </a>
            </div>
          </div>

          {/* Core Synthesis */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/60 text-emerald-200 text-xs border border-emerald-700/50">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Sintesis Falsafah Lambang</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200 leading-snug">
              Harmoni Tradisi Keilmuan Lirboyo dan Kearifan Luhur Tatar Sunda
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Lambang ini menegaskan komitmen santri Priangan: berakar kuat pada tradisi salaf Walisongo, berilmu dengan ketekunan kitab kuning pesantren, memiliki kepekaan terhadap dinamika peradaban dunia, serta mempersembahkan khidmah terbaik bagi tanah Pasundan melalui tali ukhuwah yang abadi.
            </p>

            {/* 4 Regions Highlight with Logo Badges */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400">
                Empat Daerah Mandat Pengabdian:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-medium">
                  Bandung Raya
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-medium">
                  Garut
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-medium">
                  Sumedang
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-medium">
                  Kota Cimahi
                </span>
              </div>
            </div>

            {/* Logo Composition Quick Check (All 6 Elements) */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 border-t border-slate-700/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Globe Biru</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Kujang Pasundan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Tiga Kitab Turats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>9 Bintang Merah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pita Hijau Ukhuwah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-200" />
                <span>Kaligrafi Arab Pegon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 6 Elements Breakdown */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Enam Elemen Inti Lambang
          </h2>
          <p className="text-sm text-slate-500">
            Uraian makna filosofis mendalam dari setiap ornamen lambang resmi kebesaran Jatibaraya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symbolDetails.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      ELEMEN {item.number}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${item.colorClass} text-white flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform p-3`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Filosofi & Makna:
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resmi Disahkan dalam AD/ART</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nilai Luhur Budaya Pasundan & Pesantren */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-900 text-white space-y-3 shadow-md border border-emerald-700/50">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
            Falsafah Sunda:
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Silih Asih
          </h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Saling mengasihi, menaruh empati, dan menyayangi sesama saudara santri Priangan di perantauan, mengikis perselisihan demi kerukunan bersama.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-3 shadow-md border border-emerald-800/50">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
            Falsafah Sunda:
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Silih Asah
          </h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Saling mengasah ketajaman akal, memperdalam kajian kitab kuning, bertukar ilmu, dan memacu keunggulan intelektual agar menjadi generasi unggul.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
            Falsafah Sunda:
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Silih Asuh
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Saling membimbing, mendidik akhlak, mengayomi yang lebih muda, dan menjaga kehormatan almamater pondok serta nama baik keluarga di kampung halaman.
          </p>
        </div>
      </div>

      {/* Official Color Palette Breakdown - Matching Logo Colors */}
      <div className="space-y-6 bg-slate-50/80 rounded-3xl p-8 sm:p-10 border border-slate-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-200">
              <Palette className="w-3.5 h-3.5 text-emerald-700" />
              <span>Harmoni Warna Lambang</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Palet Warna Lambang Resmi Jatibaraya
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Kombinasi warna yang mencerminkan harmoni keagamaan, kebudayaan Sunda, keilmuan, dan wawasan dunia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {colorPalette.map((col, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className={`w-full h-14 rounded-xl ${col.bgClass} shadow-inner flex items-end justify-end p-2`}>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white font-semibold backdrop-blur-xs">
                    {col.hex}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 leading-tight">
                    {col.name}
                  </h4>
                  <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                    {col.role}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                {col.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Slogan & Motto Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white text-center space-y-3 border border-emerald-800/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="relative space-y-2">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
            Motto Santri Priangan
          </span>
          <p className="text-2xl sm:text-3xl font-serif italic text-amber-200 font-semibold">
            &ldquo;{settings.motto}&rdquo;
          </p>
          <p className="text-xs text-emerald-300/90 max-w-xl mx-auto pt-1">
            {settings.slogan}
          </p>
        </div>
      </div>
    </div>
  );
};
