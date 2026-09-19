export interface ShareableItem {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category?: string;
  author?: string;
  date?: string;
  type: 'berita' | 'artikel' | 'pengumuman' | 'program';
  imageUrl?: string;
}

/**
 * Generate shareable URL with hash routing deep-link
 */
export function getShareUrl(item: { id: string; type: 'berita' | 'artikel' | 'pengumuman' | 'program' }): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const pathname = window.location.pathname.replace(/\/+$/, '');
  
  if (item.type === 'program') {
    return `${origin}${pathname}#program?id=${encodeURIComponent(item.id)}`;
  }
  return `${origin}${pathname}#informasi?tipe=${item.type}&id=${encodeURIComponent(item.id)}`;
}

/**
 * Generate formatted text for WhatsApp / Chat broadcasting
 */
export function formatBroadcastText(item: ShareableItem, shareUrl?: string): string {
  const url = shareUrl || getShareUrl(item);
  const typeHeaders: Record<string, string> = {
    berita: '📰 *BERITA RESMI JATIBARAYA*',
    artikel: '✍️ *ARTIKEL SANTRI PRIANGAN*',
    pengumuman: '📢 *PENGUMUMAN RESMI JATIBARAYA*',
    program: '📌 *AGENDA PROGRAM KERJA JATIBARAYA*',
  };

  const header = typeHeaders[item.type] || '📄 *PUBLIKASI JATIBARAYA*';
  const categoryStr = item.category ? `🏷️ *Kategori:* ${item.category}\n` : '';
  const dateStr = item.date ? `📅 *Tanggal:* ${item.date}\n` : '';
  const authorStr = item.author ? `👤 *Oleh:* ${item.author}\n` : '';

  const summary = item.summary || (item.content ? item.content.slice(0, 180) + '...' : '');

  return `${header}
*${item.title.trim()}*
${categoryStr}${dateStr}${authorStr}
"${summary.trim()}"

🔗 *Baca selengkapnya di web:*
${url}

_Paguyuban Santri Priangan Jawa Barat (JATIBARAYA)_`;
}

/**
 * Copy text to clipboard with fallback for iframes
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback using textarea execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('Gagal menyalin teks ke clipboard:', err);
    return false;
  }
}

/**
 * Open native share if available (Mobile browsers)
 */
export async function triggerNativeShare(item: ShareableItem): Promise<boolean> {
  const url = getShareUrl(item);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: item.title,
        text: `${item.title} - Paguyuban Santri Priangan Jatibaraya`,
        url,
      });
      return true;
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('Native share failed:', e);
      }
      return false;
    }
  }
  return false;
}
