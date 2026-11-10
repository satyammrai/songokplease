import React from 'react';
import { X, Volume2, VolumeX, Sliders, Sparkles } from 'lucide-react';
import { VehicleCategory, VehicleWorldConfig } from '../types';

interface AmbienceMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  world: VehicleWorldConfig;
  activeCategory: VehicleCategory;
  ambientVolume: number;
  isAmbienceActive: boolean;
  onAmbientVolumeChange: (vol: number) => void;
  onToggleAmbience: () => void;
  onTriggerHorn: () => void;
}

export const AmbienceMixerModal: React.FC<AmbienceMixerModalProps> = ({
  isOpen,
  onClose,
  world,
  activeCategory,
  ambientVolume,
  isAmbienceActive,
  onAmbientVolumeChange,
  onToggleAmbience,
  onTriggerHorn,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#140e0b] border border-amber-500/30 shadow-2xl p-6 sm:p-7 text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>REAL ROAD ACOUSTICS ENGINE</span>
          </div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span>{world.name} Ambience Mixer</span>
            <span className="font-devanagari text-lg text-amber-400 font-normal">
              {world.nameHindi}
            </span>
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Blend authentic engine thrum, tire friction and road acoustics with the music stream.
          </p>
        </div>

        {/* Vehicle Acoustic Profile Card */}
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-300">
              Active Acoustic Profile:
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase">
              {world.badge}
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            {world.engineSoundDescription}
          </p>
        </div>

        {/* Ambient Volume Slider */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
              <span>Acoustic Blend Level</span>
              <span className="text-xs font-mono text-amber-400">
                ({isAmbienceActive ? `${Math.round(ambientVolume * 100)}%` : 'MUTED'})
              </span>
            </label>
            <button
              onClick={onToggleAmbience}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isAmbienceActive
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {isAmbienceActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ENABLED</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>DISABLED</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-stone-500 shrink-0" />
            <input
              type="range"
              min="0"
              max="0.45"
              step="0.01"
              value={ambientVolume}
              onChange={(e) => onAmbientVolumeChange(parseFloat(e.target.value))}
              disabled={!isAmbienceActive}
              className="flex-1 h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-30"
            />
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
          </div>

          <div className="flex justify-between text-[11px] text-stone-500">
            <span>Quiet (0%)</span>
            <span className="text-amber-400/80 font-medium">Recommended: 10–15% (Subtle Road Diesel Vibe)</span>
            <span>Prominent (45%)</span>
          </div>
        </div>

        {/* Vehicle Horn Test Button */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold text-amber-300">
              {world.hornName}
            </div>
            <div className="font-devanagari text-xs text-stone-400 mt-0.5">
              {world.hornNameHindi}
            </div>
          </div>
          <button
            onClick={onTriggerHorn}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span>🎺</span>
            <span>TEST HONK</span>
          </button>
        </div>

        {/* Presets / Done */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
          <button
            onClick={() => onAmbientVolumeChange(0.16)}
            className="text-xs text-stone-400 hover:text-amber-400 cursor-pointer"
          >
            Reset to Recommended (16%)
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-100 cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
