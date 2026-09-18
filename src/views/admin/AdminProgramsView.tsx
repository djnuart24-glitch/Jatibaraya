import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { ProgramItem } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Layers,
  Save,
  Star,
} from 'lucide-react';

export const AdminProgramsView: React.FC = () => {
  const { data, addProgram, updateProgram, deleteProgram } = useJatibarayaData();
  const { programs } = data;

  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProgramItem['category']>('Spiritual');
  const [schedule, setSchedule] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const categories: ProgramItem['category'][] = [
    'Spiritual',
    'Silaturahmi',
    'Pelayanan',
    'Dakwah',
    'Keilmuan',
    'Ekonomi',
    'Media',
    'Pembangunan',
  ];

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingProgram(null);
    setTitle('');
    setCategory('Spiritual');
    setSchedule('');
    setDescription('');
    setDetails('');
    setImageUrl('');
    setFeatured(false);
    setPublished(true);
  };

  const handleStartEdit = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setIsCreating(false);
    setTitle(prog.title);
    setCategory(prog.category);
    setSchedule(prog.schedule);
    setDescription(prog.description);
    setDetails(prog.details || '');
    setImageUrl(prog.imageUrl || '');
    setFeatured(prog.featured);
    setPublished(prog.published);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProgram(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul program harus diisi.');
      return;
    }

    if (isCreating) {
      addProgram({
        title: title.trim(),
        category,
        schedule: schedule.trim() || 'Sesuai jadwal organisasi',
        description: description.trim(),
        details: details.trim() || undefined,
        imageUrl: imageUrl || undefined,
        featured,
        published,
        order: programs.length + 1,
      });
      showNotice(`Program "${title}" berhasil ditambahkan.`);
    } else if (editingProgram) {
      updateProgram(editingProgram.id, {
        title: title.trim(),
        category,
        schedule: schedule.trim(),
        description: description.trim(),
        details: details.trim() || undefined,
        imageUrl: imageUrl || undefined,
        featured,
        published,
      });
      showNotice(`Program "${title}" berhasil diperbarui.`);
    }

    setIsCreating(false);
    setEditingProgram(null);
  };

  const confirmDeleteProgram = () => {
    if (!itemToDelete) return;
    deleteProgram(itemToDelete.id);
    showNotice(`Program "${itemToDelete.title}" telah dihapus.`);
    setItemToDelete(null);
  };

  const handleTogglePublish = (prog: ProgramItem) => {
    updateProgram(prog.id, { published: !prog.published });
    showNotice(`Status publikasi "${prog.title}" diubah.`);
  };

  const showNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Hapus Program?"
        message={`Apakah Anda yakin ingin menghapus program "${itemToDelete?.title || 'ini'}"? Tindakan ini akan menghapus program dari website dan database online.`}
        confirmText="Ya, Hapus Program"
        cancelText="Batal"
        isDanger={true}
        onConfirm={confirmDeleteProgram}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            5. Manajemen Program Kerja
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola rincian 12 program resmi Jatibaraya, jadwal pelaksanaan, kategori, dan status publikasi.
          </p>
        </div>

        {!isCreating && !editingProgram && (
          <button
            id="admin-add-program-btn"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tambah Program Baru</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreating || editingProgram) && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {isCreating ? 'Tambah Program Baru' : `Edit: ${editingProgram?.title}`}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Program *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Safari Ramadan Priangan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kategori Khidmah</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProgramItem['category'])}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Waktu / Frekuensi Pelaksanaan</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Contoh: Dilaksanakan setiap bulan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Ringkas *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan ringkas maksud dan tujuan program..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Rincian Teknis / Kegiatan (Opsional)</label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Rangkaian kegiatan detail (contoh: Lim Cabang Priangan, Imam Tarawih, Bahtsul Masail)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
              />
            </div>

            <ImageUploader
              currentImageUrl={imageUrl}
              onImageSelected={(url) => setImageUrl(url)}
              categoryFolder="PROGRAM"
              label="Foto Dokumentasi / Banner Program"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Tampilkan sebagai Program Unggulan di Beranda
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Publikasikan di Website Publik
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Simpan Perubahan Program</span>
            </button>
          </div>
        </form>
      )}

      {/* PROGRAM CARDS LIST (MOBILE-FRIENDLY CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog, idx) => (
          <div
            key={prog.id}
            className={`bg-white rounded-2xl p-5 border shadow-xs transition-all space-y-3 ${
              prog.published ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {prog.category}
                  </span>
                  {prog.featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      Unggulan
                    </span>
                  )}
                  {!prog.published && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {idx + 1}. {prog.title}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(prog)}
                  className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    prog.published
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={prog.published ? 'Tarik Publikasi' : 'Publikasikan'}
                >
                  {prog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(prog)}
                  className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete({ id: prog.id, title: prog.title })}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Hapus Program"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{prog.schedule}</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {prog.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
