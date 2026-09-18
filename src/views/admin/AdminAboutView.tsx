import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { Save, CheckCircle2, Info, BookOpen, Layers, AlertCircle, Plus, Trash2 } from 'lucide-react';

export const AdminAboutView: React.FC = () => {
  const { data, updateAbout } = useJatibarayaData();
  const { about } = data;

  const [vision, setVision] = useState(about.vision);
  const [missions, setMissions] = useState<string[]>(about.missions || []);
  const [characteristics, setCharacteristics] = useState<string[]>(about.characteristics || []);
  const [functions, setFunctions] = useState<string[]>(about.functions || []);

  const [isSaved, setIsSaved] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handleMissionChange = (index: number, val: string) => {
    const updated = [...missions];
    updated[index] = val;
    setMissions(updated);
  };

  const handleAddMission = () => {
    setMissions([...missions, '']);
  };

  const handleDeleteMission = (index: number) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  const handleCharacteristicChange = (index: number, val: string) => {
    const updated = [...characteristics];
    updated[index] = val;
    setCharacteristics(updated);
  };

  const handleFunctionChange = (index: number, val: string) => {
    const updated = [...functions];
    updated[index] = val;
    setFunctions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout({
      vision: vision.trim(),
      missions: missions.filter((m) => m.trim().length > 0),
      characteristics: characteristics.filter((c) => c.trim().length > 0),
      functions: functions.filter((f) => f.trim().length > 0),
    });

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSavedTime(now);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4 text-amber-500" />
          <span>Menu 3: Pengelolaan Halaman Tentang Kami</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
          Visi, Misi, Sifat & Fungsi Organisasi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur visi resmi, 5 butir misi pokok, sifat keorganisasian, dan fungsi wadah Jatibaraya.
        </p>
      </div>

      {/* Inline Feedback Banner */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border border-emerald-600 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Visi & Misi Berhasil Diperbarui!</p>
              <p className="text-[11px] text-emerald-200">
                Pukul {savedTime} WIB • Teks langsung terpasang di halaman Tentang Publik.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-800 rounded border border-emerald-700">
            Aktif
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-serif font-bold text-slate-900">
              Visi Resmi Jatibaraya
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Pernyataan Visi
            </label>
            <textarea
              rows={3}
              required
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Mewujudkan dalam semangat agama, kecerdasan, kemandirian dan taqwa..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400">Pernyataan komitmen jangka panjang organisasi santri.</p>
          </div>
        </div>

        {/* 5 Butir Misi Pokok */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-serif font-bold text-slate-900">
                Butir-Butir Misi Pokok ({missions.length} Butir)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddMission}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-500" />
              <span>Tambah Butir Misi</span>
            </button>
          </div>

          <div className="space-y-3">
            {missions.map((m, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  required
                  value={m}
                  onChange={(e) => handleMissionChange(idx, e.target.value)}
                  placeholder={`Butir misi ${idx + 1}...`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {missions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMission(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Hapus butir ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sifat & Fungsi Organisasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Karakteristik / Sifat */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
              Sifat / Karakteristik Wadah
            </h3>
            <div className="space-y-2">
              {characteristics.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={item}
                  onChange={(e) => handleCharacteristicChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              ))}
            </div>
          </div>

          {/* Fungsi Wadah */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
              Fungsi Wadah Jatibaraya
            </h3>
            <div className="space-y-2">
              {functions.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={item}
                  onChange={(e) => handleFunctionChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Semua teks otomatis terupdate di website publik saat disimpan.</span>
          </div>

          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaved ? 'text-white' : 'text-amber-400'}`} />
            <span>{isSaved ? '✓ Visi & Misi Berhasil Disimpan!' : 'Simpan Perubahan Tentang'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
