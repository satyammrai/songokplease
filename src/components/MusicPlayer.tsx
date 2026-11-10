import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  ListMusic,
  Share2,
  Sliders,
} from 'lucide-react';
import { Track, VehicleCategory } from '../types';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  ambientVolume: number;
  isAmbienceActive: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isLooping: boolean;
  onToggleLoop: () => void;
  activeCategory: VehicleCategory;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onAmbientVolumeChange: (vol: number) => void;
  onToggleAmbience: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onTriggerHorn: () => void;
  onOpenQueue: () => void;
  onOpenShare: () => void;
  onOpenAmbienceMixer: () => void;
  onToggleFullScreen: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  ambientVolume,
  isAmbienceActive,
  isShuffle,
  repeatMode,
  isLooping,
  onToggleLoop,
  activeCategory,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onAmbientVolumeChange,
  onToggleAmbience,
  onToggleShuffle,
  onToggleRepeat,
  onTriggerHorn,
  onOpenQueue,
  onOpenShare,
  onOpenAmbienceMixer,
  onToggleFullScreen,
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-40 max-w-6xl mx-auto">
      <div className="relative rounded-2xl bg-black/85 backdrop-blur-2xl border border-amber-900/40 p-3 sm:p-4 shadow-2xl ring-1 ring-white/10 text-stone-200">
        <div className="flex flex-col gap-2">
          {/* Main Controls Row */}
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left Zone: Track Artwork & Metadata */}
            <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-xs shrink-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shrink-0 border border-amber-500/30 bg-stone-900">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-vinyl-spin' : ''}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full border border-black/40 pointer-events-none" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {activeCategory}
                  </span>
                  <span className="text-xs font-semibold text-stone-100 truncate">
                    {currentTrack.title}
                  </span>
                </div>
                <div className="font-devanagari text-[11px] text-amber-400/90 truncate">
                  {currentTrack.titleHindi}
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  {currentTrack.artist}
                </div>
              </div>
            </div>

            {/* Center Zone: Transport Buttons & Dedicated Loop Button */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Shuffle */}
              <button
                onClick={onToggleShuffle}
                title="Shuffle"
                className={`p-2 rounded-xl transition-colors cursor-pointer hidden sm:block ${
                  isShuffle ? 'text-amber-400 bg-amber-950/40' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={onPrevious}
                title="Previous Track"
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-lg shadow-amber-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                title="Next Track"
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              {/* Dedicated Loop Replay Button */}
              <button
                onClick={onToggleLoop}
                title={isLooping ? 'Loop is ON: Replay again and again' : 'Replay again and again'}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  isLooping
                    ? 'text-stone-950 bg-amber-400 font-bold shadow-md shadow-amber-950/40'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Repeat className={`w-4 h-4 ${isLooping ? 'animate-spin' : ''}`} />
                <span className="text-[10px] hidden md:inline font-bold">
                  {isLooping ? 'LOOP ON' : 'LOOP'}
                </span>
              </button>
            </div>

            {/* Right Zone: Vehicle Ambience, Honk, Volume & Utilities */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Quick Horn Honk */}
              <button
                onClick={onTriggerHorn}
                title="Honk Vehicle Horn"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-900 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>🎺</span>
                <span className="text-[10px] font-bold hidden md:inline">HONK</span>
              </button>

              {/* Vehicle Ambience Sound Control */}
              <div className="relative">
                <button
                  onClick={onOpenAmbienceMixer}
                  title="Vehicle Engine Acoustics"
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAmbienceActive
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                      : 'bg-stone-900 border-stone-800 text-stone-500'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span className="text-[10px] font-mono hidden lg:inline">
                    {Math.round(ambientVolume * 100)}%
                  </span>
                </button>
              </div>

              {/* Master Volume */}
              <div className="hidden md:flex items-center gap-1.5 bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-stone-800">
                <button
                  onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Share Button */}
              <button
                onClick={onOpenShare}
                title="Share & QR Code"
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer hidden sm:block"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Queue Button */}
              <button
                onClick={onOpenQueue}
                title="Playback Queue"
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <ListMusic className="w-4 h-4" />
              </button>

              {/* FullScreen Mode Button */}
              <button
                onClick={onToggleFullScreen}
                title="Fullscreen Driver Cockpit"
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer hidden sm:block"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrubbable Seek Bar */}
          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-[11px] text-stone-400 w-9 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>

            <div
              onClick={handleProgressBarClick}
              onMouseMove={handleProgressMouseMove}
              onMouseLeave={() => setHoverSeekTime(null)}
              className="relative flex-1 h-2 bg-stone-800 rounded-full cursor-pointer group"
            >
              {/* Played Bar */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Handle thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-amber-600 scale-0 group-hover:scale-100 transition-transform"
                style={{ left: `${progressPercent}%` }}
              />

              {/* Hover tooltip */}
              {hoverSeekTime !== null && (
                <div
                  className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/90 text-amber-300 text-[10px] font-mono border border-amber-500/30 pointer-events-none"
                  style={{ left: `${(hoverSeekTime / duration) * 100}%` }}
                >
                  {formatTime(hoverSeekTime)}
                </div>
              )}
            </div>

            <span className="font-mono text-[11px] text-stone-400 w-9 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
