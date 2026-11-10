import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Share2, Smartphone, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import { Track, VehicleCategory } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  activeCategory: VehicleCategory;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  activeCategory,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Construct sharing link
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareUrl = `${currentUrl}?category=${activeCategory}${currentTrack ? `&track=${currentTrack.id}` : ''}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(
        shareUrl,
        {
          width: 260,
          margin: 1.5,
          color: {
            dark: '#1c130d',
            light: '#fde68a',
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Safar Beats - ${currentTrack?.title || 'Vehicle Music Worlds'}`,
          text: `Listening to ${currentTrack?.title || 'Road Beats'} on Safar Beats (${activeCategory.toUpperCase()})! 🛣️🎵`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(
    `Listen to ${currentTrack?.title || 'Road Beats'} on Safar Beats (${activeCategory.toUpperCase()})! 🛣️🎵 ${shareUrl}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl p-6 text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>INSTANT MOBILE PLAYBACK</span>
          </div>
          <h3 className="text-xl font-bold">Scan & Drive</h3>
          <p className="text-xs text-stone-400 mt-1">
            Scan this QR code with your phone camera to stream in your car, bus or on your bike.
          </p>
        </div>

        {/* QR Code Presentation Card */}
        <div className="p-4 rounded-2xl bg-black/50 border border-stone-800 flex flex-col items-center justify-center text-center mb-6">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-xl mb-3 border border-amber-400/50">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Safar Beats QR Code"
                className="w-48 h-48 rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-stone-700 text-xs font-mono">
                Generating QR...
              </div>
            )}
          </div>

          {currentTrack && (
            <div className="w-full">
              <div className="text-xs font-semibold text-stone-200 truncate">
                {currentTrack.title}
              </div>
              <div className="font-devanagari text-[11px] text-amber-400 truncate">
                {currentTrack.titleHindi} · {currentTrack.artistHindi}
              </div>
            </div>
          )}
        </div>

        {/* Share Link & Copy Action */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950 border border-stone-800 mb-4">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-2 text-xs text-stone-300 outline-none truncate font-mono"
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Social Sharing Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors text-center"
          >
            <span>WhatsApp</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Native Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
