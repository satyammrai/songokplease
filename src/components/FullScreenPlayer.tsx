import React from 'react';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Volume2, Radio, Compass, Repeat } from 'lucide-react';
import { Track, UserRoleMode, VehicleCategory, VehicleWorldConfig } from '../types';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  world: VehicleWorldConfig;
  userRole?: UserRoleMode;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping?: boolean;
  onToggleLoop?: () => void;
  activeCategory: VehicleCategory;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onTriggerHorn: () => void;
}

export const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  isOpen,
  onClose,
  world,
  userRole = 'drive',
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isLooping = false,
  onToggleLoop,
  activeCategory,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onTriggerHorn,
}) => {
  if (!isOpen || !currentTrack) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-[#070504] flex flex-col justify-between text-stone-100 overflow-hidden animate-in fade-in duration-300">
      {/* Background Media with Dark Scrim */}
      <div className="absolute inset-0 pointer-events-none opacity-45 z-0">
        {activeCategory === 'bike' ? (
          <iframe
            src="https://www.youtube.com/embed/c7Dpmg-PI4c?autoplay=1&mute=1&loop=1&playlist=c7Dpmg-PI4c&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Bike Highway Loop"
            className="w-[120%] h-[120%] object-cover scale-105 pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : activeCategory === 'car' ? (
          <iframe
            src="https://www.youtube.com/embed/iuhXwVNdz4w?autoplay=1&mute=1&loop=1&playlist=iuhXwVNdz4w&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Car Highway Loop"
            className="w-[120%] h-[120%] object-cover scale-105 pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : userRole === 'drive' ? (
          <iframe
            src="https://www.youtube.com/embed/X8kzDBvSq6o?autoplay=1&mute=1&loop=1&playlist=X8kzDBvSq6o&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Driver Highway Loop"
            className="w-[120%] h-[120%] object-cover scale-105 pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video
            src="/assets/aistudio/road_5b022dc9.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070504] via-[#070504]/75 to-[#070504]/90" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <span>{userRole === 'drive' ? 'DRIVER POV COCKPIT' : `${world.badge} PASSENGER RIDE`}</span>
              {isLooping && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                  LOOP REPLAY ACTIVE
                </span>
              )}
            </div>
            <div className="text-xs text-stone-400">HQ 320 KBPS · PURE CASSETTE AUDIO</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
          title="Exit Fullscreen"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center Showcase: Devanagari Headline, Vinyl Cover & Lyrics */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center my-auto">
        <div className="font-devanagari text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#fff7ed] via-[#fcd34d] to-[#b45309] drop-shadow-2xl mb-4 select-none">
          {world.heroHeadline}
        </div>

        {/* Rotating Vinyl Cover */}
        <div className="relative w-44 h-44 sm:w-64 sm:h-64 mx-auto my-6 rounded-full overflow-hidden shadow-2xl border-4 border-amber-500/30 group">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover ${isPlaying ? 'animate-vinyl-spin' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full border-8 border-black/40 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border-2 border-amber-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-2">
          {currentTrack.title}
        </h2>
        <div className="font-devanagari text-lg sm:text-xl text-amber-400 mt-1 font-semibold">
          {currentTrack.titleHindi} · {currentTrack.artistHindi}
        </div>
        <p className="text-sm text-stone-400 mt-1">{currentTrack.artist}</p>

        {/* Lyrics Snippet */}
        {currentTrack.lyricsPreviewHindi && (
          <div className="mt-4 p-4 rounded-2xl bg-black/55 border border-amber-500/25 max-w-xl mx-auto backdrop-blur-md">
            <p className="font-devanagari text-sm sm:text-base text-amber-200/90 italic">
              "{currentTrack.lyricsPreviewHindi}"
            </p>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 max-w-3xl w-full mx-auto p-6">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-stone-400 w-10 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>

          <div
            onClick={handleProgressBarClick}
            className="relative flex-1 h-2.5 bg-stone-800 rounded-full cursor-pointer group"
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="font-mono text-xs text-stone-400 w-10 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onTriggerHorn}
            className="p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <span>🎺</span>
            <span>HONK</span>
          </button>

          {onToggleLoop && (
            <button
              onClick={onToggleLoop}
              title="Toggle Loop Replay"
              className={`p-3 rounded-2xl border text-sm font-bold flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                isLooping
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-950/50'
                  : 'bg-stone-900/80 text-stone-300 border-stone-800'
              }`}
            >
              <Repeat className={`w-4 h-4 ${isLooping ? 'animate-spin' : ''}`} />
              <span>{isLooping ? 'LOOP ON' : 'LOOP'}</span>
            </button>
          )}

          <button
            onClick={onPrevious}
            className="p-3 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-3 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
