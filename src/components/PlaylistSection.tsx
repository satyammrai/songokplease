import React, { useState } from 'react';
import { Play, Pause, Plus, Check, Music2, Clock, Sparkles } from 'lucide-react';
import { Playlist, Track, VehicleCategory } from '../types';

import { FLAGSHIP_COMMON_TRACK } from '../data/musicData';

interface PlaylistSectionProps {
  playlists: Playlist[];
  tracks: Track[];
  activePlaylistId: string;
  onSelectPlaylist: (playlistId: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  isLooping: boolean;
  onToggleLoop: () => void;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onAddToQueue: (track: Track) => void;
  activeCategory: VehicleCategory;
}

export const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  playlists,
  tracks,
  activePlaylistId,
  onSelectPlaylist,
  currentTrack,
  isPlaying,
  isLooping,
  onToggleLoop,
  onPlayTrack,
  onTogglePlay,
  onAddToQueue,
  activeCategory,
}) => {
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);

  const selectedPlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0];
  const playlistTracks = tracks.filter((t) => t.playlistId === activePlaylistId);

  const isBusOrCar = activeCategory === 'bus' || activeCategory === 'car';

  // Bus & Car share the same playlist collection; Bike has its own distinct collection
  const rawTracks =
    playlistTracks.length > 0
      ? playlistTracks
      : tracks.filter((t) => (isBusOrCar ? t.category === 'bus' : t.category === 'bike'));

  // Curated tracks for active playlist: Bus/Car or Bike
  const displayTracks = rawTracks;

  const handleQueueClick = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => setAddedTrackId(null), 1500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURATED ROAD COLLECTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 mt-1 flex items-center gap-3">
            <span>Playlists & Road Tracks</span>
            <span className="font-devanagari text-xl font-normal text-amber-400/80">
              प्लेलिस्ट संग्रह
            </span>
          </h2>
        </div>
        <p className="text-sm text-stone-400 max-w-md">
          Selected driving soundtracks tuned specifically for the acoustics and cadence of your{' '}
          <strong className="text-stone-200 capitalize">{activeCategory}</strong> journey.
        </p>
      </div>

      {/* 7 Vehicle Playlists Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 mb-10">
        {playlists.map((playlist) => {
          const isSelected = playlist.id === activePlaylistId;
          return (
            <button
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist.id)}
              className={`text-left p-3 rounded-2xl transition-all duration-200 flex flex-col justify-between group cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-950/60 to-stone-900 border-amber-500/50 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/30'
                  : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-stone-950 shadow-md">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {playlist.badge}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-medium text-stone-300 bg-black/60 px-1.5 py-0.5 rounded">
                  {playlist.trackCount} Tracks
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                  {playlist.title}
                </h3>
                <div className="font-devanagari text-[11px] text-amber-400/90 line-clamp-1 mt-0.5">
                  {playlist.titleHindi}
                </div>
                <div className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                  {playlist.mood}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Playlist Detailed Banner & Tracklist */}
      <div className="rounded-3xl bg-stone-900/70 border border-stone-800 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Banner Details */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-stone-800/80 bg-gradient-to-r from-amber-950/30 via-transparent to-transparent">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-amber-500/20">
            <img
              src={selectedPlaylist.coverUrl}
              alt={selectedPlaylist.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PLAYLIST · {selectedPlaylist.badge}
              </span>
              <span className="text-xs text-stone-400">
                {displayTracks.length} tracks · approx.{' '}
                {Math.round(
                  displayTracks.reduce((acc, t) => acc + t.duration, 0) / 60
                )}{' '}
                min
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
              {selectedPlaylist.title}
            </h3>
            <div className="font-devanagari text-lg text-amber-400 font-medium mt-0.5">
              {selectedPlaylist.titleHindi}
            </div>

            <p className="text-sm text-stone-300 mt-2 max-w-xl">
              {selectedPlaylist.description}
            </p>
            <p className="font-devanagari text-xs text-stone-400 mt-1">
              {selectedPlaylist.descriptionHindi}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  if (displayTracks.length > 0) {
                    onPlayTrack(displayTracks[0]);
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-950/50 transition-all hover:scale-102 active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY PLAYLIST</span>
              </button>

              <button
                onClick={() => {
                  displayTracks.forEach((t) => onAddToQueue(t));
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-white border border-stone-700 transition-all cursor-pointer text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>ADD ALL TO QUEUE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tracks Table */}
        <div className="p-4 sm:p-6">
          <div className="space-y-1.5">
            {displayTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isAdded = addedTrackId === track.id;

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
                  className={`group flex items-center justify-between gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500/40 text-stone-100 shadow-md'
                      : 'hover:bg-stone-800/60 border-transparent text-stone-300 hover:text-white'
                  }`}
                >
                  {/* Left: Track Number / Play Indicator & Artwork */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-8 flex items-center justify-center text-xs font-mono text-stone-500 shrink-0">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-4">
                          <span className="w-1 bg-amber-400 h-full animate-pulse" />
                          <span className="w-1 bg-amber-500 h-2/3 animate-ping" />
                          <span className="w-1 bg-amber-300 h-4/5 animate-pulse" />
                        </div>
                      ) : (
                        <span className="group-hover:hidden">{(idx + 1).toString().padStart(2, '0')}</span>
                      )}
                      <Play className="w-4 h-4 hidden group-hover:block text-amber-400 fill-current" />
                    </div>

                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-stone-800 bg-stone-900">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate flex items-center gap-2">
                        <span className={isCurrent ? 'text-amber-300' : 'text-stone-100'}>
                          {track.title}
                        </span>
                      </div>
                      <div className="font-devanagari text-xs text-amber-400/90 truncate">
                        {track.titleHindi} · {track.artistHindi}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate hidden sm:block">
                        {track.artist}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Tags & Mood */}
                  <div className="hidden lg:flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded-md border border-stone-800">
                      {track.mood}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      {track.bpm} BPM
                    </span>
                  </div>

                  {/* Right: Duration & Add to Queue Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-stone-400">
                      {track.durationFormatted}
                    </span>

                    <button
                      onClick={(e) => handleQueueClick(track, e)}
                      title="Add to Up Next Queue"
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-stone-400 hover:text-amber-300 hover:bg-stone-700/60'
                      }`}
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
