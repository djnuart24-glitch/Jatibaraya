import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { ProgramItem } from '../../types';
import {
  Clock,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Sparkles,
  X,
  CheckCircle,
} from 'lucide-react';

export const ProgramsView: React.FC = () => {
  const { data } = useJatibarayaData();
  const { programs } = data;

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramItem | null>(null);

  const publishedPrograms = programs.filter((p) => p.published);

  const categories = [
    'Semua',
    'Spiritual',
    'Silaturahmi',
    'Pelayanan',
    'Dakwah',
    'Keilmuan',
    'Ekonomi',
    'Media',
    'Pembangunan',
  ];

  const filteredPrograms = publishedPrograms.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Agenda & Rencana Khidmah</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
          Program Kerja Jatibaraya
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Struktur program kerja terpadu untuk membina santri, mempererat ukhuwah walisantri, serta berkhidmah langsung bagi kemaslahatan masyarakat Priangan.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama program atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 hidden md:block">
            Menampilkan <strong>{filteredPrograms.length}</strong> dari {publishedPrograms.length} program
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Cards Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <p className="text-base text-slate-600 font-medium">
            Tidak ada program kerja yang sesuai dengan pencarian atau filter Anda.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              setSearchQuery('');
            }}
            className="text-xs text-emerald-800 font-semibold hover:underline"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog, idx) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {prog.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    #{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {prog.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium line-clamp-1">{prog.schedule}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {prog.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {prog.featured ? 'Program Prioritas' : 'Program Reguler'}
                </span>
                <button
                  onClick={() => setActiveModalProgram(prog)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Program Detail Modal */}
      {activeModalProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProgram(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {activeModalProgram.category}
                </span>
                {activeModalProgram.featured && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Program Unggulan
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 pt-1">
                {activeModalProgram.title}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Jadwal & Waktu Pelaksanaan:</strong>
                <span>{activeModalProgram.schedule}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Deskripsi Program:
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeModalProgram.description}
              </p>
            </div>

            {activeModalProgram.details && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Rincian Teknis / Pelaksanaan:
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  {activeModalProgram.details}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalProgram(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
