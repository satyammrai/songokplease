import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  ListMusic,
  Share2,
  Sparkles,
  Coffee,
  Radio,
  ChevronDown,
} from 'lucide-react';
import { Track, UserRoleMode, VehicleCategory, VehicleWorldConfig } from '../types';

interface HeroSectionProps {
  world: VehicleWorldConfig;
  activeCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
  userRole: UserRoleMode;
  onSelectRole: (role: UserRoleMode) => void;
  onOpenRoleModal: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  isLooping: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onToggleLoop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onTriggerHorn: (forceHorn?: 1 | 2) => 1 | 2;
  lastHornNumber: 1 | 2;
  isHornHonking?: boolean;
  onPlayChai: () => void;
  onOpenQueue: () => void;
  onOpenShare: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  world,
  activeCategory,
  onSelectCategory,
  userRole,
  onSelectRole,
  onOpenRoleModal,
  currentTrack,
  isPlaying,
  isLooping,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onToggleLoop,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onTriggerHorn,
  lastHornNumber,
  isHornHonking = false,
  onPlayChai,
  onOpenQueue,
  onOpenShare,
}) => {
  // Live digital clock: HH : MM SS
  const [timeString, setTimeString] = useState({ hours: '13', minutes: '11', seconds: '00' });
  const [colonVisible, setColonVisible] = useState(true);
  const [internalHornHonking, setInternalHornHonking] = useState(false);
  const [activeHornNum, setActiveHornNum] = useState<1 | 2>(lastHornNumber);
  const [chaiMessage, setChaiMessage] = useState<string | null>(null);
  const [catMessage, setCatMessage] = useState<string | null>(null);

  // Active vibration state combining prop and local click
  const activeHonk = isHornHonking || internalHornHonking;

  useEffect(() => {
    setActiveHornNum(lastHornNumber);
  }, [lastHornNumber]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString({
        hours: now.getHours().toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0'),
      });
      setColonVisible((prev) => !prev);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHornClick = () => {
    const hornPlayed = onTriggerHorn();
    setActiveHornNum(hornPlayed);
    setInternalHornHonking(true);
    setTimeout(() => setInternalHornHonking(false), 1400);
  };

  const handleChaiClick = () => {
    onPlayChai();
    setChaiMessage('☕ Cutting Chai served! +50 Driver Energy');
    setTimeout(() => setChaiMessage(null), 3000);
  };

  const handleCatClick = () => {
    onTriggerHorn();
    setCatMessage('Meow! Driver Billy says: "Horn bajao, side milega!" 🚌🐾');
    setTimeout(() => setCatMessage(null), 3500);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const scrollToPlaylists = () => {
    const el = document.getElementById('playlists-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-screen max-h-screen min-h-[660px] w-full relative flex flex-col justify-between overflow-hidden bg-[#0d0907] text-[#f5efe6] select-none">
      {/* Background Media with Rain Streaks matching the reference screenshot */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {activeCategory === 'bike' ? (
          /* Bike Video Loop (YouTube muted, only song & bus background voice) */
          <iframe
            src="https://www.youtube.com/embed/c7Dpmg-PI4c?autoplay=1&mute=1&loop=1&playlist=c7Dpmg-PI4c&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Bike Rider Endless Loop"
            className="w-[125%] h-[125%] -translate-x-[10%] -translate-y-[10%] max-w-none object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : activeCategory === 'car' ? (
          /* Car Video Loop (YouTube muted, only song & bus background voice) */
          <iframe
            src="https://www.youtube.com/embed/iuhXwVNdz4w?autoplay=1&mute=1&loop=1&playlist=iuhXwVNdz4w&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Car Cruiser Endless Loop"
            className="w-[125%] h-[125%] -translate-x-[10%] -translate-y-[10%] max-w-none object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : userRole === 'drive' ? (
          /* Bus: Want to Drive (YouTube POV highway loop muted) */
          <iframe
            src="https://www.youtube.com/embed/X8kzDBvSq6o?autoplay=1&mute=1&loop=1&playlist=X8kzDBvSq6o&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Endless Highway Driving Loop"
            className="w-[125%] h-[125%] -translate-x-[10%] -translate-y-[10%] max-w-none object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : (
          /* Bus: Want to Ride - The authentic painted bus traveling through scenic desert/highway */
          <video
            src="/assets/aistudio/road_5b022dc9.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Rain streaks overlay matching reference screenshot */}
        <div className="absolute inset-0 rain-overlay pointer-events-none opacity-45" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* TOP BAR: Recreated exactly like reference screenshot */}
      <header className="relative z-20 w-full px-4 sm:px-8 pt-5 sm:pt-6 flex items-center justify-between gap-4">
        {/* Top-Left: Yellow bus icon + Devanagari title + Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f59e0b] text-stone-950 flex items-center justify-center shadow-lg shadow-amber-950/50 shrink-0 font-bold border border-amber-300">
            <span className="text-xl">🚌</span>
          </div>
          <div>
            <div className="font-devanagari text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {world.heroHeadline}
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-stone-300 tracking-wider uppercase font-mono">
              NH 48 · DELHI — MUMBAI
            </div>
          </div>
        </div>

        {/* Center: Category & Role Switcher Pills */}
        <div className="hidden md:flex items-center gap-2">
          {/* Category Switcher */}
          <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-md border border-stone-800 text-xs font-bold">
            <button
              onClick={() => onSelectCategory('bus')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeCategory === 'bus' ? 'bg-[#f59e0b] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              BUS
            </button>
            <button
              onClick={() => onSelectCategory('car')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeCategory === 'car' ? 'bg-[#f59e0b] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              CAR
            </button>
            <button
              onClick={() => onSelectCategory('bike')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeCategory === 'bike' ? 'bg-[#f59e0b] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              BIKE
            </button>
          </div>

          {/* Drive vs Ride Mode */}
          <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-md border border-stone-800 text-xs font-bold">
            <button
              onClick={() => onSelectRole('drive')}
              title="Endless Highway POV Driver Video"
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                userRole === 'drive' ? 'bg-amber-500 text-black shadow-md' : 'text-stone-400 hover:text-white'
              }`}
            >
              🚗 DRIVE
            </button>
            <button
              onClick={() => onSelectRole('ride')}
              title="Scenic Road Passenger View"
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                userRole === 'ride' ? 'bg-amber-500 text-black shadow-md' : 'text-stone-400 hover:text-white'
              }`}
            >
              💺 RIDE
            </button>
          </div>
        </div>

        {/* Top-Right: Digital Clock & "Who's driving?" button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Digital Clock */}
          <div className="font-mono text-sm sm:text-base font-bold text-stone-200 tracking-wider flex items-center">
            <span>{timeString.hours}</span>
            <span className={`mx-0.5 ${colonVisible ? 'opacity-100' : 'opacity-20'}`}>:</span>
            <span>{timeString.minutes}</span>
            <span className="text-[11px] text-stone-400 ml-1.5 opacity-80">{timeString.seconds}</span>
          </div>

          {/* Who's driving? Button */}
          <button
            onClick={onOpenRoleModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#1e140d]/90 hover:bg-[#2c1d13] text-stone-200 hover:text-white border border-amber-900/40 text-xs font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-white/10"
          >
            <span className="text-base">🐱</span>
            <span className="hidden sm:inline">Who's driving?</span>
          </button>
        </div>
      </header>

      {/* CENTER STAGE: Central Vehicle Headline Banner + Action Buttons */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center my-auto flex flex-col items-center justify-center">
        {/* Kicker: 225 TRACKS · NON-STOP */}
        <div className="text-[11px] sm:text-xs font-bold text-stone-300 tracking-[0.25em] uppercase mb-1">
          225 TRACKS · NON-STOP
        </div>

        {/* Clean Grand Headline with Acoustic Horn Vibration */}
        <h1
          className={`font-devanagari text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] select-none my-1 transition-transform duration-100 ${
            activeHonk
              ? 'animate-horn-vibrate scale-[1.03] text-amber-100 drop-shadow-[0_0_45px_rgba(245,158,11,1)]'
              : ''
          }`}
        >
          {world.heroHeadline}
        </h1>

        {/* Center Road Subtitle: ALL NIGHT ON NH 48 */}
        <div className="text-[11px] sm:text-xs font-bold text-stone-300 tracking-[0.2em] uppercase font-mono mt-2 mb-4">
          ALL NIGHT ON NH 48
        </div>

        {/* The Two Prominent Interactive Buttons from the Screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
          {/* Button 1: HORN OK PLEASE (Plays Horn 1 & Horn 2 one by one) */}
          <button
            onClick={handleHornClick}
            className={`group flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer shadow-2xl border ${
              activeHonk
                ? 'bg-amber-500 text-stone-950 scale-105 border-amber-300 shadow-amber-500/50 ring-4 ring-amber-400/40'
                : 'bg-[#1b120c]/90 hover:bg-[#281b12] text-stone-100 hover:text-amber-300 border-amber-900/60 ring-1 ring-white/10'
            }`}
          >
            <span className="text-lg group-hover:scale-125 transition-transform">📢</span>
            <div className="text-left leading-tight">
              <div className="font-devanagari text-xs sm:text-sm font-black">
                हॉर्न ओके प्लीज़
              </div>
              <div className="text-[10px] tracking-wider text-amber-400 font-mono flex items-center gap-1">
                <span>HORN OK PLEASEEEE</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  #{activeHornNum}
                </span>
              </div>
            </div>
          </button>

          {/* Button 2: Chai for the driver */}
          <button
            onClick={handleChaiClick}
            className="flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold bg-[#f59e0b] hover:bg-[#fbbf24] text-stone-950 shadow-2xl transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
          >
            <Coffee className="w-4 h-4 fill-current" />
            <span>Chai for the driver</span>
          </button>
        </div>

        {/* Fun Chai / Billy Toasts */}
        {chaiMessage && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xl animate-bounce">
            {chaiMessage}
          </div>
        )}
        {catMessage && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xl animate-fade-in">
            {catMessage}
          </div>
        )}
      </div>

      {/* FLOATING DRIVER CAT MASCOT (Bottom Right of Viewport) */}
      <div className="absolute right-6 sm:right-10 bottom-24 sm:bottom-28 z-30">
        <button
          onClick={handleCatClick}
          title="Billy the Driver Cat - Click for Honk & Chai!"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#2d1b11] to-[#160c07] border-2 border-amber-500/60 p-1 shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-90 group"
        >
          {/* Driver Cat Avatar */}
          <div className="relative w-full h-full rounded-full overflow-hidden bg-amber-950/80 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl group-hover:rotate-12 transition-transform">
              🐱
            </span>
            <div className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </button>
      </div>

      {/* BOTTOM SECTION: Floating Player + Shortcuts Bar (All inside 100vh) */}
      <div className="relative z-20 w-full px-4 sm:px-6 pb-2">
        {/* Floating Player Dock: Recreated exactly from image_5327c80a.png */}
        <div className="max-w-4xl mx-auto rounded-full sm:rounded-3xl bg-[#22140b]/92 backdrop-blur-2xl border border-[#4a2e1b]/80 p-3 sm:px-6 shadow-2xl ring-1 ring-white/10 text-stone-200">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left Zone: Circular Vinyl Album Art + Track Info + Scrub Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Circular Vinyl Album Art */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg shrink-0 border-2 border-amber-500/40 bg-black">
                <img
                  src={currentTrack?.coverUrl || '/src/assets/images/bus_album_art_1794292434937.jpg'}
                  alt={currentTrack?.title || 'Album Art'}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-vinyl-spin' : ''}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full border-2 border-black/50 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-600 border border-white" />
              </div>

              {/* Title & Scrub Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 truncate">
                    <span className="text-xs sm:text-sm font-bold text-white truncate block">
                      {currentTrack?.title || 'Ek Mulaqat Zaruri Hai Sanam'}
                    </span>
                    <span className="text-[11px] text-stone-400 truncate block">
                      {currentTrack?.artist || 'Jashn-e-Adab · Alka Yagnik & Mohammad Aziz'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar with timestamps */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-stone-400 w-8 text-right tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <div
                    onClick={handleProgressBarClick}
                    className="relative flex-1 h-1.5 bg-stone-800 rounded-full cursor-pointer group"
                  >
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow scale-0 group-hover:scale-100 transition-transform"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-stone-400 w-8 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Zone: Controls matching screenshot */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Prev */}
              <button
                onClick={onPrevious}
                title="Previous Track (P)"
                className="p-2 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* White Play / Pause Circle */}
              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-stone-100 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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
                title="Next Track (N)"
                className="p-2 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Volume */}
              <button
                onClick={() => onVolumeChange(volume === 0 ? 0.85 : 0)}
                title="Volume"
                className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Loop Replay */}
              <button
                onClick={onToggleLoop}
                title={isLooping ? 'Loop is ON: Replaying track indefinitely' : 'Enable Loop Replay (L)'}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isLooping ? 'text-amber-400 bg-amber-950/60' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Repeat className={`w-4 h-4 ${isLooping ? 'animate-spin' : ''}`} />
              </button>

              {/* Queue */}
              <button
                onClick={onOpenQueue}
                title="Open Queue (Q)"
                className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <ListMusic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Strip: Exact matching from reference screenshot */}
        <div className="max-w-4xl mx-auto mt-2 flex flex-wrap items-center justify-between text-[10px] text-stone-400 px-2 py-1">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">Space</kbd>
              <span>PLAY / PAUSE</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">→</kbd>
              <span>SEEK</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">N</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">P</kbd>
              <span>TRACK</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">Q</kbd>
              <span>QUEUE</span>
            </span>
            <span className="hidden lg:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">T</kbd>
              <span>TICKET</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">H</kbd>
              <span>HORN</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300">L</kbd>
              <span>LOOP</span>
            </span>
          </div>

          {/* Scroll down prompt */}
          <button
            onClick={scrollToPlaylists}
            className="flex items-center gap-1 text-[10px] text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer font-sans font-semibold ml-auto"
          >
            <span>Scroll for Playlists</span>
            <ChevronDown className="w-3 h-3 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
