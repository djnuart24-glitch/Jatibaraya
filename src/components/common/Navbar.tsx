import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';
import { JatibarayaLogo } from './JatibarayaLogo';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'tentang', label: 'Tentang' },
    { id: 'identitas', label: 'Identitas' },
    { id: 'program', label: 'Program' },
    { id: 'informasi', label: 'Informasi' },
    { id: 'dokumentasi', label: 'Dokumentasi' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-900/10'
          : 'bg-white/80 backdrop-blur-sm border-b border-emerald-900/5'
      }`}
    >
      {/* Top Banner with Motto */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 text-emerald-100 text-xs py-1.5 px-4 hidden md:block border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="italic font-serif text-amber-200">
              &ldquo;Ti Priangan, Mondok di Lirboyo, Berkhidmat Pikeun Umat.&rdquo;
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-300">
            <span>Bandung • Garut • Sumedang • Cimahi</span>
            <span className="text-slate-600">|</span>
            <button
              id="admin-top-shortcut-btn"
              onClick={onOpenAdmin}
              className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              title="Portal Admin"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Portal Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <button
            id="brand-home-button"
            onClick={() => handleNavClick('beranda')}
            className="flex items-center text-left cursor-pointer focus:outline-none"
          >
            <JatibarayaLogo size="md" showText={true} />
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      active
                        ? 'text-emerald-900 bg-emerald-50 font-semibold border-b-2 border-emerald-700'
                        : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Portal Admin Button */}
            <button
              id="desktop-admin-portal-btn"
              onClick={onOpenAdmin}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-xs cursor-pointer border border-amber-500/40"
              title="Portal Admin Jatibaraya"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-950" />
              <span>Portal Admin</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-emerald-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-medium transition-all ${
                    active
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                </button>
              );
            })}

            {/* Mobile Portal Admin Button */}
            <div className="pt-3 border-t border-slate-100">
              <button
                id="mobile-nav-admin-link"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold text-emerald-950 bg-amber-50 border border-amber-200/80 hover:bg-amber-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-800" />
                  <span>Portal Admin</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Color Identity Accent Line: Emerald (Ribbon), Sky Blue (Globe), Amber (Kujang), Ruby (Stars) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-600 via-sky-500 via-amber-500 to-rose-600 opacity-75" />
    </header>
  );
};
