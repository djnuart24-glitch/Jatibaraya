import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { ArticleItem } from '../../types';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const AdminArticlesView: React.FC = () => {
  const { data, addArticle, updateArticle, deleteArticle } = useJatibarayaData();
  const { articles } = data;

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ArticleItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  const articleCategories = [
    'Refleksi Santri',
    'Keilmuan & Fiqih',
    'Sosial Kemasyarakatan',
    'Pendidikan Pesantren',
    'Khidmah',
  ];

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: ArticleItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const confirmDeleteArticle = () => {
    if (!itemToDelete) return;
    deleteArticle(itemToDelete.id);
    showNotice(`Artikel "${itemToDelete.title}" telah dihapus.`);
    setItemToDelete(null);
  };

  const handleTogglePublish = (item: ArticleItem) => {
    updateArticle(item.id, { published: !item.published });
    showNotice(`Status publikasi artikel "${item.title}" diperbarui.`);
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
    if (editingItem) {
      updateArticle(editingItem.id, savedData);
      showNotice(`Artikel "${savedData.title}" berhasil diperbarui.`);
    } else {
      addArticle(savedData);
      showNotice(`Artikel "${savedData.title}" berhasil disimpan.`);
    }
    setIsEditing(false);
    setEditingItem(null);
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
        title="Hapus Artikel?"
        message={`Apakah Anda yakin ingin menghapus artikel "${itemToDelete?.title || 'ini'}"? Tindakan ini akan menghapus artikel dari portal dan cloud database.`}
        confirmText="Ya, Hapus Artikel"
        cancelText="Batal"
        isDanger={true}
        onConfirm={confirmDeleteArticle}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            7. Manajemen Artikel & Gagasan Santri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola tulisan santri, esai keilmuan pesantren, dan opini ukhuwah Priangan.
          </p>
        </div>

        {!isEditing && (
          <button
            id="admin-add-article-btn"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tulis Artikel Baru</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <RichTextEditor
          initialTitle={editingItem?.title}
          initialSummary={editingItem?.summary}
          initialContent={editingItem?.content}
          initialCategory={editingItem?.category}
          initialAuthor={editingItem?.author}
          initialDate={editingItem?.date}
          initialImageUrl={editingItem?.imageUrl}
          initialPublished={editingItem?.published ?? true}
          categories={articleCategories}
          typeLabel="Artikel"
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setEditingItem(null);
          }}
        />
      ) : (
        /* ARTICLES LIST */
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
              Belum ada artikel. Klik tombol "Tulis Artikel Baru" untuk mempublikasikan tulisan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`p-1.5 rounded-lg text-xs ${
                            item.published ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={item.published ? 'Published' : 'Draft'}
                        >
                          {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
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
                    <span>Oleh: {item.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
