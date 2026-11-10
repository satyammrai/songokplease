import React, { useState, useEffect } from 'react';
import { X, Check, Share2, Copy } from 'lucide-react';
import { Track, VehicleCategory } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  activeCategory: VehicleCategory;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  activeCategory,
}) => {
  const [isPrinting, setIsPrinting] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsPrinting(true);
      const timer = setTimeout(() => setIsPrinting(false), 650);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareUrl = `${currentUrl}?category=${activeCategory}${currentTrack ? `&track=${currentTrack.id}` : ''}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bus Ticket: ${currentTrack?.title || 'Safar Beats'}`,
          text: `Here is your boarding ticket for the Delhi-Mumbai bus listening to "${currentTrack?.title}" on Safar Beats! 🚌🎫`,
          url: shareUrl,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center max-w-xs w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {isPrinting ? (
          /* Printing State matching reference Frame 00:10 */
          <div className="py-20 text-center animate-pulse">
            <div className="text-sm font-mono tracking-[0.3em] font-black text-stone-200 uppercase">
              PRINTING...
            </div>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full animate-bounce" />
          </div>
        ) : (
          /* Ticket Boarding Pass Card matching reference Frame 00:11 */
          <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* The Ticket Slip */}
            <div className="w-full bg-[#f4ece1] text-[#1c130d] rounded-3xl p-5 shadow-2xl border border-amber-900/30 relative overflow-hidden">
              {/* Subtle perforated side notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/85" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/85" />

              {/* Ticket Header */}
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-stone-300">
                <div className="w-6 h-6 rounded-full bg-[#f59e0b] text-black font-bold flex items-center justify-center text-xs">
                  🚌
                </div>
                <div className="leading-tight">
                  <div className="font-black text-xs uppercase tracking-tight text-stone-900 font-mono">
                    {activeCategory === 'bus' ? 'BUS DRIVER' : activeCategory === 'car' ? 'CAR DRIVER' : 'BIKE RIDER'}
                  </div>
                  <div className="text-[9px] text-stone-500 font-mono font-bold">
                    NH 48 · Delhi — Mumbai
                  </div>
                </div>
              </div>

              {/* Playlist Pill Badge */}
              <div className="text-[10px] font-bold text-amber-800 bg-amber-500/20 px-2 py-0.5 rounded-full inline-block mb-3 font-mono">
                90s Bus Driver Playlist
              </div>

              {/* Track Title */}
              <div className="my-2">
                <div className="text-base font-black text-stone-950 leading-snug line-clamp-2">
                  {currentTrack?.title || 'Ek Mulaqat Zaruri Hai Sanam'}
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 font-medium">
                  {currentTrack?.artist || 'Alka Yagnik & Mohammad Aziz'}
                </div>
              </div>

              {/* Journey Details Grid */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-dashed border-stone-300 my-3 text-center font-mono">
                <div>
                  <div className="text-[9px] text-stone-500 uppercase">SEAT</div>
                  <div className="text-sm font-black text-stone-900">7C</div>
                </div>
                <div>
                  <div className="text-[9px] text-stone-500 uppercase">CLASS</div>
                  <div className="text-sm font-black text-stone-900">Aisle</div>
                </div>
                <div>
                  <div className="text-[9px] text-stone-500 uppercase">DEPART</div>
                  <div className="text-sm font-black text-stone-900">21:30</div>
                </div>
              </div>

              {/* Barcode Strip */}
              <div className="flex flex-col items-center pt-1">
                <div className="flex items-center justify-center gap-0.5 h-9 w-full px-2 opacity-85">
                  {[3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2, 1, 4].map((w, i) => (
                    <div
                      key={i}
                      className="bg-stone-950 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <div className="text-[8px] font-mono tracking-widest text-stone-600 mt-1">
                  * NH48-DEL-BOM-BUS-90S *
                </div>
              </div>
            </div>

            {/* Action Buttons matching reference Frame 00:11 */}
            <div className="w-full mt-4 space-y-2">
              <button
                onClick={handleShare}
                className="w-full py-3 px-5 rounded-full font-bold text-xs bg-white hover:bg-stone-100 text-stone-950 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Ticket Link Copied!' : 'Share your ticket'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-5 rounded-full font-semibold text-xs text-stone-400 hover:text-white bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              >
                Not now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
