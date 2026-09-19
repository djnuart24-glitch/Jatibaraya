import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './views/public/HomeView';
import { AboutView } from './views/public/AboutView';
import { IdentityView } from './views/public/IdentityView';
import { ProgramsView } from './views/public/ProgramsView';
import { NewsView } from './views/public/NewsView';
import { DocumentationView } from './views/public/DocumentationView';
import { ContactView } from './views/public/ContactView';
import { AdminLoginView } from './views/admin/AdminLoginView';
import { AdminLayout } from './views/admin/AdminLayout';
import { useVisitorTracker } from './hooks/useVisitorTracker';

function MainApplication() {
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [activePublicTab, setActivePublicTab] = useState<string>('beranda');

  // Automatically monitor and record visitor pageviews and active heartbeat
  useVisitorTracker(activePublicTab, viewMode);

  // Listen to hash changes for deep linking (e.g. #admin, #informasi?tipe=berita&id=xxx, #program)
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const [baseHash] = rawHash.split('?');
      const cleanHash = (baseHash || '').toLowerCase();

      if (cleanHash === 'admin') {
        setViewMode('admin');
      } else if (['beranda', 'tentang', 'identitas', 'program', 'informasi', 'dokumentasi', 'kontak'].includes(cleanHash)) {
        setActivePublicTab(cleanHash);
        setViewMode('public');
      } else if (cleanHash.startsWith('berita') || cleanHash.startsWith('artikel') || cleanHash.startsWith('pengumuman')) {
        setActivePublicTab('informasi');
        setViewMode('public');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActivePublicTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewsDetail = (id: string) => {
    window.location.hash = `informasi?tipe=berita&id=${encodeURIComponent(id)}`;
    setActivePublicTab('informasi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setViewMode('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPublic = () => {
    setViewMode('public');
    window.location.hash = activePublicTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ADMIN MODE
  if (viewMode === 'admin') {
    if (!isAuthenticated) {
      return <AdminLoginView onBackToPublic={handleBackToPublic} />;
    }
    return <AdminLayout onViewPublic={handleBackToPublic} />;
  }

  // PUBLIC WEBSITE MODE
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans selection:bg-amber-300 selection:text-emerald-950">
      <Navbar
        currentTab={activePublicTab}
        onSelectTab={handleSelectTab}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-1 w-full">
        {activePublicTab === 'beranda' && (
          <HomeView onSelectTab={handleSelectTab} onOpenNewsDetail={handleOpenNewsDetail} />
        )}
        {activePublicTab === 'tentang' && (
          <AboutView onSelectTab={handleSelectTab} />
        )}
        {activePublicTab === 'identitas' && (
          <IdentityView onSelectTab={handleSelectTab} />
        )}
        {activePublicTab === 'program' && <ProgramsView />}
        {activePublicTab === 'informasi' && <NewsView />}
        {activePublicTab === 'dokumentasi' && <DocumentationView />}
        {activePublicTab === 'kontak' && <ContactView />}
      </main>

      <Footer
        onSelectTab={handleSelectTab}
        onOpenAdmin={handleOpenAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <MainApplication />
      </AuthProvider>
    </DataProvider>
  );
}
