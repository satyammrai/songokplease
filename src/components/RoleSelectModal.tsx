import React from 'react';
import { Navigation, Sparkles, Volume2, Check } from 'lucide-react';
import { UserRoleMode } from '../types';

interface RoleSelectModalProps {
  isOpen: boolean;
  onSelectRole: (role: UserRoleMode) => void;
  currentRole: UserRoleMode;
  onClose?: () => void;
}

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onSelectRole,
  currentRole,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#140e0b] border border-amber-500/30 shadow-2xl p-6 sm:p-8 text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amber top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold border border-amber-500/25 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SAFAR BEATS · EXPERIENCE SELECTOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-100">
            How Do You Want to Journey?
          </h2>
          <div className="font-devanagari text-base sm:text-lg text-amber-400 mt-1">
            आप सफर कैसे तय करना चाहते हैं?
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-md mx-auto">
            Choose your journey mode. You can switch between driving and riding at any time.
          </p>
        </div>

        {/* The Two Primary Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option 1: WANT TO DRIVE */}
          <button
            onClick={() => onSelectRole('drive')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
              currentRole === 'drive'
                ? 'bg-gradient-to-b from-amber-950/70 to-stone-900 border-amber-500 shadow-xl shadow-amber-950/50 ring-2 ring-amber-500/40'
                : 'bg-stone-900/70 hover:bg-stone-900 border-stone-800 hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🚗</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  POV DRIVER
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                WANT TO DRIVE
              </h3>
              <div className="font-devanagari text-xs text-amber-400 font-semibold mt-0.5">
                ड्राइव करना चाहते हैं
              </div>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Take the driver's seat. Experience the endless highway driving animation in full POV loop. YouTube audio is muted so you only hear the pure cassette road songs.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Select Driver Mode</span>
              {currentRole === 'drive' && <Check className="w-4 h-4 text-emerald-400" />}
            </div>
          </button>

          {/* Option 2: WANT TO RIDE */}
          <button
            onClick={() => onSelectRole('ride')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
              currentRole === 'ride'
                ? 'bg-gradient-to-b from-amber-950/70 to-stone-900 border-amber-500 shadow-xl shadow-amber-950/50 ring-2 ring-amber-500/40'
                : 'bg-stone-900/70 hover:bg-stone-900 border-stone-800 hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">💺</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  PASSENGER
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                WANT TO RIDE
              </h3>
              <div className="font-devanagari text-xs text-amber-400 font-semibold mt-0.5">
                सवारी करना चाहते हैं
              </div>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Sit back and relax as a passenger. Watch the iconic painted bus cruise through the desert and hills while classic road hits play on the bus radio.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-semibold text-stone-400">
              <span>Select Passenger Mode</span>
              {currentRole === 'ride' && <Check className="w-4 h-4 text-emerald-400" />}
            </div>
          </button>
        </div>

        {/* Audio Note */}
        <div className="p-3 rounded-xl bg-black/40 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-400 mb-6">
          <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Featured Song: <strong className="text-amber-300">Bahot Jatate Ho Chaha Humse (बहुत जताते हो चाह हमसे)</strong> will stream across all vehicle playlists with loop repeat support.
          </span>
        </div>

        {/* Submit / Continue Button */}
        <div className="flex items-center justify-end gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
            >
              Skip
            </button>
          )}
          <button
            onClick={() => onSelectRole(currentRole)}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/50 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            CONTINUE JOURNEY · आगे बढ़ें
          </button>
        </div>
      </div>
    </div>
  );
};
