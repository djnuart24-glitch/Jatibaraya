import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useJatibarayaData } from '../../context/DataContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminMobileNav } from '../../components/admin/AdminMobileNav';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminHomeView } from './AdminHomeView';
import { AdminAboutView } from './AdminAboutView';
import { AdminIdentityView } from './AdminIdentityView';
import { AdminProgramsView } from './AdminProgramsView';
import { AdminNewsView } from './AdminNewsView';
import { AdminArticlesView } from './AdminArticlesView';
import { AdminBahtsulView } from './AdminBahtsulView';
import { AdminAnnouncementsView } from './AdminAnnouncementsView';
import { AdminDocumentationView } from './AdminDocumentationView';
import { AdminStatsView } from './AdminStatsView';
import { AdminContactView } from './AdminContactView';
import { AdminSocialView } from './AdminSocialView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminAuditView } from './AdminAuditView';
import { AdminVisitorsView } from './AdminVisitorsView';
import { Globe, Menu, ShieldCheck, Cloud, RefreshCw } from 'lucide-react';

interface AdminLayoutProps {
  onViewPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onViewPublic }) => {
  const { logout, currentUser } = useAuth();
  const { cloudStatus, isCloudSyncing, lastCloudSync, saveToCloud } = useJatibarayaData();
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Scroll to top whenever section changes so user immediately sees the active view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleLogout = () => {
    if (confirm('Keluar dari sesi dashboard admin?')) {
      logout();
      onViewPublic();
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <AdminDashboardOverview
            onSelectSection={setCurrentSection}
            onViewPublic={onViewPublic}
          />
        );
      case 'beranda':
        return <AdminHomeView />;
      case 'tentang':
        return <AdminAboutView />;
      case 'identitas':
        return <AdminIdentityView />;
      case 'program':
        return <AdminProgramsView />;
      case 'berita':
        return <AdminNewsView />;
      case 'artikel':
        return <AdminArticlesView />;
      case 'bahtsul':
        return <AdminBahtsulView />;
      case 'pengumuman':
        return <AdminAnnouncementsView />;
      case 'dokumentasi':
        return <AdminDocumentationView />;
      case 'statistik':
        return <AdminStatsView />;
      case 'kontak':
        return <AdminContactView />;
      case 'sosial':
        return <AdminSocialView />;
      case 'pengaturan':
        return <AdminSettingsView />;
      case 'audit':
        return <AdminAuditView />;
      case 'pengunjung':
        return <AdminVisitorsView />;
      default:
        return (
          <AdminDashboardOverview
            onSelectSection={setCurrentSection}
            onViewPublic={onViewPublic}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* 14-Menu Sidebar for Desktop / Tablet Drawer */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        onLogout={handleLogout}
        onViewPublic={onViewPublic}
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-12">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-mono text-emerald-800 uppercase tracking-wider font-semibold">
                Jatibaraya Website Builder
              </span>
              <h2 className="text-base font-serif font-bold text-slate-900 capitalize">
                Menu: {currentSection}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Realtime Cloud Sync Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-xs font-mono bg-slate-50 border-slate-200">
              <span className="relative flex h-2 w-2">
                {cloudStatus === 'connected' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  cloudStatus === 'connected' ? 'bg-emerald-500' :
                  cloudStatus === 'syncing' ? 'bg-amber-500' :
                  cloudStatus === 'connecting' ? 'bg-sky-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-700 font-sans font-medium flex items-center gap-1">
                <Cloud className="w-3 h-3 text-slate-500" />
                <span className="hidden xs:inline sm:inline">
                  {cloudStatus === 'connected' ? 'Cloud Online' :
                   cloudStatus === 'syncing' ? 'Menyinkronkan...' :
                   cloudStatus === 'connecting' ? 'Menghubungkan...' : 'Offline / Lokal'}
                </span>
                <span className="inline xs:hidden sm:hidden">
                  {cloudStatus === 'connected' ? 'Online' :
                   cloudStatus === 'syncing' ? 'Sync...' : 'Offline'}
                </span>
              </span>
              {lastCloudSync && (
                <span className="hidden md:inline text-[10px] text-slate-400">
                  {lastCloudSync}
                </span>
              )}
              <button
                type="button"
                onClick={() => saveToCloud().catch(() => {})}
                disabled={isCloudSyncing}
                title="Sinkronkan ke Cloud Sekarang"
                className="text-slate-400 hover:text-emerald-700 transition-colors p-0.5 ml-0.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isCloudSyncing ? 'animate-spin text-amber-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={onViewPublic}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Lihat Website Publik</span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="hidden md:block text-left">
                <span className="font-bold text-slate-800 block text-[11px]">
                  {currentUser?.name || 'Pengurus Jatibaraya'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {renderCurrentSection()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <AdminMobileNav
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
      />
    </div>
  );
};
