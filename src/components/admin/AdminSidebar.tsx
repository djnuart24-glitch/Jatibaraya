import React from 'react';
import {
  LayoutDashboard,
  Home,
  Info,
  Sparkles,
  Layers,
  Newspaper,
  BookOpen,
  Bell,
  Image,
  BarChart3,
  Phone,
  Share2,
  Settings,
  LogOut,
  Globe,
} from 'lucide-react';
import { JatibarayaLogo } from '../common/JatibarayaLogo';

interface AdminSidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  onLogout: () => void;
  onViewPublic: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  onLogout,
  onViewPublic,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'beranda', label: '2. Beranda', icon: Home },
    { id: 'tentang', label: '3. Tentang', icon: Info },
    { id: 'identitas', label: '4. Identitas', icon: Sparkles },
    { id: 'program', label: '5. Program', icon: Layers },
    { id: 'berita', label: '6. Berita', icon: Newspaper },
    { id: 'artikel', label: '7. Artikel', icon: BookOpen },
    { id: 'pengumuman', label: '8. Pengumuman', icon: Bell },
    { id: 'dokumentasi', label: '9. Dokumentasi', icon: Image },
    { id: 'statistik', label: '10. Statistik', icon: BarChart3 },
    { id: 'kontak', label: '11. Kontak', icon: Phone },
    { id: 'sosial', label: '12. Media Sosial', icon: Share2 },
    { id: 'pengaturan', label: '13. Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <JatibarayaLogo size="sm" showText={true} light={true} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-amber-400/90 font-mono bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>PANEL BUILDER</span>
            <span className="text-emerald-400">● AKTIF</span>
          </div>
        </div>

        {/* 13 Menu Items Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`admin-menu-${item.id}`}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  active
                    ? 'bg-emerald-800 text-white shadow-xs font-bold border-l-4 border-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions: View Public & 14. Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/90">
          <button
            id="admin-sidebar-public-view-btn"
            onClick={onViewPublic}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Lihat Website Publik</span>
          </button>

          <button
            id="admin-sidebar-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-300 text-xs font-semibold border border-red-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>14. Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
