import React from 'react';
import { X, Coffee, Instagram, ExternalLink, Navigation } from 'lucide-react';
import { UserRoleMode, VehicleCategory } from '../types';

interface DriverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayChai: () => void;
  userRole: UserRoleMode;
  onSelectRole: (role: UserRoleMode) => void;
  activeCategory: VehicleCategory;
}

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({
  isOpen,
  onClose,
  onPlayChai,
  userRole,
  onSelectRole,
  activeCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#1e1510]/95 border border-amber-500/30 p-6 sm:p-7 text-stone-100 shadow-2xl overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Driver Avatar matching reference video (Frame 00:08) */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-xl mb-3 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#2a1b12] flex items-center justify-center text-4xl shadow-inner">
              🐱
            </div>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
            <span>Rajat</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              DRIVER
            </span>
          </h3>

          <p className="text-xs text-stone-300 mt-1 max-w-[260px] leading-relaxed">
            I drive this bus. I pick every song on it.
          </p>

          {/* Follow Instagram Button */}
          <a
            href="https://instagram.com/rajatdas.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-4 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-lg hover:opacity-95 transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow rajatdas.me</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          <p className="text-[11px] text-stone-400 mt-3">
            New songs join the bus most weeks.
          </p>

          {/* Buy the driver a chai button */}
          <button
            onClick={() => {
              onPlayChai();
              onClose();
            }}
            className="w-full mt-3 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#fbbf24] text-stone-950 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-amber-300"
          >
            <Coffee className="w-4 h-4 fill-current" />
            <span>Buy the driver a chai</span>
          </button>

          {/* Driver Journey Role Selector (Preserving User's Feature!) */}
          <div className="w-full mt-5 pt-4 border-t border-amber-900/40">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
              JOURNEY EXPERIENCE MODE
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectRole('drive')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userRole === 'drive'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
                }`}
              >
                <span>🚗 Driver POV</span>
              </button>
              <button
                onClick={() => onSelectRole('ride')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userRole === 'ride'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
                }`}
              >
                <span>💺 Passenger</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
