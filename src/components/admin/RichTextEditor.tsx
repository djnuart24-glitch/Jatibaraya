import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Eye, Edit3, Save, X, Check, Bold, Italic, List, Heading } from 'lucide-react';

interface RichTextEditorProps {
  initialTitle?: string;
  initialSummary?: string;
  initialContent?: string;
  initialCategory?: string;
  initialAuthor?: string;
  initialDate?: string;
  initialImageUrl?: string;
  initialPublished?: boolean;
  categories: string[];
  typeLabel: 'Berita' | 'Artikel';
  onSave: (data: {
    title: string;
    summary: string;
    content: string;
    category: string;
    author: string;
    date: string;
    imageUrl?: string;
    published: boolean;
  }) => void;
  onCancel: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialTitle = '',
  initialSummary = '',
  initialContent = '',
  initialCategory = '',
  initialAuthor = 'Media Baraya',
  initialDate = new Date().toISOString().split('T')[0],
  initialImageUrl = '',
  initialPublished = true,
  categories,
  typeLabel,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory || categories[0] || 'Umum');
  const [author, setAuthor] = useState(initialAuthor);
  const [date, setDate] = useState(initialDate);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [published, setPublished] = useState(initialPublished);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul tidak boleh kosong.');
      return;
    }
    if (!content.trim()) {
      alert('Isi konten tidak boleh kosong.');
      return;
    }

    onSave({
      title: title.trim(),
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      category,
      author: author.trim() || 'Pengurus Jatibaraya',
      date,
      imageUrl: imageUrl?.trim() ? imageUrl.trim() : '',
      published,
    });
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent((prev) => prev + `\n${prefix} ${suffix}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
            Editor CMS Jatibaraya
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Form {typeLabel}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            {previewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{previewMode ? 'Kembali ke Editor' : 'Pratinjau (Preview)'}</span>
          </button>
        </div>
      </div>

      {previewMode ? (
        /* PREVIEW MODE */
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {category}
              </span>
              <span className="text-slate-500 font-mono">{date}</span>
              <span className="text-slate-500">• Penulis: {author}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${published ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'}`}>
                {published ? 'Status: Dipublikasikan' : 'Status: Draft'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {title || '(Judul Belum Diisi)'}
            </h1>
          </div>

          {imageUrl && (
            <div className="h-64 rounded-2xl overflow-hidden bg-slate-900">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif border-t border-slate-200 pt-4">
            {content || '(Isi konten masih kosong)'}
          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul {typeLabel} *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Masukkan judul ${typeLabel.toLowerCase()}...`}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600/30 text-sm font-medium"
            />
          </div>

          {/* Category, Author, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Penulis / Sumber</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Media Baraya / Pengurus"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            currentImageUrl={imageUrl}
            onImageSelected={(url) => setImageUrl(url)}
            categoryFolder={typeLabel === 'Berita' ? 'BERITA' : 'ARTIKEL'}
            label={`Foto Utama ${typeLabel}`}
          />

          {/* Summary */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Ringkasan Singkat (Lead Paragraph)</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat untuk kartu pratinjau..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          {/* Content Formatting Toolbar & Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Isi Konten Lengkap *</label>
              <div className="flex items-center gap-1 text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('### Subjudul')}
                  className="p-1.5 hover:bg-slate-100 rounded text-xs"
                  title="Subjudul"
                >
                  <Heading className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1.5 hover:bg-slate-100 rounded text-xs"
                  title="Poin List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('"Kutipan santri..."')}
                  className="p-1.5 hover:bg-slate-100 rounded text-xs"
                  title="Kutipan"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis narasi berita atau artikel secara lengkap..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-sans leading-relaxed focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Status Publikasi</span>
              <span className="text-[11px] text-slate-500">
                {published ? 'Konten langsung tayang di website publik' : 'Tersimpan sebagai draft (tidak tayang publik)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                published
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {published ? 'PUBLISHED' : 'DRAFT'}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-900 hover:to-slate-950 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>Simpan & Publikasikan</span>
        </button>
      </div>
    </form>
  );
};
