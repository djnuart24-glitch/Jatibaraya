import { useEffect, useRef } from 'react';
import { recordPageView, pingActiveSession } from '../services/visitorService';

const PAGE_TITLES: Record<string, string> = {
  beranda: 'Beranda Utama',
  tentang: 'Tentang & Profil Organisasi',
  identitas: 'Identitas & Makna Logo 5 Simbol',
  program: 'Program Kerja & Kegiatan',
  informasi: 'Berita & Pengumuman',
  dokumentasi: 'Galeri & Dokumentasi Kegiatan',
  kontak: 'Kontak & Sekretariat',
  admin: 'Panel Manajemen Admin',
};

export function useVisitorTracker(activeTab: string, viewMode: 'public' | 'admin') {
  const lastRecordedTabRef = useRef<string | null>(null);

  useEffect(() => {
    // Only record public traffic
    if (viewMode === 'public') {
      const title = PAGE_TITLES[activeTab] || `Halaman ${activeTab}`;
      recordPageView(activeTab, title, false);
      lastRecordedTabRef.current = activeTab;
    }
  }, [activeTab, viewMode]);

  // Heartbeat active session ping every 35 seconds if public and window is focused
  useEffect(() => {
    if (viewMode !== 'public') return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const currentTab = lastRecordedTabRef.current || activeTab;
        const title = PAGE_TITLES[currentTab] || `Halaman ${currentTab}`;
        pingActiveSession(currentTab, title);
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [activeTab, viewMode]);
}
