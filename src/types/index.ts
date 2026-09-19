export interface SiteSettings {
  name: string;
  fullName: string;
  slogan: string;
  motto: string;
  description: string;
  regions: string[];
  logoUrl: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  footerText: string;
  ctaText: string;
  ctaSubtext: string;
  updated_at: string;
}

export interface AboutContent {
  vision: string;
  missions: string[];
  characteristics: string[];
  functions: string[];
  updated_at: string;
}

export interface SymbolElement {
  id: string;
  name: string;
  meaning: string;
  elementColor: string;
  iconName: 'stars' | 'globe' | 'books' | 'kujang' | 'ribbon' | 'calligraphy';
}

export interface ProgramItem {
  id: string;
  title: string;
  schedule: string;
  description: string;
  details?: string;
  category: 'Spiritual' | 'Silaturahmi' | 'Pelayanan' | 'Dakwah' | 'Keilmuan' | 'Ekonomi' | 'Media' | 'Pembangunan';
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'penting';
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  caption: string;
  category: 'LOGO' | 'BERITA' | 'ARTIKEL' | 'PROGRAM' | 'DOKUMENTASI' | 'GALERI';
  imageUrl: string;
  date: string;
  created_at: string;
}

export interface OrganizationStats {
  wargaCount: string;    // Default: "—" (strictly no fake numbers)
  alumniCount: string;   // Default: "—"
  programCount: string;  // Default: "—"
  kegiatanCount: string; // Default: "—"
  referenceYear: string; // "2026"
  updated_at: string;
}

export interface ContactInfo {
  whatsapp: string;      // empty if not yet set by admin
  email: string;
  address: string;
  gmapsUrl?: string;
  updated_at: string;
}

export interface SocialMediaItem {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  name: string;
  handle: string;
  url: string;
  active: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin';
  lastLogin?: string;
}

export type AuditLogCategory =
  | 'auth'
  | 'settings'
  | 'program'
  | 'news'
  | 'article'
  | 'announcement'
  | 'media'
  | 'system'
  | 'backup';

export interface AuditLogItem {
  id: string;
  timestamp: string; // ISO String
  action: string;    // e.g. 'LOGIN', 'LOGOUT', 'UPDATE_PASSWORD', 'ADD_PROGRAM', 'UPDATE_SETTINGS', etc.
  category: AuditLogCategory;
  actor: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
  description: string;
  details?: string;
  deviceInfo?: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  createdAt: number;
  expiresAt: number;
  lastActive: number;
  credentialVersion?: number;
}

export interface AdminCredentialData {
  passwordHash: string;
  updatedAt: string;
  updatedBy?: string;
  version: number;
}

export interface JatibarayaDatabase {
  settings: SiteSettings;
  about: AboutContent;
  symbols: SymbolElement[];
  programs: ProgramItem[];
  news: NewsItem[];
  articles: ArticleItem[];
  announcements: AnnouncementItem[];
  media: MediaItem[];
  stats: OrganizationStats;
  contact: ContactInfo;
  socials: SocialMediaItem[];
}

