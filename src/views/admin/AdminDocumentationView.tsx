import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { MediaItem } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Trash2,
  Calendar,
  Folder,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';

export const AdminDocumentationView: React.FC = () => {
  const { data, addMedia, deleteMedia } = useJatibarayaData();
  const { media } = data;

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // New Media Form
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<MediaItem['category']>('DOKUMENTASI');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const folders: MediaItem['category'][] = [
    'LOGO',
    'BERITA',
    'ARTIKEL',
    'DOKUMENTASI',
    'PROGRAM',
    'GALERI',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      showNotice('Silakan pilih atau unggah gambar terlebih dahulu.');
      return;
    }

    addMedia({
      title: title.trim() || 'Foto Dokumentasi Kegiatan',
      caption: caption.trim() || 'Arsip kegiatan resmi Jatibaraya',
      category,
      imageUrl,
      date,
    });

    showNotice('Foto berhasil ditambahkan ke pustaka media.');
    setIsUploading(false);
    setTitle('');
    setCaption('');
    setImageUrl('');
  };

  const confirmDeleteMedia = () => {
    if (!itemToDelete) return;
    deleteMedia(itemToDelete.id);
    showNotice(`Foto "${itemToDelete.title}" berhasil dihapus.`);
    setItemToDelete(null);
  };

  const showNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredMedia = media.filter((item) => {
    const matchesFolder = selectedFolder === 'Semua' || item.category === selectedFolder;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-32 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Hapus Foto dari Arsip?"
        message={`Apakah Anda yakin ingin menghapus foto "${itemToDelete?.title || 'ini'}"? Foto ini akan dihapus secara permanen dari pustaka media dan database online.`}
        confirmText="Ya, Hapus Foto"
        cancelText="Batal"
        isDanger={true}
        onConfirm={confirmDeleteMedia}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            9. Manajemen Dokumentasi & Galeri Media
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pusat penyimpanan foto kegiatan, logo, dan materi visual Jatibaraya.
          </p>
        </div>

        {!isUploading && (
          <button
            id="admin-upload-media-btn"
            onClick={() => setIsUploading(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Unggah Foto Baru</span>
          </button>
        )}
      </div>

      {/* UPLOAD FORM MODAL / CARD */}
      {isUploading && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Unggah Foto ke Pustaka Media
            </h2>
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <ImageUploader
              currentImageUrl={imageUrl}
              onImageSelected={(url) => setImageUrl(url)}
              categoryFolder={category}
              label="Pilih Berkas Gambar"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kategori / Folder Penyimpanan</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MediaItem['category'])}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {folders.map((f) => (
                    <option key={f} value={f}>
                      Folder: JATIBARAYA/{f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tanggal Dokumentasi</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Judul Foto</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Istighosah Akbar Santri Priangan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Keterangan / Caption</label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Keterangan singkat momen atau lokasi kegiatan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
            >
              Simpan Foto
            </button>
          </div>
        </form>
      )}

      {/* FILTER & FOLDER CHIPS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedFolder('Semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFolder === 'Semua'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({media.length})
            </button>
            {folders.map((f) => {
              const count = media.filter((m) => m.category === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFolder === f
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari foto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* MEDIA GRID CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="relative h-36 bg-slate-900 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 text-amber-300">
                {item.category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="text-xs font-serif font-bold text-slate-900 line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{item.caption}</p>
              <span className="text-[10px] text-slate-400 font-mono block">{item.date}</span>
            </div>

            <div className="p-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] text-slate-400 font-mono">
                {item.category}
              </span>
              <button
                type="button"
                onClick={() => setItemToDelete({ id: item.id, title: item.title })}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-red-700 bg-white hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer min-h-[40px]"
                title={`Hapus foto "${item.title}"`}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
