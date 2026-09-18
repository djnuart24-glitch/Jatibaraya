import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  JatibarayaDatabase,
  SiteSettings,
  AboutContent,
  SymbolElement,
  ProgramItem,
  NewsItem,
  ArticleItem,
  AnnouncementItem,
  MediaItem,
  OrganizationStats,
  ContactInfo,
  SocialMediaItem,
} from '../types';
import { initialJatibarayaData } from '../data/initialData';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

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
          logoUrl: (parsed.settings?.logoUrl && parsed.settings.logoUrl.trim() !== '')
            ? parsed.settings.logoUrl
            : initialJatibarayaData.settings.logoUrl,
          faviconUrl: (parsed.settings?.faviconUrl && parsed.settings.faviconUrl.trim() !== '')
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

  const isRemoteUpdateRef = useRef(false);
  const isInitialLoadRef = useRef(true);

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
            isRemoteUpdateRef.current = true;
            setData((prev) => {
              const merged: JatibarayaDatabase = {
                ...initialJatibarayaData,
                ...prev,
                ...remote,
                settings: {
                  ...initialJatibarayaData.settings,
                  ...prev.settings,
                  ...remote.settings,
                },
                about: {
                  ...initialJatibarayaData.about,
                  ...prev.about,
                  ...remote.about,
                },
                symbols: Array.isArray(remote.symbols) && remote.symbols.length >= 5
                  ? remote.symbols
                  : prev.symbols,
                stats: { ...initialJatibarayaData.stats, ...prev.stats, ...remote.stats },
                contact: { ...initialJatibarayaData.contact, ...prev.contact, ...remote.contact },
              };
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
            setDoc(docRef, initialJatibarayaData, { merge: true })
              .then(() => {
                setCloudStatus('connected');
                setLastCloudSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
              })
              .catch((err) => {
                console.warn('Gagal inisialisasi awal Firestore:', err);
                setCloudStatus('error');
              });
          }
          isInitialLoadRef.current = false;
        },
        (error) => {
          console.warn('Firestore snapshot error:', error);
          setCloudStatus('error');
          isInitialLoadRef.current = false;
        }
      );
    } catch (err) {
      console.warn('Koneksi Firestore gagal:', err);
      setCloudStatus('error');
      isInitialLoadRef.current = false;
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

  // 3. Debounced cloud persistence on user changes
  useEffect(() => {
    // If incoming from remote snapshot or initial load, do not write back
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }
    if (isInitialLoadRef.current) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsCloudSyncing(true);
        const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
        await setDoc(docRef, data, { merge: true });
        setCloudStatus('connected');
        setLastCloudSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Gagal sinkronisasi data ke Cloud Firestore:', err);
        setCloudStatus('error');
      } finally {
        setIsCloudSyncing(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [data]);

  const saveToCloud = async () => {
    try {
      setIsCloudSyncing(true);
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(docRef, data, { merge: true });
      setCloudStatus('connected');
      setLastCloudSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Gagal manual simpan ke Cloud Firestore:', err);
      setCloudStatus('error');
      throw err;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const updateSettings = (settings: Partial<SiteSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const updateAbout = (about: Partial<AboutContent>) => {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...about,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const updateSymbols = (symbols: SymbolElement[]) => {
    setData((prev) => ({
      ...prev,
      symbols,
    }));
  };

  const updateStats = (stats: Partial<OrganizationStats>) => {
    setData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        ...stats,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const updateContact = (contact: Partial<ContactInfo>) => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...contact,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const updateSocials = (socials: SocialMediaItem[]) => {
    setData((prev) => ({
      ...prev,
      socials,
    }));
  };

  const addProgram = (prog: Omit<ProgramItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ProgramItem = {
      ...prog,
      id: `prog-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      programs: [newItem, ...prev.programs],
    }));
    return newItem;
  };

  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((item) =>
        item.id === id ? { ...item, ...updated, updated_at: new Date().toISOString() } : item
      ),
    }));
  };

  const deleteProgram = (id: string) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.filter((item) => item.id !== id),
    }));
  };

  const addNews = (newsData: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => {
    const newItem: NewsItem = {
      ...newsData,
      id: `news-${Date.now()}`,
      slug: slugify(newsData.title) || `news-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      news: [newItem, ...prev.news],
    }));
    return newItem;
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    setData((prev) => ({
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
  };

  const deleteNews = (id: string) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.filter((item) => item.id !== id),
    }));
  };

  const addArticle = (artData: Omit<ArticleItem, 'id' | 'created_at' | 'updated_at' | 'slug'>) => {
    const newItem: ArticleItem = {
      ...artData,
      id: `art-${Date.now()}`,
      slug: slugify(artData.title) || `art-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      articles: [newItem, ...prev.articles],
    }));
    return newItem;
  };

  const updateArticle = (id: string, updated: Partial<ArticleItem>) => {
    setData((prev) => ({
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
  };

  const deleteArticle = (id: string) => {
    setData((prev) => ({
      ...prev,
      articles: prev.articles.filter((item) => item.id !== id),
    }));
  };

  const addAnnouncement = (annData: Omit<AnnouncementItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: AnnouncementItem = {
      ...annData,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      announcements: [newItem, ...prev.announcements],
    }));
    return newItem;
  };

  const updateAnnouncement = (id: string, updated: Partial<AnnouncementItem>) => {
    setData((prev) => ({
      ...prev,
      announcements: prev.announcements.map((item) =>
        item.id === id ? { ...item, ...updated, updated_at: new Date().toISOString() } : item
      ),
    }));
  };

  const deleteAnnouncement = (id: string) => {
    setData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((item) => item.id !== id),
    }));
  };

  const addMedia = (item: Omit<MediaItem, 'id' | 'created_at'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      media: [newItem, ...prev.media],
    }));
    return newItem;
  };

  const deleteMedia = (id: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.filter((item) => item.id !== id),
    }));
  };

  const exportDatabaseJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.settings && parsed.programs) {
        setData(parsed);
        saveToCloud().catch((e) => console.warn('Sync after import error:', e));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetToInitial = () => {
    setData(initialJatibarayaData);
    saveToCloud().catch((e) => console.warn('Sync after reset error:', e));
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
