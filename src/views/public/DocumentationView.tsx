import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { MediaItem } from '../../types';
import { Sparkles, X, ZoomIn, Calendar, Filter } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const { data } = useJatibarayaData();
  const { media } = data;

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeLightbox, setActiveLightbox] = useState<MediaItem | null>(null);

  const categories = ['Semua', 'DOKUMENTASI', 'PROGRAM', 'KEGIATAN', 'GALERI'];

  const filteredMedia = media.filter((m) =>
    selectedCategory === 'Semua' ? true : m.category === selectedCategory
  );

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Arsip Visual & Jejak Langkah</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
          Galeri Dokumentasi Kegiatan
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Dokumentasi momen kebersamaan, khidmah spiritual, musyawarah ilmiah, dan perjalanan santri Priangan.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid Photos */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
          <p className="text-base text-slate-600 font-medium">
            Belum ada dokumentasi untuk kategori ini.
          </p>
          <p className="text-xs text-slate-400">
            Foto kegiatan dapat diunggah pengurus melalui menu Dokumentasi di Dashboard Admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group relative h-80 rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xs hover:shadow-xl transition-all cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-400 border border-slate-700/50 backdrop-blur-xs">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  <h3 className="text-base font-serif font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800 relative space-y-4 p-6">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-700/50">
                  {activeLightbox.category}
                </span>
                <span className="text-slate-400 font-mono">{activeLightbox.date}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {activeLightbox.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLightbox.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
