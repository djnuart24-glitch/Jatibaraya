import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { AnnouncementItem } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ShareModal } from '../../components/common/ShareModal';
import { ShareableItem } from '../../utils/shareUtils';
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
  Share2,
} from 'lucide-react';

export const AdminAnnouncementsView: React.FC = () => {
  const { data, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useJatibarayaData();
  const { announcements } = data;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Share Modal
  const [shareTarget, setShareTarget] = useState<ShareableItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShare = (item: ShareableItem) => {
    setShareTarget(item);
    setIsShareModalOpen(true);
  };

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

    let targetShare: ShareableItem;
    if (editingItem) {
      updateAnnouncement(editingItem.id, {
        title: title.trim(),
        content: content.trim(),
        priority,
        date,
        published,
      });
      showNotice(`Pengumuman "${title}" berhasil diperbarui.`);
      targetShare = {
        id: editingItem.id,
        title: title.trim(),
        content: content.trim(),
        category: `Pengumuman ${priority}`,
        date,
        type: 'pengumuman',
      };
    } else {
      const created = addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        priority,
        date,
        published,
      });
      showNotice(`Pengumuman "${title}" berhasil dibuat.`);
      targetShare = {
        id: created.id,
        title: title.trim(),
        content: content.trim(),
        category: `Pengumuman ${priority}`,
        date,
        type: 'pengumuman',
      };
    }

    setIsFormOpen(false);
    setEditingItem(null);

    if (published) {
      setTimeout(() => {
        handleOpenShare(targetShare);
      }, 200);
    }
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
            5. Manajemen Pengumuman
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Siarkan maklumat penting, instruksi kegiatan, jadwal rombongan, atau pesan darurat.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Buat Pengumuman Baru</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {isFormOpen && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Judul Pengumuman *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Jadwal Kedatangan Rombongan Santri Tasikmalaya"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tingkat Prioritas
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'penting')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="normal">Normal (Biasa)</option>
                  <option value="penting">Penting / Darurat (Warna Kuning Emas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Berlaku
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="ann-publish"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                />
                <label htmlFor="ann-publish" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Tampilkan Langsung di Website
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Isi / Pesan Pengumuman *
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan detail maklumat, arahan waktu, tempat, atau instruksi bagi santri/alumni..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
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
                {ann.published && (
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenShare({
                        id: ann.id,
                        title: ann.title,
                        content: ann.content,
                        category: `Pengumuman ${ann.priority}`,
                        date: ann.date,
                        type: 'pengumuman',
                      })
                    }
                    className="p-2 rounded-xl text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 transition-colors"
                    title="Bagikan Pengumuman (WhatsApp / Salin Link)"
                  >
                    <Share2 className="w-4 h-4 text-emerald-700" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(ann)}
                  className={`p-2 rounded-xl text-xs ${
                    ann.published ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={ann.published ? 'Dipublikasikan' : 'Draft'}
                >
                  {ann.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(ann)}
                  className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
                  title="Edit Pengumuman"
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

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        item={shareTarget}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
