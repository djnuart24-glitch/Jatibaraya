import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { AnnouncementItem } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  CheckCircle2,
  Save,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AdminAnnouncementsView: React.FC = () => {
  const { data, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useJatibarayaData();
  const { announcements } = data;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'penting'>('normal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [published, setPublished] = useState(true);

  const handleStartCreate = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setPriority('normal');
    setDate(new Date().toISOString().split('T')[0]);
    setPublished(true);
    setIsFormOpen(true);
  };

  const handleStartEdit = (item: AnnouncementItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setPriority(item.priority);
    setDate(item.date);
    setPublished(item.published);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showNotice('Judul dan isi pengumuman wajib diisi.');
      return;
    }

    if (editingItem) {
      updateAnnouncement(editingItem.id, {
        title: title.trim(),
        content: content.trim(),
        priority,
        date,
        published,
      });
      showNotice(`Pengumuman "${title}" berhasil diperbarui.`);
    } else {
      addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        priority,
        date,
        published,
      });
      showNotice(`Pengumuman "${title}" berhasil dibuat.`);
    }

    setIsFormOpen(false);
    setEditingItem(null);
  };

  const confirmDeleteAnnouncement = () => {
    if (!itemToDelete) return;
    deleteAnnouncement(itemToDelete.id);
    showNotice(`Pengumuman "${itemToDelete.title}" telah dihapus.`);
    setItemToDelete(null);
  };

  const handleTogglePublish = (item: AnnouncementItem) => {
    updateAnnouncement(item.id, { published: !item.published });
    showNotice(`Status publikasi "${item.title}" diperbarui.`);
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
        title="Hapus Pengumuman?"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${itemToDelete?.title || 'ini'}"? Tindakan ini akan menghapus pengumuman dari website dan cloud database.`}
        confirmText="Ya, Hapus Pengumuman"
        cancelText="Batal"
        isDanger={true}
        onConfirm={confirmDeleteAnnouncement}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            8. Manajemen Pengumuman
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Siarkan maklumat penting rombongan, safari, atau agenda mendesak organisasi.
          </p>
        </div>

        {!isFormOpen && (
          <button
            id="admin-add-announcement-btn"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Buat Pengumuman Baru</span>
          </button>
        )}
      </div>

      {/* FORM */}
      {isFormOpen && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {editingItem ? 'Edit Pengumuman' : 'Pengumuman Baru'}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Judul Maklumat / Pengumuman *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Titik Kumpul Keberangkatan Rombongan Liburan Santri"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tingkat Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'penting')}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  <option value="normal">Biasa (Informasi Reguler)</option>
                  <option value="penting">Penting (Wajib Diperhatikan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tanggal Pengumuman</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Isi Pesan Pengumuman *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis rincian instruksi atau pemberitahuan resmi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
              />
            </div>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded text-emerald-800"
              />
              <span className="text-xs font-semibold text-slate-700">
                Tayangkan langsung di website publik
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Simpan Pengumuman</span>
            </button>
          </div>
        </form>
      )}

      {/* LIST OF ANNOUNCEMENTS */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
            Belum ada pengumuman aktif.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                ann.priority === 'penting'
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span
                    className={`px-2 py-0.5 rounded uppercase font-mono ${
                      ann.priority === 'penting'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-slate-500 font-mono">{ann.date}</span>
                  {!ann.published && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Draft (Nonaktif)
                    </span>
                  )}
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-700 line-clamp-2">{ann.content}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(ann)}
                  className={`p-2 rounded-xl text-xs ${
                    ann.published ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={ann.published ? 'Published' : 'Draft'}
                >
                  {ann.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(ann)}
                  className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete({ id: ann.id, title: ann.title })}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Hapus Pengumuman"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
