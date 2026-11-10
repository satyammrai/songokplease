import React, { useEffect, useState, useCallback } from 'react';
import { HeroSection } from './components/HeroSection';
import { PlaylistSection } from './components/PlaylistSection';
import { MusicPlayer } from './components/MusicPlayer';
import { ShareModal } from './components/ShareModal';
import { QueueDrawer } from './components/QueueDrawer';
import { QueueFloatingCard } from './components/QueueFloatingCard';
import { TicketModal } from './components/TicketModal';
import { DriverProfileModal } from './components/DriverProfileModal';
import { AmbienceMixerModal } from './components/AmbienceMixerModal';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { RoleSelectModal } from './components/RoleSelectModal';
import { FLAGSHIP_COMMON_TRACK, PLAYLISTS, TRACKS, VEHICLE_WORLDS } from './data/musicData';
import { audioEngine } from './services/audioEngine';
import { Track, UserRoleMode, VehicleCategory } from './types';

export default function App() {
  // Journey Role: 'drive' (Want to Drive / Driver POV) vs 'ride' (Want to Ride / Passenger Mode)
  const [userRole, setUserRole] = useState<UserRoleMode>('ride');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Category state (Bus, Car, Bike)
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('bus');

  // Active playlist within category
  const [activePlaylistId, setActivePlaylistId] = useState<string>('bus-driver-special');

  // Currently loaded track: Default to the user's uploaded flagship road track!
  const [currentTrack, setCurrentTrack] = useState<Track | null>(FLAGSHIP_COMMON_TRACK);

  // Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(288);
  const [volume, setVolume] = useState<number>(0.85);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.16);
  const [isAmbienceActive, setIsAmbienceActive] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('one');

  // Dedicated Loop option to replay again and again as requested
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Horn tracking: Alternating between Horn 1 and Horn 2 "one by one"
  const [lastHornNumber, setLastHornNumber] = useState<1 | 2>(1);
  const [isHornHonking, setIsHornHonking] = useState<boolean>(false);

  // Playback queue
  const [queue, setQueue] = useState<Track[]>([]);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isAmbienceMixerOpen, setIsAmbienceMixerOpen] = useState<boolean>(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  // Track if user has scrolled past the main 100vh hero screen
  const [isScrolledPastHero, setIsScrolledPastHero] = useState<boolean>(false);

  // Filtered playlists and tracks for active category
  // User request: "bus and car playlist be same and byke would be somewhat diffrent"
  const isBusOrCar = activeCategory === 'bus' || activeCategory === 'car';
  const categoryPlaylists = isBusOrCar
    ? PLAYLISTS.filter((p) => p.category === 'bus')
    : PLAYLISTS.filter((p) => p.category === 'bike');
  const categoryTracks = isBusOrCar
    ? TRACKS.filter((t) => t.category === 'bus')
    : TRACKS.filter((t) => t.category === 'bike');
  const currentWorld = VEHICLE_WORLDS[activeCategory];

  // Initialize loop setting in audio engine
  useEffect(() => {
    audioEngine.setLoop(isLooping);
  }, [isLooping]);

  // Scroll listener for sticky floating dock when exploring playlists below
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize from URL parameters if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category') as VehicleCategory;
      const trackParam = params.get('track');
      const roleParam = params.get('mode') as UserRoleMode;

      if (roleParam && ['drive', 'ride'].includes(roleParam)) {
        setUserRole(roleParam);
      }

      if (catParam && ['bus', 'car', 'bike'].includes(catParam)) {
        setActiveCategory(catParam);
        const defaultPlaylist = VEHICLE_WORLDS[catParam].defaultPlaylistId;
        setActivePlaylistId(defaultPlaylist);

        if (trackParam) {
          const matchedTrack = TRACKS.find((t) => t.id === trackParam);
          if (matchedTrack) {
            setCurrentTrack(matchedTrack);
            return;
          }
        }
      }
    }
  }, []);

  // Sync callbacks with AudioEngine
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (curTime, dur) => {
        setCurrentTime(curTime);
        setDuration(dur);
      },
      onTrackEnded: () => {
        handleNextTrack();
      },
      onPlayStateChange: (playing) => {
        setIsPlaying(playing);
      },
    });
  }, [queue, currentTrack, activePlaylistId, activeCategory, repeatMode, isShuffle, isLooping]);

  // Handle Play a specific track
  const handlePlayTrack = useCallback(
    (track: Track) => {
      setCurrentTrack(track);
      if (track.category !== activeCategory) {
        setActiveCategory(track.category);
        setActivePlaylistId(track.playlistId);
      }
      audioEngine.setLoop(isLooping);
      audioEngine.playTrack(track, 0);
    },
    [activeCategory, isLooping]
  );

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    const track = currentTrack || FLAGSHIP_COMMON_TRACK;
    audioEngine.togglePlay(track);
  }, [currentTrack]);

  // Toggle Dedicated Loop Replay
  const handleToggleLoop = useCallback(() => {
    setIsLooping((prev) => {
      const next = !prev;
      audioEngine.setLoop(next);
      return next;
    });
  }, []);

  // Seekbar
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  // Next Track logic (respects loop option)
  const handleNextTrack = useCallback(() => {
    if (isLooping && currentTrack) {
      audioEngine.seek(0);
      audioEngine.playTrack(currentTrack, 0);
      return;
    }

    if (repeatMode === 'one' && currentTrack) {
      audioEngine.seek(0);
      audioEngine.playTrack(currentTrack, 0);
      return;
    }

    if (queue.length > 0) {
      const [nextTrack, ...remainingQueue] = queue;
      setQueue(remainingQueue);
      handlePlayTrack(nextTrack);
      return;
    }

    const tracksPool = categoryTracks;
    if (tracksPool.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracksPool.length);
      handlePlayTrack(tracksPool[randomIndex]);
      return;
    }

    const currentIndex = currentTrack
      ? tracksPool.findIndex((t) => t.id === currentTrack.id)
      : -1;
    const nextIndex = (currentIndex + 1) % tracksPool.length;
    handlePlayTrack(tracksPool[nextIndex]);
  }, [isLooping, repeatMode, queue, categoryTracks, currentTrack, isShuffle, handlePlayTrack]);

  // Previous Track logic
  const handlePreviousTrack = useCallback(() => {
    if (currentTime > 4) {
      handleSeek(0);
      return;
    }

    const tracksPool = categoryTracks;
    if (tracksPool.length === 0) return;

    const currentIndex = currentTrack
      ? tracksPool.findIndex((t) => t.id === currentTrack.id)
      : 0;
    const prevIndex = (currentIndex - 1 + tracksPool.length) % tracksPool.length;
    handlePlayTrack(tracksPool[prevIndex]);
  }, [currentTime, categoryTracks, currentTrack, handlePlayTrack]);

  // Category Switcher: 3 sections (BUS, CAR, BIKE)
  const handleSelectCategory = (category: VehicleCategory) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    const targetWorld = VEHICLE_WORLDS[category];
    const targetPlaylist =
      category === 'bus' || category === 'car'
        ? 'bus-driver-special'
        : targetWorld.defaultPlaylistId;
    setActivePlaylistId(targetPlaylist);

    if (category === 'bike') {
      const bikeTracks = TRACKS.filter((t) => t.category === 'bike');
      if (bikeTracks.length > 0) {
        setCurrentTrack(bikeTracks[0]);
        if (isPlaying) {
          audioEngine.playTrack(bikeTracks[0], 0);
        }
      }
    } else {
      setCurrentTrack(FLAGSHIP_COMMON_TRACK);
      if (isPlaying) {
        audioEngine.playTrack(FLAGSHIP_COMMON_TRACK, 0);
      }
    }
  };

  // Role Selection (Want to Drive vs Want to Ride)
  const handleSelectRole = (role: UserRoleMode) => {
    setUserRole(role);
    setIsRoleModalOpen(false);
  };

  // Add to Queue
  const handleAddToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  // Add Entire Selected Playlist to Queue
  const handleAddPlaylistToQueue = () => {
    const playlistTracks = categoryTracks.filter((t) => t.playlistId === activePlaylistId);
    const tracksToAdd =
      playlistTracks.length > 0
        ? [FLAGSHIP_COMMON_TRACK, ...playlistTracks]
        : [FLAGSHIP_COMMON_TRACK, ...categoryTracks];
    setQueue((prev) => [...prev, ...tracksToAdd]);
  };

  // Remove from Queue
  const handleRemoveFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  // Move Queue Item
  const handleMoveQueueItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= queue.length) return;
    setQueue((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  // Clear Queue
  const handleClearQueue = () => {
    setQueue([]);
  };

  // Vehicle Ambience Volume Change
  const handleAmbientVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    audioEngine.setAmbientVolume(vol);
  };

  // Toggle Ambience Mute
  const handleToggleAmbience = () => {
    const active = audioEngine.toggleAmbientMute();
    setIsAmbienceActive(active);
  };

  // Master Volume
  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  // Trigger Horn (Plays Horn 1 & Horn 2 "both one by one") and vibrates banner
  const handleTriggerHorn = useCallback((forceHorn?: 1 | 2): 1 | 2 => {
    const played = audioEngine.triggerVehicleHorn(activeCategory, forceHorn);
    setLastHornNumber(played);
    setIsHornHonking(true);
    setTimeout(() => {
      setIsHornHonking(false);
    }, 1400);
    return played;
  }, [activeCategory]);

  // Play Chai pour sound
  const handlePlayChai = () => {
    audioEngine.playChaiSound();
  };

  // Keyboard Shortcuts: Space (Play/Pause), H (Horn), L (Toggle Loop), T (Ticket/Share), Q (Queue), N (Next), P (Prev), ←/→ (Seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'h' || e.key === 'H') {
        handleTriggerHorn();
      } else if (e.key === 'l' || e.key === 'L') {
        handleToggleLoop();
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQueueOpen((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setIsTicketModalOpen((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        handleNextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        handlePreviousTrack();
      } else if (e.key === 'ArrowRight') {
        handleSeek(Math.min(duration, currentTime + 5));
      } else if (e.key === 'ArrowLeft') {
        handleSeek(Math.max(0, currentTime - 5));
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleAmbience();
      } else if (e.key === 'Escape') {
        setIsShareOpen(false);
        setIsTicketModalOpen(false);
        setIsDriverModalOpen(false);
        setIsQueueOpen(false);
        setIsAmbienceMixerOpen(false);
        setIsFullScreenOpen(false);
        setIsRoleModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleTogglePlay,
    handleTriggerHorn,
    handleToggleLoop,
    handleToggleAmbience,
    handleNextTrack,
    handlePreviousTrack,
    currentTime,
    duration,
  ]);

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#f5efe6] flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* 
        1. MAIN SCREEN: Exactly as shown in image_5327c80a.png and reference video
        Fits in 100vh single viewport without scrolling!
      */}
      <HeroSection
        world={currentWorld}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        userRole={userRole}
        onSelectRole={setUserRole}
        onOpenRoleModal={() => setIsDriverModalOpen(true)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isLooping={isLooping}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onToggleLoop={handleToggleLoop}
        onPrevious={handlePreviousTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onTriggerHorn={handleTriggerHorn}
        lastHornNumber={lastHornNumber}
        isHornHonking={isHornHonking}
        onPlayChai={handlePlayChai}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenShare={() => setIsTicketModalOpen(true)}
      />

      {/* 
        2. SCROLLABLE CONTENT: "then scroll for different things"
        Explore playlists, tracks, acoustic engine, and highway philosophy below the fold
      */}
      <main id="playlists-section" className="flex-1 pb-32 pt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Playlists & Tracks */}
        <PlaylistSection
          playlists={categoryPlaylists}
          tracks={TRACKS}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={(pId) => setActivePlaylistId(pId)}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isLooping={isLooping}
          onToggleLoop={handleToggleLoop}
          onPlayTrack={handlePlayTrack}
          onTogglePlay={handleTogglePlay}
          onAddToQueue={handleAddToQueue}
          activeCategory={activeCategory}
        />

        {/* Highway Road Culture & Acoustic Philosophy Banner */}
        <section className="py-8">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-black/80 border border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                ACOUSTIC REALISM & DUAL TRUCK HORNS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                Authentic Indian Musical Air Horns (Both 1 by 1)
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
                Featuring real recordings of the legendary Indian highway multi-tone air horns (Horn #1 & Horn #2).
                Press <kbd className="px-1.5 py-0.5 rounded bg-black border border-amber-500/40 text-amber-300 font-mono text-xs">H</kbd> or click the <em>हॉर्न ओके प्लीज़</em> button to cycle through both melodies one by one.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleTriggerHorn(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1e140d] hover:bg-[#2e1d13] border border-amber-500/40 text-amber-300 transition-all cursor-pointer shadow-md"
              >
                🎺 Test Horn #1
              </button>
              <button
                onClick={() => handleTriggerHorn(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1e140d] hover:bg-[#2e1d13] border border-amber-500/40 text-amber-300 transition-all cursor-pointer shadow-md"
              >
                🎺 Test Horn #2
              </button>
              <button
                onClick={() => setIsAmbienceMixerOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer"
              >
                Ambience Mixer
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 
        Sticky Floating Player: Visible when scrolled down into playlists
      */}
      {isScrolledPastHero && (
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          ambientVolume={ambientVolume}
          isAmbienceActive={isAmbienceActive}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          isLooping={isLooping}
          onToggleLoop={handleToggleLoop}
          activeCategory={activeCategory}
          onTogglePlay={handleTogglePlay}
          onPrevious={handlePreviousTrack}
          onNext={handleNextTrack}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onAmbientVolumeChange={handleAmbientVolumeChange}
          onToggleAmbience={handleToggleAmbience}
          onToggleShuffle={() => setIsShuffle((prev) => !prev)}
          onToggleRepeat={() =>
            setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
          }
          onTriggerHorn={() => handleTriggerHorn()}
          onOpenQueue={() => setIsQueueOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenAmbienceMixer={() => setIsAmbienceMixerOpen(true)}
          onToggleFullScreen={() => setIsFullScreenOpen(true)}
        />
      )}

      {/* Driver Profile Modal: "Who's driving?" (Frame 00:08) */}
      <DriverProfileModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onPlayChai={handlePlayChai}
        userRole={userRole}
        onSelectRole={handleSelectRole}
        activeCategory={activeCategory}
      />

      {/* Journey Mode Selector Modal: WANT TO DRIVE vs WANT TO RIDE */}
      <RoleSelectModal
        isOpen={isRoleModalOpen}
        onSelectRole={handleSelectRole}
        currentRole={userRole}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Bus Boarding Ticket Modal (Frame 00:11) */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        currentTrack={currentTrack}
        activeCategory={activeCategory}
      />

      {/* In-Place Floating Queue & Playlist Card (Frame 00:15) */}
      <QueueFloatingCard
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        playlists={PLAYLISTS}
        tracks={TRACKS}
        activePlaylistId={activePlaylistId}
        onSelectPlaylist={(pId) => setActivePlaylistId(pId)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayTrack={handlePlayTrack}
        onTogglePlay={handleTogglePlay}
        onOpenShare={() => setIsTicketModalOpen(true)}
        activeCategory={activeCategory}
      />

      {/* Sharing & QR Code Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        currentTrack={currentTrack}
        activeCategory={activeCategory}
      />

      {/* Vehicle Ambience Engine Mixer Modal */}
      <AmbienceMixerModal
        isOpen={isAmbienceMixerOpen}
        onClose={() => setIsAmbienceMixerOpen(false)}
        world={currentWorld}
        activeCategory={activeCategory}
        ambientVolume={ambientVolume}
        isAmbienceActive={isAmbienceActive}
        onAmbientVolumeChange={handleAmbientVolumeChange}
        onToggleAmbience={handleToggleAmbience}
        onTriggerHorn={() => handleTriggerHorn()}
      />

      {/* Fullscreen Driver Cockpit View */}
      <FullScreenPlayer
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        world={currentWorld}
        userRole={userRole}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isLooping={isLooping}
        onToggleLoop={handleToggleLoop}
        activeCategory={activeCategory}
        onTogglePlay={handleTogglePlay}
        onPrevious={handlePreviousTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onTriggerHorn={() => handleTriggerHorn()}
      />

      {/* Footer */}
      <footer className="border-t border-amber-950/30 bg-[#070504] py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-400">Safar Beats · बस ड्राइवर</span>
            <span>·</span>
            <span>Dedicated to Indian Bus Drivers, Highway Cruisers & Royal Enfield Riders</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono">
            <span>[Space] Play/Pause</span>
            <span>·</span>
            <span>[H] Horn 1 & 2</span>
            <span>·</span>
            <span>[L] Loop</span>
            <span>·</span>
            <span>[Q] Queue</span>
            <span>·</span>
            <span>[T] Ticket</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
