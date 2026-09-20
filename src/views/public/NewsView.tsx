import React, { useState, useEffect } from 'react';
import { useJatibarayaData } from '../../context/DataContext';
import { NewsItem, ArticleItem, AnnouncementItem, BahtsulMasailItem } from '../../types';
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
  Scroll,
  Scale,
  Award,
} from 'lucide-react';
import { ShareModal } from '../../components/common/ShareModal';
import { ShareableItem } from '../../utils/shareUtils';

export const NewsView: React.FC = () => {
  const { data } = useJatibarayaData();
  const { news, articles, announcements, bahtsulMasail } = data;

  const [activeTab, setActiveTab] = useState<'berita' | 'artikel' | 'bahtsul' | 'pengumuman'>('berita');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);
  const [activeArticleModal, setActiveArticleModal] = useState<ArticleItem | null>(null);
  const [activeBahtsulModal, setActiveBahtsulModal] = useState<BahtsulMasailItem | null>(null);

  // Share Modal State
  const [shareTarget, setShareTarget] = useState<ShareableItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShare = (item: ShareableItem) => {
    setShareTarget(item);
    setIsShareModalOpen(true);
  };

  const publishedNews = news.filter((n) => n.published);
  const publishedArticles = articles.filter((a) => a.published);
  const publishedAnnouncements = announcements.filter((a) => a.published);
  const publishedBahtsul = (bahtsulMasail || []).filter((b) => b.published);

  // Deep linking: parse #informasi?tipe=berita&id=xxx or #berita-xxx
  useEffect(() => {
    const handleCheckHash = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (!rawHash) return;

      if (rawHash.includes('?')) {
        const [, query] = rawHash.split('?');
        const params = new URLSearchParams(query);
        const tipe = params.get('tipe') || params.get('type');
        const id = params.get('id');

        if (tipe === 'berita') {
          setActiveTab('berita');
          if (id) {
            const found = news.find((n) => n.id === id);
            if (found) setActiveNewsModal(found);
          }
        } else if (tipe === 'artikel') {
          setActiveTab('artikel');
          if (id) {
            const found = articles.find((a) => a.id === id);
            if (found) setActiveArticleModal(found);
          }
        } else if (tipe === 'bahtsul') {
          setActiveTab('bahtsul');
          if (id) {
            const found = (bahtsulMasail || []).find((b) => b.id === id);
            if (found) setActiveBahtsulModal(found);
          }
        } else if (tipe === 'pengumuman') {
          setActiveTab('pengumuman');
        }
      } else if (rawHash.startsWith('berita-')) {
        const id = rawHash.replace('berita-', '');
        setActiveTab('berita');
        const found = news.find((n) => n.id === id);
        if (found) setActiveNewsModal(found);
      } else if (rawHash.startsWith('artikel-')) {
        const id = rawHash.replace('artikel-', '');
        setActiveTab('artikel');
        const found = articles.find((a) => a.id === id);
        if (found) setActiveArticleModal(found);
      } else if (rawHash.startsWith('bahtsul-')) {
        const id = rawHash.replace('bahtsul-', '');
        setActiveTab('bahtsul');
        const found = (bahtsulMasail || []).find((b) => b.id === id);
        if (found) setActiveBahtsulModal(found);
      }
    };

    handleCheckHash();
    window.addEventListener('hashchange', handleCheckHash);
    return () => window.removeEventListener('hashchange', handleCheckHash);
  }, [news, articles, bahtsulMasail]);

  const handleOpenNewsModal = (item: NewsItem) => {
    setActiveNewsModal(item);
    window.location.hash = `informasi?tipe=berita&id=${encodeURIComponent(item.id)}`;
  };

  const handleCloseNewsModal = () => {
    setActiveNewsModal(null);
    window.location.hash = 'informasi';
  };

  const handleOpenArticleModal = (item: ArticleItem) => {
    setActiveArticleModal(item);
    window.location.hash = `informasi?tipe=artikel&id=${encodeURIComponent(item.id)}`;
  };

  const handleCloseArticleModal = () => {
    setActiveArticleModal(null);
    window.location.hash = 'informasi';
  };

  const handleOpenBahtsulModal = (item: BahtsulMasailItem) => {
    setActiveBahtsulModal(item);
    window.location.hash = `informasi?tipe=bahtsul&id=${encodeURIComponent(item.id)}`;
  };

  const handleCloseBahtsulModal = () => {
    setActiveBahtsulModal(null);
    window.location.hash = 'informasi';
  };

  const filteredNews = publishedNews.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = publishedArticles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBahtsul = publishedBahtsul.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.masalah.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.jawaban.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.ibarat && b.ibarat.toLowerCase().includes(searchQuery.toLowerCase()))
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
          Wadah informasi resmi, pengumuman jadwal kegiatan santri Priangan, serta tulisan inspiratif warga Jatibaraya yang dapat dibaca dan disebarluaskan.
        </p>
      </div>

      {/* Announcements Banner if any */}
      {publishedAnnouncements.length > 0 && (
        <div className="space-y-3">
          {publishedAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border ${
                ann.priority === 'penting'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    ann.priority === 'penting' ? 'text-amber-600' : 'text-emerald-700'
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                      Pengumuman {ann.priority === 'penting' ? 'Penting' : 'Resmi'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">• {ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold">{ann.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-700">{ann.content}</p>
                </div>
              </div>

              <button
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-end sm:self-auto flex-shrink-0"
                title="Bagikan Pengumuman"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bagikan</span>
              </button>
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
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'artikel'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Artikel Santri ({publishedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('bahtsul')}
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'bahtsul'
                ? 'bg-emerald-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span>Bahtsul Masail ({publishedBahtsul.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                      <h3
                        onClick={() => handleOpenNewsModal(item)}
                        className="text-lg font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenNewsModal(item)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer py-1"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </button>

                    <button
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
                      title="Bagikan Berita Ini"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Bagikan</span>
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

                    <h3
                      onClick={() => handleOpenArticleModal(item)}
                      className="text-xl font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleOpenShare({
                            id: item.id,
                            title: item.title,
                            summary: item.summary,
                            content: item.content,
                            category: item.category,
                            author: item.author,
                            date: item.date,
                            type: 'artikel',
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer"
                        title="Bagikan Artikel Ini"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Bagikan</span>
                      </button>

                      <button
                        onClick={() => handleOpenArticleModal(item)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer py-1.5 px-2"
                      >
                        <span>Baca Artikel</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Tab Bahtsul Masail */}
      {activeTab === 'bahtsul' && (
        <div className="space-y-6">
          {/* Intro Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white border border-emerald-800/60 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-400/30">
                <Scroll className="w-3.5 h-3.5 text-amber-300" />
                <span>Ketetapan Fiqhiyyah Santri Priangan</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Hasil Bahtsul Masail Jatibaraya
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
                Dokumentasi keputusan musyawarah keagamaan, perumusan fatwa fiqih waqi&apos;iyyah, maudhu&apos;iyyah, dan kontemporer berlandaskan nash sharih kutubut turats (kitab kuning) ulama salafush shalih.
              </p>
            </div>
          </div>

          {filteredBahtsul.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Scroll className="w-6 h-6" />
              </div>
              <p className="text-base text-slate-700 font-medium font-serif">
                Belum ada hasil bahtsul masail yang dipublikasikan.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Pengurus dapat menginput hasil keputusan musyawarah fiqih, as-su&apos;al, al-jawab, serta ta&apos;bir kitab kuning melalui Dashboard Admin Jatibaraya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBahtsul.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {item.kategori}
                        </span>
                        {item.tingkat && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                            {item.tingkat}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{item.tanggal}</span>
                    </div>

                    <h3
                      onClick={() => handleOpenBahtsulModal(item)}
                      className="text-lg sm:text-xl font-serif font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h3>

                    {/* Problem Box Preview */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">
                        As-Su&apos;al (Deskripsi Masalah):
                      </span>
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {item.masalah}
                      </p>
                    </div>

                    {/* Answer Box Preview */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-900 font-mono block flex items-center gap-1">
                        <Scale className="w-3 h-3 text-emerald-700" />
                        <span>Al-Jawab (Keputusan Hukum):</span>
                      </span>
                      <p className="text-xs font-semibold text-emerald-950 line-clamp-3 leading-relaxed">
                        {item.jawaban}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500 truncate">
                      {item.mushahih ? (
                        <span>Mushahih: <strong className="text-slate-700">{item.mushahih}</strong></span>
                      ) : (
                        <span>Musyawirin: <strong className="text-slate-700">{item.musyawirin || 'Tim Jatibaraya'}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          handleOpenShare({
                            id: item.id,
                            title: item.title,
                            summary: `[Kategori: ${item.kategori}] Jawaban: ${item.jawaban.slice(0, 150)}...`,
                            content: `Deskripsi Masalah:\n${item.masalah}\n\nKeputusan Hukum:\n${item.jawaban}${item.ibarat ? `\n\nTa'bir:\n${item.ibarat}` : ''}`,
                            category: item.kategori,
                            author: item.musyawirin || item.mushahih || 'Dewan Bahtsul Jatibaraya',
                            date: item.tanggal,
                            type: 'bahtsul',
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer"
                        title="Bagikan Keputusan Ini"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Bagikan</span>
                      </button>

                      <button
                        onClick={() => handleOpenBahtsulModal(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Lihat Ta&apos;bir</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Tab Pengumuman */}
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
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-800">
                    STATUS: {ann.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{ann.date}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Bagikan Pengumuman ke WA / Media Sosial</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* NEWS DETAIL MODAL */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Top Action Row */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() =>
                  handleOpenShare({
                    id: activeNewsModal.id,
                    title: activeNewsModal.title,
                    summary: activeNewsModal.summary,
                    content: activeNewsModal.content,
                    category: activeNewsModal.category,
                    author: activeNewsModal.author,
                    date: activeNewsModal.date,
                    type: 'berita',
                    imageUrl: activeNewsModal.imageUrl,
                  })
                }
                className="p-2 rounded-full text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer flex items-center gap-1 text-xs font-semibold transition-colors"
                title="Bagikan Berita Ini"
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
              <button
                onClick={handleCloseNewsModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() =>
                  handleOpenShare({
                    id: activeNewsModal.id,
                    title: activeNewsModal.title,
                    summary: activeNewsModal.summary,
                    content: activeNewsModal.content,
                    category: activeNewsModal.category,
                    author: activeNewsModal.author,
                    date: activeNewsModal.date,
                    type: 'berita',
                    imageUrl: activeNewsModal.imageUrl,
                  })
                }
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Bagikan ke WhatsApp & Medsos</span>
              </button>

              <button
                onClick={handleCloseNewsModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer text-center"
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
            {/* Top Action Row */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() =>
                  handleOpenShare({
                    id: activeArticleModal.id,
                    title: activeArticleModal.title,
                    summary: activeArticleModal.summary,
                    content: activeArticleModal.content,
                    category: activeArticleModal.category,
                    author: activeArticleModal.author,
                    date: activeArticleModal.date,
                    type: 'artikel',
                  })
                }
                className="p-2 rounded-full text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer flex items-center gap-1 text-xs font-semibold transition-colors"
                title="Bagikan Artikel Ini"
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
              <button
                onClick={handleCloseArticleModal}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() =>
                  handleOpenShare({
                    id: activeArticleModal.id,
                    title: activeArticleModal.title,
                    summary: activeArticleModal.summary,
                    content: activeArticleModal.content,
                    category: activeArticleModal.category,
                    author: activeArticleModal.author,
                    date: activeArticleModal.date,
                    type: 'artikel',
                  })
                }
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Bagikan ke WhatsApp & Medsos</span>
              </button>

              <button
                onClick={handleCloseArticleModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer text-center"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAHTSUL MASAIL DETAIL MODAL */}
      {activeBahtsulModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Top Action Row */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeBahtsulModal.kategori}</span>
                </span>
                {activeBahtsulModal.tingkat && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                    {activeBahtsulModal.tingkat}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleOpenShare({
                      id: activeBahtsulModal.id,
                      title: activeBahtsulModal.title,
                      summary: `[Kategori: ${activeBahtsulModal.kategori}] Jawaban: ${activeBahtsulModal.jawaban.slice(0, 150)}...`,
                      content: `Deskripsi Masalah:\n${activeBahtsulModal.masalah}\n\nKeputusan Hukum:\n${activeBahtsulModal.jawaban}${activeBahtsulModal.ibarat ? `\n\nTa'bir:\n${activeBahtsulModal.ibarat}` : ''}`,
                      category: activeBahtsulModal.kategori,
                      author: activeBahtsulModal.musyawirin || activeBahtsulModal.mushahih || 'Dewan Bahtsul Jatibaraya',
                      date: activeBahtsulModal.tanggal,
                      type: 'bahtsul',
                    })
                  }
                  className="p-2 rounded-full text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer flex items-center gap-1 text-xs font-semibold transition-colors"
                  title="Bagikan Hasil Bahtsul Masail"
                >
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">Bagikan</span>
                </button>
                <button
                  onClick={handleCloseBahtsulModal}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-mono">
                Tanggal Penetapan: {activeBahtsulModal.tanggal}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                {activeBahtsulModal.title}
              </h2>
              {(activeBahtsulModal.musyawirin || activeBahtsulModal.mushahih) && (
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                  {activeBahtsulModal.musyawirin && (
                    <span>Perumus / Musyawirin: <strong className="text-slate-800">{activeBahtsulModal.musyawirin}</strong></span>
                  )}
                  {activeBahtsulModal.mushahih && (
                    <span>Mushahih: <strong className="text-emerald-800 font-bold">{activeBahtsulModal.mushahih}</strong></span>
                  )}
                </div>
              )}
            </div>

            {/* Section 1: As-Su'al (Deskripsi Masalah) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 font-serif font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>AS-SU&apos;AL (DESKRIPSI MASALAH)</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                {activeBahtsulModal.masalah}
              </p>
            </div>

            {/* Section 2: Al-Jawab (Keputusan Hukum) */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-950 font-serif font-bold text-sm">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>AL-JAWAB (KEPUTUSAN HUKUM FIQIH)</span>
              </div>
              <p className="text-sm text-emerald-950 font-semibold leading-relaxed whitespace-pre-line font-serif">
                {activeBahtsulModal.jawaban}
              </p>
            </div>

            {/* Section 3: Al-Ibarat / Ta'bir Kitab Kuning */}
            {activeBahtsulModal.ibarat && (
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-950 font-serif font-bold text-sm">
                  <Scroll className="w-4 h-4 text-amber-700" />
                  <span>AL-IBARAT / TA&apos;BIR (KUTIPAN RUJUKAN KITAB KUNING)</span>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-serif bg-white/90 p-4 rounded-xl border border-amber-100">
                  {activeBahtsulModal.ibarat}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() =>
                  handleOpenShare({
                    id: activeBahtsulModal.id,
                    title: activeBahtsulModal.title,
                    summary: `[Kategori: ${activeBahtsulModal.kategori}] Jawaban: ${activeBahtsulModal.jawaban.slice(0, 150)}...`,
                    content: `Deskripsi Masalah:\n${activeBahtsulModal.masalah}\n\nKeputusan Hukum:\n${activeBahtsulModal.jawaban}${activeBahtsulModal.ibarat ? `\n\nTa'bir:\n${activeBahtsulModal.ibarat}` : ''}`,
                    category: activeBahtsulModal.kategori,
                    author: activeBahtsulModal.musyawirin || activeBahtsulModal.mushahih || 'Dewan Bahtsul Jatibaraya',
                    date: activeBahtsulModal.tanggal,
                    type: 'bahtsul',
                  })
                }
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Bagikan ke WhatsApp & Medsos</span>
              </button>

              <button
                onClick={handleCloseBahtsulModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer text-center"
              >
                Tutup Bahtsul Masail
              </button>
            </div>
          </div>
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
