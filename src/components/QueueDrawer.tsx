import React from 'react';
import { X, Play, Trash2, ArrowUp, ArrowDown, Music, Disc } from 'lucide-react';
import { Track } from '../types';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onRemoveFromQueue: (index: number) => void;
  onMoveQueueItem: (fromIndex: number, toIndex: number) => void;
  onClearQueue: () => void;
  onAddPlaylistToQueue: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onRemoveFromQueue,
  onMoveQueueItem,
  onClearQueue,
  onAddPlaylistToQueue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#120d0a] border-l border-amber-900/30 p-6 flex flex-col justify-between shadow-2xl text-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Disc className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2">
                <span>Playback Queue</span>
                <span className="font-devanagari text-xs text-amber-400 font-normal">कतार</span>
              </h3>
              <p className="text-xs text-stone-400">{queue.length} tracks waiting</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Currently Playing Card */}
          {currentTrack && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-lg">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>NOW PLAYING</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className={`w-full h-full object-cover ${isPlaying ? 'animate-vinyl-spin' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-stone-100 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="font-devanagari text-xs text-amber-400/90 truncate">
                    {currentTrack.titleHindi}
                  </div>
                  <div className="text-xs text-stone-400 truncate">
                    {currentTrack.artist}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-400 tracking-wider uppercase">
                Up Next ({queue.length})
              </span>
              {queue.length > 0 && (
                <button
                  onClick={onClearQueue}
                  className="text-xs text-stone-400 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-stone-900/50 border border-dashed border-stone-800">
                <Music className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-stone-400">Queue is empty</p>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  Add tracks from playlists to keep your road journey moving.
                </p>
                <button
                  onClick={onAddPlaylistToQueue}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all cursor-pointer shadow-md"
                >
                  Queue Current Playlist
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800/80 border border-stone-800 transition-all group"
                  >
                    <div
                      onClick={() => onPlayTrack(track)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-stone-800">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-stone-200 truncate group-hover:text-amber-300">
                          {track.title}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {track.artist}
                        </div>
                      </div>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => onMoveQueueItem(idx, idx - 1)}
                        className="p-1 text-stone-500 hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === queue.length - 1}
                        onClick={() => onMoveQueueItem(idx, idx + 1)}
                        className="p-1 text-stone-500 hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveFromQueue(idx)}
                        className="p-1 text-stone-500 hover:text-red-400 cursor-pointer"
                        title="Remove from queue"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Continuous playback enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
