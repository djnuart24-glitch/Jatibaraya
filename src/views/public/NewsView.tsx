import React, { useState } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { NewsItem, ArticleItem, AnnouncementItem } from '../../types';
import {
  BookOpen,
  Calendar,
  User,
  Tag,
  AlertCircle,
  ChevronRight,
  X,
  Search,
  Share2,
} from 'lucide-react';

export const NewsView: React.FC = () => {
  const { data } = useJatibarayaData();
  const { news, articles, announcements } = data;

  const [activeTab, setActiveTab] = useState<'berita' | 'artikel' | 'pengumuman'>('berita');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);
  const [activeArticleModal, setActiveArticleModal] = useState<ArticleItem | null>(null);

  const publishedNews = news.filter((n) => n.published);
  const publishedArticles = articles.filter((a) => a.published);
  const publishedAnnouncements = announcements.filter((a) => a.published);

  const filteredNews = publishedNews.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = publishedArticles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Kanal Informasi & Publikasi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
          Berita, Artikel & Pengumuman
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Wadah informasi resmi, pengumuman jadwal kegiatan santri Priangan, serta tulisan inspiratif warga Jatibaraya.
        </p>
      </div>

      {/* Announcements Banner if any */}
      {publishedAnnouncements.length > 0 && (
        <div className="space-y-3">
          {publishedAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl flex items-start gap-3 border ${
                ann.priority === 'penting'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  ann.priority === 'penting' ? 'text-amber-600' : 'text-emerald-700'
                }`}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                    Pengumuman {ann.priority === 'penting' ? 'Penting' : 'Resmi'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold">{ann.title}</h4>
                <p className="text-xs leading-relaxed text-slate-700">{ann.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('berita')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'berita'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Berita ({publishedNews.length})
          </button>
          <button
            onClick={() => setActiveTab('artikel')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'artikel'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Artikel Santri ({publishedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pengumuman'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pengumuman ({publishedAnnouncements.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari konten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
      </div>

      {/* CONTENT LIST */}
      {/* 1. Tab Berita */}
      {activeTab === 'berita' && (
        <div>
          {filteredNews.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <p className="text-base text-slate-600 font-medium">
                Belum ada berita yang dipublikasikan.
              </p>
              <p className="text-xs text-slate-400">
                Pengurus dapat menambahkan berita terkini melalui Dashboard Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center p-4 text-center">
                          <span className="text-xs text-amber-300 font-serif font-bold">
                            JATIBARAYA MEDIA
                          </span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-300 backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span>{item.author}</span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveNewsModal(item)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Tab Artikel */}
      {activeTab === 'artikel' && (
        <div>
          {filteredArticles.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <p className="text-base text-slate-600 font-medium">
                Belum ada artikel yang dipublikasikan.
              </p>
              <p className="text-xs text-slate-400">
                Santri dan alumni dapat menerbitkan tulisan reflektif melalui admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                        {item.category}
                      </span>
                      <span className="text-slate-500">{item.date}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Penulis: <strong>{item.author}</strong></span>
                    </div>
                    <button
                      onClick={() => setActiveArticleModal(item)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Baca Artikel</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Tab Pengumuman */}
      {activeTab === 'pengumuman' && (
        <div className="space-y-4">
          {publishedAnnouncements.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-600 text-sm">
              Belum ada pengumuman aktif saat ini.
            </div>
          ) : (
            publishedAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-800">
                    STATUS: {ann.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">{ann.date}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* NEWS DETAIL MODAL */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveNewsModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeNewsModal.imageUrl && (
              <div className="h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeNewsModal.imageUrl}
                  alt={activeNewsModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold">
                  {activeNewsModal.category}
                </span>
                <span>{activeNewsModal.date}</span>
                <span>• Oleh: {activeNewsModal.author}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                {activeNewsModal.title}
              </h2>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
              {activeNewsModal.content}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveNewsModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Tutup Berita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE DETAIL MODAL */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold">
                  {activeArticleModal.category}
                </span>
                <span>{activeArticleModal.date}</span>
                <span>• Penulis: <strong>{activeArticleModal.author}</strong></span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                {activeArticleModal.title}
              </h2>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4 font-serif">
              {activeArticleModal.content}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticleModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
