import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  ExternalLink,
  Smartphone,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  ShareableItem,
  getShareUrl,
  formatBroadcastText,
  copyToClipboard,
  triggerNativeShare,
} from '../../utils/shareUtils';

interface ShareModalProps {
  item: ShareableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ item, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'text'>('quick');

  if (!isOpen || !item) return null;

  const shareUrl = getShareUrl(item);
  const broadcastText = formatBroadcastText(item, shareUrl);

  const typeLabelMap: Record<string, string> = {
    berita: 'Berita',
    artikel: 'Artikel',
    pengumuman: 'Pengumuman',
    program: 'Program Kerja',
  };
  const typeLabel = typeLabelMap[item.type] || 'Konten';

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyBroadcast = async () => {
    const success = await copyToClipboard(broadcastText);
    if (success) {
      setCopiedBroadcast(true);
      setTimeout(() => setCopiedBroadcast(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(broadcastText);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`*${item.title}*\n${item.summary || ''}`);
    const tgUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${item.title} - Paguyuban Santri Jatibaraya`);
    const twUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    await triggerNativeShare(item);
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
              Bagikan {typeLabel}
            </span>
            <h3 className="text-lg font-serif font-bold text-slate-900 leading-tight">
              Sebarkan Informasi Resmi
            </h3>
          </div>
        </div>

        {/* Item Preview Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
              {item.category || typeLabel}
            </span>
            {item.date && <span>• {item.date}</span>}
            {item.author && <span>• {item.author}</span>}
          </div>
          <h4 className="text-sm font-serif font-bold text-slate-900 line-clamp-2">
            {item.title}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2">
            {item.summary || item.content?.slice(0, 120)}
          </p>
        </div>

        {/* Tabs: Cepat / Teks Siap Kirim */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kanal Media & Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'text'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Teks Siap Forward (WA)</span>
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-4">
            {/* Direct WhatsApp Share Button (Highest Priority in Indonesia) */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm flex items-center justify-between transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20">
                  <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-white/90">Bagikan Langsung ke</div>
                  <div className="text-sm font-bold">WhatsApp / Chat Grup</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Social Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Telegram */}
              <button
                onClick={handleTelegramShare}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-slate-700 hover:text-sky-700 flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
                  <Send className="w-4 h-4" />
                </div>
                <span>Telegram</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Facebook className="w-4 h-4" />
                </div>
                <span>Facebook</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={handleTwitterShare}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                  <Twitter className="w-4 h-4" />
                </div>
                <span>Twitter / X</span>
              </button>

              {/* Native Mobile Share */}
              {hasNativeShare ? (
                <button
                  onClick={handleNativeShare}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span>Menu HP</span>
                </button>
              ) : (
                <button
                  onClick={handleCopyLink}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-800 flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                </button>
              )}
            </div>

            {/* Direct Copy Link Box */}
            <div className="pt-2">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Tautan Langsung ({typeLabel}):
              </label>
              <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-xs text-slate-700 font-mono focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Tab: Teks Broadcast Format */
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800 selection:bg-amber-400 selection:text-slate-900">
              {broadcastText}
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Format rapi dengan judul, ringkasan, dan tautan langsung.
              </span>
              <button
                onClick={handleCopyBroadcast}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copiedBroadcast
                    ? 'bg-emerald-800 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                {copiedBroadcast ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Teks Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Link langsung mengarah ke halaman bacaan ini</span>
          </span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
