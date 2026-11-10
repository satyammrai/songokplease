import React, { useState } from 'react';
import { X, Play, Pause, Share2, Volume2 } from 'lucide-react';
import { Playlist, Track, VehicleCategory } from '../types';

interface QueueFloatingCardProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  tracks: Track[];
  activePlaylistId: string;
  onSelectPlaylist: (id: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onOpenShare: () => void;
  activeCategory: VehicleCategory;
}

export const QueueFloatingCard: React.FC<QueueFloatingCardProps> = ({
  isOpen,
  onClose,
  playlists,
  tracks,
  activePlaylistId,
  onSelectPlaylist,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  onOpenShare,
  activeCategory,
}) => {
  const [langHindi, setLangHindi] = useState(false);

  if (!isOpen) return null;

  const isBusOrCar = activeCategory === 'bus' || activeCategory === 'car';
  const currentCategoryPlaylists = isBusOrCar
    ? playlists.filter((p) => p.category === 'bus')
    : playlists.filter((p) => p.category === 'bike');
  const currentCategoryTracks = isBusOrCar
    ? tracks.filter((t) => t.category === 'bus')
    : tracks.filter((t) => t.category === 'bike');

  const playlistTracks = currentCategoryTracks.filter(
    (t) => t.playlistId === activePlaylistId
  );
  const rawTracks =
    playlistTracks.length > 0 ? playlistTracks : currentCategoryTracks;

  // In Bus & Car, the flagship road track is pinned at #1
  const displayTracks = isBusOrCar
    ? rawTracks.some((t) => t.id === 'flagship-truck-radio')
      ? rawTracks
      : rawTracks
    : rawTracks;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[82vh] rounded-3xl bg-[#1c120c]/95 border border-amber-900/60 shadow-2xl p-4 sm:p-6 text-stone-100 flex flex-col justify-between overflow-hidden backdrop-blur-xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with Tabs matching reference Frame 00:15 */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-800">
          {/* Scrollable Playlist Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {currentCategoryPlaylists.map((pl) => {
              const isSelected = pl.id === activePlaylistId;
              const shortTitle = pl.title
                .replace('Special', '')
                .replace('Hits', '')
                .replace('Collection', '')
                .trim()
                .toUpperCase();

              return (
                <button
                  key={pl.id}
                  onClick={() => onSelectPlaylist(pl.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                      : 'bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {shortTitle || pl.title}
                </button>
              );
            })}
          </div>

          {/* Right Header Controls: Counter & EN/HI toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-stone-400 font-bold hidden sm:inline">
              {displayTracks.length} TRACKS
            </span>

            <button
              onClick={() => setLangHindi(!langHindi)}
              className="px-2 py-0.5 rounded bg-stone-900 text-[10px] font-bold text-amber-400 border border-stone-800 hover:bg-stone-800 cursor-pointer"
            >
              {langHindi ? 'हि' : 'EN'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Tracklist matching reference Frame 00:15 */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-1.5 max-h-[50vh]">
          {displayTracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const trackNum = (idx + 1).toString().padStart(2, '0');

            return (
              <div
                key={track.id}
                onClick={() => {
                  if (isCurrent) {
                    onTogglePlay();
                  } else {
                    onPlayTrack(track);
                  }
                }}
                className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-amber-950/60 border-amber-500/50 text-white shadow-lg shadow-amber-950/50'
                    : 'hover:bg-stone-900/70 border-transparent text-stone-300 hover:text-white'
                }`}
              >
                {/* Track Number & Title */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span
                    className={`font-mono text-xs w-6 shrink-0 font-bold ${
                      isCurrent ? 'text-amber-400' : 'text-stone-500'
                    }`}
                  >
                    {trackNum}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs sm:text-sm font-bold truncate leading-tight ${
                        isCurrent ? 'text-amber-200' : 'text-stone-100'
                      }`}
                    >
                      {langHindi ? track.titleHindi || track.title : track.title}
                    </div>
                    <div className="text-[11px] text-stone-400 truncate mt-0.5">
                      {track.artist}
                    </div>
                  </div>
                </div>

                {/* Right: Audio Wave / Duration / Play status */}
                <div className="flex items-center gap-3 shrink-0">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-full bg-amber-400 animate-bounce" />
                      <span className="w-0.5 h-2 bg-amber-400 animate-pulse" />
                      <span className="w-0.5 h-3 bg-amber-400 animate-bounce" />
                    </div>
                  ) : (
                    <Play className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-stone-300 transition-opacity" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar matching reference Frame 00:15 */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenShare();
            }}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share the bus (busdriver.wtf)</span>
          </button>

          <span className="text-[10px] text-stone-500 font-mono">
            Press [Q] to close
          </span>
        </div>
      </div>
    </div>
  );
};
