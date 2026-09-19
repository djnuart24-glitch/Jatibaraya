import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Newspaper,
  Settings,
  Menu,
} from 'lucide-react';

interface AdminMobileNavProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  onOpenDrawer: () => void;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({
  currentSection,
  onSelectSection,
  onOpenDrawer,
}) => {
  const quickItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'program', label: 'Program', icon: Layers },
    { id: 'berita', label: 'Berita', icon: Newspaper },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around text-slate-400 shadow-2xl">
      {quickItems.map((item) => {
        const Icon = item.icon;
        const active = currentSection === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-quick-tab-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              active ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      <button
        id="mobile-nav-all-menus-btn"
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
      >
        <Menu className="w-5 h-5 mb-0.5 text-emerald-400" />
        <span className="text-[10px] tracking-tight">Semua (15)</span>
      </button>
    </div>
  );

  function onSelectTab(id: string) {
    onSelectSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
