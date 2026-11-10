import React from 'react';
import { Share2, ListMusic, Volume2, VolumeX, Repeat, Sparkles, Navigation } from 'lucide-react';
import { UserRoleMode, VehicleCategory } from '../types';
import { VEHICLE_WORLDS } from '../data/musicData';

interface HeaderProps {
  activeCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
  userRole: UserRoleMode;
  onSelectRole: (role: UserRoleMode) => void;
  onOpenRoleModal: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  onOpenShare: () => void;
  onOpenQueue: () => void;
  onOpenAmbienceMixer: () => void;
  queueCount: number;
  isAmbienceActive: boolean;
  onToggleAmbience: () => void;
  onTriggerHorn: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  userRole,
  onSelectRole,
  onOpenRoleModal,
  isLooping,
  onToggleLoop,
  onOpenShare,
  onOpenQueue,
  onOpenAmbienceMixer,
  queueCount,
  isAmbienceActive,
  onToggleAmbience,
  onTriggerHorn,
}) => {
  const currentWorld = VEHICLE_WORLDS[activeCategory];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0d0907]/90 border-b border-amber-900/25 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Wordmark & Mode Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRoleModal}
            title="Change Journey Mode (Drive / Ride)"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/40 border border-amber-400/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="font-devanagari text-xl font-bold text-stone-950">स</span>
          </button>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-stone-100 flex items-center gap-2">
              SAFAR BEATS
              <span className="font-devanagari text-sm font-normal text-amber-400/90 hidden sm:inline">
                सफ़र
              </span>
            </span>
            {/* Active Mode Pill Indicator */}
            <button
              onClick={onOpenRoleModal}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{userRole === 'drive' ? 'DRIVER MODE (POV DRIVE)' : 'PASSENGER MODE (RIDE)'}</span>
            </button>
          </div>
        </div>

        {/* Center Zone: Drive vs Ride Mode Switcher & Category Switcher */}
        <div className="flex items-center gap-2">
          {/* Role Mode Segmented Control: WANT TO DRIVE vs WANT TO RIDE */}
          <div className="flex items-center p-1 rounded-2xl bg-stone-900 border border-stone-800 shadow-inner">
            <button
              onClick={() => onSelectRole('drive')}
              title="Want to Drive: Endless Highway POV Driving Video"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                userRole === 'drive'
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-102'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <span>🚗</span>
              <span className="whitespace-nowrap">WANT TO DRIVE</span>
            </button>

            <button
              onClick={() => onSelectRole('ride')}
              title="Want to Ride: Passenger Scenic Journey View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                userRole === 'ride'
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-102'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <span>💺</span>
              <span className="whitespace-nowrap">WANT TO RIDE</span>
            </button>
          </div>

          {/* Three Vehicle Categories: BUS | CAR | BIKE */}
          <div className="hidden lg:flex items-center p-1 rounded-2xl bg-stone-900/80 border border-stone-800">
            <button
              onClick={() => onSelectCategory('bus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'bus'
                  ? 'bg-amber-600/90 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              BUS
            </button>
            <button
              onClick={() => onSelectCategory('car')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'car'
                  ? 'bg-amber-600/90 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              CAR
            </button>
            <button
              onClick={() => onSelectCategory('bike')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'bike'
                  ? 'bg-amber-600/90 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              BIKE
            </button>
          </div>
        </div>

        {/* Zone 3: Interactive Sound Controls, Dedicated Loop & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Dedicated Replay Loop Button */}
          <button
            onClick={onToggleLoop}
            title={isLooping ? 'Loop is ON: Replaying track again and again' : 'Enable Loop Replay'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isLooping
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-950/40 ring-1 ring-amber-300'
                : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 border-stone-800'
            }`}
          >
            <Repeat className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">LOOP</span>
            <span className="text-[10px] opacity-80">{isLooping ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Honk Button */}
          <button
            onClick={onTriggerHorn}
            title={`Honk ${currentWorld.hornName}`}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-stone-900/80 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            <span>🎺</span>
            <span className="hidden xl:inline">HONK</span>
          </button>

          {/* Vehicle Ambience Toggle */}
          <button
            onClick={onToggleAmbience}
            title={isAmbienceActive ? 'Mute Vehicle Acoustics' : 'Enable Vehicle Acoustics'}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isAmbienceActive
                ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
                : 'text-stone-500 hover:text-stone-300 bg-stone-900 border-stone-800'
            }`}
          >
            {isAmbienceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={onOpenShare}
            className="p-2.5 rounded-xl text-stone-300 hover:text-white bg-stone-900/90 hover:bg-stone-800 border border-stone-800 transition-all cursor-pointer shadow-sm hidden sm:block"
            title="Share & QR Code"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Queue Drawer Trigger */}
          <button
            onClick={onOpenQueue}
            className="relative p-2.5 rounded-xl text-stone-300 hover:text-white bg-stone-900/90 hover:bg-stone-800 border border-stone-800 transition-all cursor-pointer shadow-sm"
            title="Open Playback Queue"
          >
            <ListMusic className="w-4 h-4" />
            {queueCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                {queueCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
