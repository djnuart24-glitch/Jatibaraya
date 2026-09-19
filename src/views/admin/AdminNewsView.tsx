import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { NewsItem } from '../../types';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ShareModal } from '../../components/common/ShareModal';
import { ShareableItem } from '../../utils/shareUtils';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  CheckCircle2,
  Newspaper,
  Share2,
} from 'lucide-react';

export const AdminNewsView: React.FC = () => {
  const { data, addNews, updateNews, deleteNews } = useJatibarayaData();
  const { news } = data;

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Share Modal
  const [shareTarget, setShareTarget] = useState<ShareableItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShare = (item: ShareableItem) => {
    setShareTarget(item);
    setIsShareModalOpen(true);
  };

  const newsCategories = [
    'Berita Umum',
    'Rombongan',
    'Ramadan',
    'Silaturahmi',
    'Pendidikan',
    'Kajian',
  ];

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const confirmDeleteNews = () => {
    if (!itemToDelete) return;
    deleteNews(itemToDelete.id);
    showNotice(`Berita "${itemToDelete.title}" telah dihapus.`);
    setItemToDelete(null);
  };

  const handleTogglePublish = (item: NewsItem) => {
    updateNews(item.id, { published: !item.published });
    showNotice(`Status publikasi "${item.title}" diperbarui.`);
  };

  const handleSave = (savedData: {
    title: string;
    summary: string;
    content: string;
    category: string;
    author: string;
    date: string;
    imageUrl?: string;
    published: boolean;
  }) => {
    let targetShare: ShareableItem;
    if (editingItem) {
      updateNews(editingItem.id, savedData);
      showNotice(`Berita "${savedData.title}" berhasil diperbarui.`);
      targetShare = {
        id: editingItem.id,
        ...savedData,
        type: 'berita',
      };
    } else {
      const created = addNews(savedData);
      showNotice(`Berita "${savedData.title}" berhasil diterbitkan.`);
      targetShare = {
        id: created.id,
        ...savedData,
        type: 'berita',
      };
    }
    setIsEditing(false);
    setEditingItem(null);

    // If published, automatically open share dialog so admin can share straight away
    if (savedData.published) {
      setTimeout(() => {
        handleOpenShare(targetShare);
      }, 200);
    }
  };

  const showNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-12">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Hapus Berita?"
        message={`Apakah Anda yakin ingin menghapus berita "${itemToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Berita"
        isDanger={true}
        onConfirm={confirmDeleteNews}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            6. Manajemen Berita Resmi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publikasikan kabar seputar kegiatan santri Priangan, rombongan, serta informasi dakwah.
          </p>
        </div>

        {!isEditing && (
          <button
            id="admin-add-news-btn"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tulis Berita Baru</span>
          </button>
        )}
      </div>

      {/* Form or List */}
      {isEditing ? (
        <RichTextEditor
          initialTitle={editingItem?.title}
          initialSummary={editingItem?.summary}
          initialContent={editingItem?.content}
          initialCategory={editingItem?.category}
          initialAuthor={editingItem?.author}
          initialDate={editingItem?.date}
          initialImageUrl={editingItem?.imageUrl}
          initialPublished={editingItem?.published}
          categories={newsCategories}
          typeLabel="Berita"
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setEditingItem(null);
          }}
        />
      ) : (
        /* NEWS LIST */
        <div className="space-y-4">
          {news.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
              Belum ada berita. Klik tombol "Tulis Berita Baru" untuk menambahkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.published && (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenShare({
                                id: item.id,
                                title: item.title,
                                summary: item.summary,
                                content: item.content,
                                category: item.category,
                                author: item.author,
                                date: item.date,
                                type: 'berita',
                                imageUrl: item.imageUrl,
                              })
                            }
                            className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 transition-colors"
                            title="Bagikan Berita (WhatsApp / Salin Link)"
                          >
                            <Share2 className="w-4 h-4 text-emerald-700" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`p-1.5 rounded-lg text-xs ${
                            item.published ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={item.published ? 'Dipublikasikan' : 'Draft'}
                        >
                          {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 cursor-pointer"
                          title="Edit Berita"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete({ id: item.id, title: item.title })}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title={`Hapus ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-slate-900 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span>{item.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        item={shareTarget}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
