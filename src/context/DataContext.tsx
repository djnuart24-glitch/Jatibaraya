import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  JatibarayaDatabase,
  SiteSettings,
  AboutContent,
  SymbolElement,
  ProgramItem,
  NewsItem,
  ArticleItem,
  BahtsulMasailItem,
  AnnouncementItem,
  MediaItem,
  OrganizationStats,
  ContactInfo,
  SocialMediaItem,
} from '../types';
import { initialJatibarayaData } from '../data/initialData';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { recordAuditLog } from '../services/auditService';

const STORAGE_KEY = 'jatibaraya_database_v1';
const FIRESTORE_COLLECTION = 'content';
const FIRESTORE_DOC_ID = 'main';

export type CloudSyncStatus = 'connecting' | 'connected' | 'syncing' | 'offline' | 'error';

interface DataContextType {
  data: JatibarayaDatabase;
  cloudStatus: CloudSyncStatus;
  isCloudSyncing: boolean;
  lastCloudSync: string | null;
  saveToCloud: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateAbout: (about: Partial<AboutContent>) => void;
  updateSymbols: (symbols: SymbolElement[]) => void;
  updateStats: (stats: Partial<OrganizationStats>) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateSocials: (socials: SocialMediaItem[]) => void;

  // Program CRUD
  addProgram: (program: Omit<ProgramItem, 'id' | 'created_at' | 'updated_at'>) => ProgramItem;
  updateProgram: (id: string, program: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  // News CRUD
  addNews: (news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => NewsItem;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  // Article CRUD
  addArticle: (article: Omit<ArticleItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => ArticleItem;
  updateArticle: (id: string, article: Partial<ArticleItem>) => void;
  deleteArticle: (id: string) => void;

  // Bahtsul Masail CRUD
  addBahtsul: (item: Omit<BahtsulMasailItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => BahtsulMasailItem;
  updateBahtsul: (id: string, item: Partial<BahtsulMasailItem>) => void;
  deleteBahtsul: (id: string) => void;

  // Announcement CRUD
  addAnnouncement: (ann: Omit<AnnouncementItem, 'id' | 'created_at' | 'updated_at'>) => AnnouncementItem;
  updateAnnouncement: (id: string, ann: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;

  // Media CRUD
  addMedia: (item: Omit<MediaItem, 'id' | 'created_at'>) => MediaItem;
  deleteMedia: (id: string) => void;

  // Backup & Restore
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
  resetToInitial: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<JatibarayaDatabase>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedSettings = {
          ...initialJatibarayaData.settings,
          ...parsed.settings,
          logoUrl: (parsed.settings?.logoUrl && parsed.settings.logoUrl.trim() !== '' && parsed.settings.logoUrl !== '/assets/jatibaraya-logo.svg')
            ? parsed.settings.logoUrl
            : initialJatibarayaData.settings.logoUrl,
          faviconUrl: (parsed.settings?.faviconUrl && parsed.settings.faviconUrl.trim() !== '' && parsed.settings.faviconUrl !== '/assets/jatibaraya-logo.svg')
            ? parsed.settings.faviconUrl
            : initialJatibarayaData.settings.faviconUrl,
        };
        const mergedSymbols = (Array.isArray(parsed.symbols) && parsed.symbols.length >= 5)
          ? parsed.symbols
          : initialJatibarayaData.symbols;

        return {
          ...initialJatibarayaData,
          ...parsed,
          settings: mergedSettings,
          symbols: mergedSymbols,
          bahtsulMasail: Array.isArray(parsed.bahtsulMasail)
            ? parsed.bahtsulMasail
            : initialJatibarayaData.bahtsulMasail,
          stats: { ...initialJatibarayaData.stats, ...parsed.stats },
          contact: { ...initialJatibarayaData.contact, ...parsed.contact },
          about: { ...initialJatibarayaData.about, ...parsed.about },
        };
      }
    } catch {
      // Fallback
    }
    return initialJatibarayaData;
  });

  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>('connecting');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);

  // Anti-Race Condition Refs
  const pendingChangesCounterRef = useRef<number>(0);
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());
  const latestDataRef = useRef<JatibarayaDatabase>(data);
  latestDataRef.current = data;

  // 1. Listen for real-time changes from Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const remote = snapshot.data() as Partial<JatibarayaDatabase>;
            
            // If local uncommitted changes are in flight, do not overwrite with stale snapshot
            if (pendingChangesCounterRef.current > 0) {
              return;
            }

            setData((prev) => {
              const merged: JatibarayaDatabase = {
                ...initialJatibarayaData,
                ...remote,
                settings: remote.settings ? {
                  ...initialJatibarayaData.settings,
                  ...remote.settings,
                  logoUrl: (remote.settings.logoUrl && remote.settings.logoUrl !== '/assets/jatibaraya-logo.svg')
                    ? remote.settings.logoUrl
                    : (prev.settings?.logoUrl && prev.settings.logoUrl !== '/assets/jatibaraya-logo.svg')
                      ? prev.settings.logoUrl
                      : initialJatibarayaData.settings.logoUrl,
                  faviconUrl: (remote.settings.faviconUrl && remote.settings.faviconUrl !== '/assets/jatibaraya-logo.svg')
                    ? remote.settings.faviconUrl
                    : (prev.settings?.faviconUrl && prev.settings.faviconUrl !== '/assets/jatibaraya-logo.svg')
                      ? prev.settings.faviconUrl
                      : initialJatibarayaData.settings.faviconUrl,
                } : prev.settings,
                about: remote.about ? {
                  ...initialJatibarayaData.about,
                  ...remote.about,
                } : prev.about,
                symbols: Array.isArray(remote.symbols) && remote.symbols.length > 0
                  ? remote.symbols
                  : prev.symbols,
                programs: Array.isArray(remote.programs)
                  ? remote.programs
                  : prev.programs,
                news: Array.isArray(remote.news)
                  ? remote.news
                  : prev.news,
                articles: Array.isArray(remote.articles)
                  ? remote.articles
                  : prev.articles,
                bahtsulMasail: Array.isArray(remote.bahtsulMasail)
                  ? remote.bahtsulMasail
                  : (prev.bahtsulMasail || initialJatibarayaData.bahtsulMasail || []),
                announcements: Array.isArray(remote.announcements)
                  ? remote.announcements
                  : prev.announcements,
                media: Array.isArray(remote.media)
                  ? remote.media
                  : prev.media,
                socials: Array.isArray(remote.socials)
                  ? remote.socials
                  : prev.socials,
                stats: remote.stats ? {
                  ...initialJatibarayaData.stats,
                  ...remote.stats,
                } : prev.stats,
                contact: remote.contact ? {
                  ...initialJatibarayaData.contact,
                  ...remote.contact,
                } : prev.contact,
              };

              latestDataRef.current = merged;
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (e) {
                // Ignore quota
              }
              return merged;
            });
            setCloudStatus('connected');
            setLastCloudSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          } else {
            // First time: seed initial database to Firestore
            setDoc(docRef, JSON.parse(JSON.stringify(initialJatibarayaData)), { merge: true })
              .then(() => {
                setCloudStatus('connected');
                setLastCloudSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
              })
              .catch((err) => {
                console.warn('Gagal inisialisasi awal Firestore:', err);
                setCloudStatus('error');
              });
          }
        },
        (error) => {
          console.warn('Firestore snapshot error:', error);
          setCloudStatus('error');
        }
      );
    } catch (err) {
      console.warn('Koneksi Firestore gagal:', err);
      setCloudStatus('error');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 2. Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err: any) {
      console.warn('Gagal menyimpan ke localStorage:', err);
    }
  }, [data]);

  // Synchronize directly to Firestore
  const syncToFirestore = async (dataToSave: JatibarayaDatabase) => {
    setIsCloudSyncing(true);
    setCloudStatus('syncing');
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      // Clean undefined fields recursively so Firestore setDoc never rejects with Unsupported field value: undefined
      const cleaned = JSON.parse(JSON.stringify(dataToSave));
      // Safeguard against individual media objects with oversize base64 blowing the 1MB Firestore document limit
      if (Array.isArray(cleaned.media)) {
        cleaned.media = cleaned.media.map((item: any) => {
          if (item?.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data:image') && item.imageUrl.length > 200000) {
            return { ...item, imageUrl: '/assets/jatibaraya-logo.png' };
          }
          return item;
        });
      }
      await setDoc(docRef, cleaned, { merge: true });
      pendingChangesCounterRef.current = 0;
      setCloudStatus('connected');
      setLastCloudSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Gagal sinkronisasi data ke Cloud Firestore:', err);
      setCloudStatus('error');
      pendingChangesCounterRef.current = 0;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Immediate state + cloud updater for real-time synchronization across any browser
  const applyChange = (updater: (prev: JatibarayaDatabase) => JatibarayaDatabase) => {
    // 1. Calculate next state immediately from latestDataRef.current
    const next = updater(latestDataRef.current);
    latestDataRef.current = next;
    pendingChangesCounterRef.current += 1;

    // 2. Update React state immediately
    setData(next);

    // 3. Update localStorage synchronously
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // Ignore quota
    }

    // 4. Trigger cloud sync outside React's setState batch
    writeQueueRef.current = writeQueueRef.current
      .catch(() => {})
      .then(() => syncToFirestore(next));
  };

  // Fallback debounced cloud persistence for rapid uncommitted changes
  useEffect(() => {
    if (pendingChangesCounterRef.current === 0) {
      return;
    }

    const timer = setTimeout(() => {
      const dataToSave = latestDataRef.current;
      writeQueueRef.current = writeQueueRef.current
        .catch(() => {})
        .then(() => syncToFirestore(dataToSave));
    }, 400);

    return () => clearTimeout(timer);
  }, [data]);

  // Mutex-protected manual cloud save
  const saveToCloud = async () => {
    return new Promise<void>((resolve, reject) => {
      writeQueueRef.current = writeQueueRef.current
        .then(async () => {
          await syncToFirestore(latestDataRef.current);
          resolve();
        })
        .catch(reject);
    });
  };

  const markUserChange = () => {
    pendingChangesCounterRef.current += 1;
  };

  const updateSettings = (settings: Partial<SiteSettings>) => {
    applyChange((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
        updated_at: new Date().toISOString(),
      },
    }));

    recordAuditLog(
      'UPDATE_SETTINGS',
      'settings',
      'Memperbarui informasi & branding website',
      settings.name ? `Nama organisasi: ${settings.name}` : undefined
    ).catch(() => {});
  };

  const updateAbout = (about: Partial<AboutContent>) => {
    applyChange((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...about,
        updated_at: new Date().toISOString(),
      },
    }));

    recordAuditLog(
      'UPDATE_ABOUT',
      'settings',
      'Memperbarui halaman Tentang (Visi & Misi Jatibaraya)'
    ).catch(() => {});
  };

  const updateSymbols = (symbols: SymbolElement[]) => {
    applyChange((prev) => ({
      ...prev,
      symbols,
    }));

    recordAuditLog(
      'UPDATE_SYMBOLS',
      'settings',
      'Memperbarui filosofi 6 elemen lambang resmi Jatibaraya'
    ).catch(() => {});
  };

  const updateStats = (stats: Partial<OrganizationStats>) => {
    applyChange((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        ...stats,
        updated_at: new Date().toISOString(),
      },
    }));

    recordAuditLog(
      'UPDATE_STATS',
      'settings',
      'Memperbarui statistik data warga dan program'
    ).catch(() => {});
  };

  const updateContact = (contact: Partial<ContactInfo>) => {
    applyChange((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...contact,
        updated_at: new Date().toISOString(),
      },
    }));

    recordAuditLog(
      'UPDATE_CONTACT',
      'settings',
      'Memperbarui informasi kontak & alamat kesekretariatan'
    ).catch(() => {});
  };

  const updateSocials = (socials: SocialMediaItem[]) => {
    applyChange((prev) => ({
      ...prev,
      socials,
    }));

    recordAuditLog(
      'UPDATE_SOCIALS',
      'settings',
      'Memperbarui tautan akun media sosial resmi'
    ).catch(() => {});
  };

  const addProgram = (prog: Omit<ProgramItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ProgramItem = {
      ...prog,
      id: `prog-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    applyChange((prev) => ({
      ...prev,
      programs: [newItem, ...prev.programs],
    }));

    recordAuditLog(
      'ADD_PROGRAM',
      'program',
      `Menambahkan program baru: "${newItem.title}"`,
      `Kategori: ${newItem.category} • Jadwal: ${newItem.schedule}`
    ).catch(() => {});

    return newItem;
  };

  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    applyChange((prev) => ({
      ...prev,
      programs: prev.programs.map((item) =>
        item.id === id ? { ...item, ...updated, updated_at: new Date().toISOString() } : item
      ),
    }));

    recordAuditLog(
      'UPDATE_PROGRAM',
      'program',
      `Memperbarui program "${updated.title || id}"`
    ).catch(() => {});
  };

  const deleteProgram = (id: string) => {
    const target = data.programs.find((p) => p.id === id);
    applyChange((prev) => ({
      ...prev,
      programs: prev.programs.filter((item) => item.id !== id),
    }));

    recordAuditLog(
      'DELETE_PROGRAM',
      'program',
      `Menghapus program "${target?.title || id}"`
    ).catch(() => {});
  };

  const addNews = (newsData: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => {
    const newItem: NewsItem = {
      ...newsData,
      imageUrl: newsData.imageUrl || '',
      id: `news-${Date.now()}`,
      slug: slugify(newsData.title) || `news-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    applyChange((prev) => ({
      ...prev,
      news: [newItem, ...prev.news],
    }));

    recordAuditLog(
      'ADD_NEWS',
      'news',
      `Menerbitkan berita baru: "${newItem.title}"`,
      `Kategori: ${newItem.category} • Penulis: ${newItem.author}`
    ).catch(() => {});

    return newItem;
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    applyChange((prev) => ({
      ...prev,
      news: prev.news.map((item) => {
        if (item.id === id) {
          const newTitle = updated.title ?? item.title;
          return {
            ...item,
            ...updated,
            slug: updated.title ? slugify(newTitle) : item.slug,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      }),
    }));

    recordAuditLog(
      'UPDATE_NEWS',
      'news',
      `Memperbarui berita: "${updated.title || id}"`
    ).catch(() => {});
  };

  const deleteNews = (id: string) => {
    const target = data.news.find((n) => n.id === id);
    applyChange((prev) => ({
      ...prev,
      news: prev.news.filter((item) => item.id !== id),
    }));

    recordAuditLog(
      'DELETE_NEWS',
      'news',
      `Menghapus berita: "${target?.title || id}"`
    ).catch(() => {});
  };

  const addArticle = (artData: Omit<ArticleItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => {
    const newItem: ArticleItem = {
      ...artData,
      imageUrl: artData.imageUrl || '',
      id: `art-${Date.now()}`,
      slug: slugify(artData.title) || `art-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    applyChange((prev) => ({
      ...prev,
      articles: [newItem, ...prev.articles],
    }));

    recordAuditLog(
      'ADD_ARTICLE',
      'article',
      `Menerbitkan artikel baru: "${newItem.title}"`,
      `Kategori: ${newItem.category} • Penulis: ${newItem.author}`
    ).catch(() => {});

    return newItem;
  };

  const updateArticle = (id: string, updated: Partial<ArticleItem>) => {
    applyChange((prev) => ({
      ...prev,
      articles: prev.articles.map((item) => {
        if (item.id === id) {
          const newTitle = updated.title ?? item.title;
          return {
            ...item,
            ...updated,
            slug: updated.title ? slugify(newTitle) : item.slug,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      }),
    }));

    recordAuditLog(
      'UPDATE_ARTICLE',
      'article',
      `Memperbarui artikel: "${updated.title || id}"`
    ).catch(() => {});
  };

  const deleteArticle = (id: string) => {
    const target = data.articles.find((a) => a.id === id);
    applyChange((prev) => ({
      ...prev,
      articles: prev.articles.filter((item) => item.id !== id),
    }));

    recordAuditLog(
      'DELETE_ARTICLE',
      'article',
      `Menghapus artikel: "${target?.title || id}"`
    ).catch(() => {});
  };

  const addBahtsul = (bmData: Omit<BahtsulMasailItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => {
    const newItem: BahtsulMasailItem = {
      ...bmData,
      id: `bm-${Date.now()}`,
      slug: slugify(bmData.title) || `bm-${Date.now()}`,
      status: bmData.status || 'sah',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    applyChange((prev) => ({
      ...prev,
      bahtsulMasail: [newItem, ...(prev.bahtsulMasail || [])],
    }));

    recordAuditLog(
      'ADD_BAHTSUL',
      'bahtsul',
      `Menambahkan hasil Bahtsul Masail: "${newItem.title}"`,
      `Kategori: ${newItem.kategori} • Tingkat: ${newItem.tingkat || 'Jatibaraya'}`
    ).catch(() => {});

    return newItem;
  };

  const updateBahtsul = (id: string, updated: Partial<BahtsulMasailItem>) => {
    applyChange((prev) => ({
      ...prev,
      bahtsulMasail: (prev.bahtsulMasail || []).map((item) => {
        if (item.id === id) {
          const newTitle = updated.title ?? item.title;
          return {
            ...item,
            ...updated,
            slug: updated.title ? slugify(newTitle) : item.slug,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      }),
    }));

    recordAuditLog(
      'UPDATE_BAHTSUL',
      'bahtsul',
      `Memperbarui hasil Bahtsul Masail: "${updated.title || id}"`
    ).catch(() => {});
  };

  const deleteBahtsul = (id: string) => {
    const target = (data.bahtsulMasail || []).find((b) => b.id === id);
    applyChange((prev) => ({
      ...prev,
      bahtsulMasail: (prev.bahtsulMasail || []).filter((item) => item.id !== id),
    }));

    recordAuditLog(
      'DELETE_BAHTSUL',
      'bahtsul',
      `Menghapus hasil Bahtsul Masail: "${target?.title || id}"`
    ).catch(() => {});
  };

  const addAnnouncement = (annData: Omit<AnnouncementItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: AnnouncementItem = {
      ...annData,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    applyChange((prev) => ({
      ...prev,
      announcements: [newItem, ...prev.announcements],
    }));

    recordAuditLog(
      'ADD_ANNOUNCEMENT',
      'announcement',
      `Membuat pengumuman: "${newItem.title}"`,
      `Prioritas: ${newItem.priority}`
    ).catch(() => {});

    return newItem;
  };

  const updateAnnouncement = (id: string, updated: Partial<AnnouncementItem>) => {
    applyChange((prev) => ({
      ...prev,
      announcements: prev.announcements.map((item) =>
        item.id === id ? { ...item, ...updated, updated_at: new Date().toISOString() } : item
      ),
    }));

    recordAuditLog(
      'UPDATE_ANNOUNCEMENT',
      'announcement',
      `Memperbarui pengumuman: "${updated.title || id}"`
    ).catch(() => {});
  };

  const deleteAnnouncement = (id: string) => {
    const target = data.announcements.find((a) => a.id === id);
    applyChange((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((item) => item.id !== id),
    }));

    recordAuditLog(
      'DELETE_ANNOUNCEMENT',
      'announcement',
      `Menghapus pengumuman: "${target?.title || id}"`
    ).catch(() => {});
  };

  const addMedia = (item: Omit<MediaItem, 'id' | 'created_at'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    applyChange((prev) => ({
      ...prev,
      media: [newItem, ...prev.media],
    }));

    recordAuditLog(
      'ADD_MEDIA',
      'media',
      `Menambahkan dokumentasi: "${newItem.title}"`,
      `Kategori: ${newItem.category}`
    ).catch(() => {});

    return newItem;
  };

  const deleteMedia = (id: string) => {
    const target = data.media.find((m) => m.id === id);
    applyChange((prev) => ({
      ...prev,
      media: prev.media.filter((item) => item.id !== id),
    }));

    recordAuditLog(
      'DELETE_MEDIA',
      'media',
      `Menghapus dokumentasi: "${target?.title || id}"`
    ).catch(() => {});
  };

  const exportDatabaseJSON = () => {
    recordAuditLog(
      'EXPORT_BACKUP',
      'backup',
      'Admin mengekspor cadangan database JSON'
    ).catch(() => {});
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.settings && parsed.programs) {
        markUserChange();
        setData(parsed);
        saveToCloud().catch((e) => console.warn('Sync after import error:', e));

        recordAuditLog(
          'IMPORT_BACKUP',
          'backup',
          'Admin memulihkan data dari cadangan file JSON'
        ).catch(() => {});

        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetToInitial = () => {
    markUserChange();
    setData(initialJatibarayaData);
    saveToCloud().catch((e) => console.warn('Sync after reset error:', e));

    recordAuditLog(
      'RESET_DATABASE',
      'backup',
      'Admin mereset database ke data bawaan awal'
    ).catch(() => {});
  };

  return (
    <DataContext.Provider
      value={{
        data,
        cloudStatus,
        isCloudSyncing,
        lastCloudSync,
        saveToCloud,
        updateSettings,
        updateAbout,
        updateSymbols,
        updateStats,
        updateContact,
        updateSocials,
        addProgram,
        updateProgram,
        deleteProgram,
        addNews,
        updateNews,
        deleteNews,
        addArticle,
        updateArticle,
        deleteArticle,
        addBahtsul,
        updateBahtsul,
        deleteBahtsul,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addMedia,
        deleteMedia,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToInitial,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useJatibarayaData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useJatibarayaData must be used within DataProvider');
  }
  return context;
};
