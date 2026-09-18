import React from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { CheckCircle2, Shield, Heart, GraduationCap, Compass, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onSelectTab: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  const { data } = useJatibarayaData();
  const { about, settings } = data;

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Compass className="w-3.5 h-3.5 text-emerald-700" />
          <span>Tentang Organisasi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
          Visi, Misi & Fondasi Gerak
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {settings.fullName} (JATIBARAYA) adalah wadah kekeluargaan santri asal Bandung, Garut, Sumedang, dan Cimahi yang menimba ilmu di Pondok Pesantren Lirboyo Kediri.
        </p>
      </div>

      {/* VISI & MISI CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Visi */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-8xl font-black select-none pointer-events-none text-amber-300">
            VISI
          </div>
          <div className="space-y-6 relative z-10">
            <span className="inline-block text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Visi Utama
            </span>
            <blockquote className="text-2xl sm:text-3xl font-serif font-medium leading-relaxed text-amber-200">
              &ldquo;{about.vision}&rdquo;
            </blockquote>
          </div>

          <div className="pt-8 mt-6 border-t border-emerald-800/60 text-xs text-emerald-300/80 leading-relaxed">
            Menjadi kompas perjuangan santri Priangan dalam mengintegrasikan nilai agama, intelektual, dan pengabdian bagi umat.
          </div>
        </div>

        {/* Misi (5 Poin Resmi) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Misi Jatibaraya
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              5 Misi Pokok
            </span>
          </div>

          <div className="space-y-4">
            {about.missions.map((mission, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors"
              >
                <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 shadow-xs">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed pt-1">
                  {mission}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIFAT & FUNGSI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sifat */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Sifat Organisasi</h3>
              <p className="text-xs text-slate-500">Karakter dan ruh pergerakan Jatibaraya</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {about.characteristics.map((trait, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center space-y-1"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600 mx-auto mb-2" />
                <span className="text-sm font-bold text-emerald-950 block">{trait}</span>
                <span className="text-[11px] text-slate-500">Nilai Inti</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
            Sifat pengabdian kepada umat, penempaan pendidikan santri, serta ikatan kekeluargaan yang erat menjadi pilar utama kebersamaan di tanah rantau.
          </p>
        </div>

        {/* Fungsi */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Fungsi Organisasi</h3>
              <p className="text-xs text-slate-500">Peran strategis wadah bagi segenap santri</p>
            </div>
          </div>

          <div className="space-y-3">
            {about.functions.map((fn, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-medium leading-relaxed">{fn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigasi Lanjutan */}
      <div className="pt-6 flex flex-wrap justify-center gap-4">
        <button
          id="about-to-identity-btn"
          onClick={() => onSelectTab('identitas')}
          className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Buka Filosofi Lambang Jatibaraya</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          id="about-to-programs-btn"
          onClick={() => onSelectTab('program')}
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Lihat 12 Program Resmi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
