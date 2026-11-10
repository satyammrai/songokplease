export type VehicleCategory = 'bus' | 'car' | 'bike';

export type UserRoleMode = 'drive' | 'ride'; // 'drive' = Want to Drive (Driver Mode), 'ride' = Want to Ride (Passenger/Ride Mode)

export type AmbientProfile = 'bus-diesel' | 'car-smooth' | 'bike-bullet';

export interface Track {
  id: string;
  title: string;
  titleHindi: string;
  artist: string;
  artistHindi: string;
  album: string;
  albumHindi: string;
  duration: number; // in seconds
  durationFormatted: string;
  coverUrl: string;
  audioUrl?: string; // Real audio file path (e.g. /assets/aistudio/truck-radio_6d5c4aa8.mp3)
  category: VehicleCategory;
  playlistId: string;
  bpm: number;
  mood: string;
  moodHindi: string;
  key: string;
  lyricsPreview?: string;
  lyricsPreviewHindi?: string;
  ambientProfile: AmbientProfile;
  tags: string[];
}

export interface Playlist {
  id: string;
  title: string;
  titleHindi: string;
  category: VehicleCategory;
  description: string;
  descriptionHindi: string;
  coverUrl: string;
  trackCount: number;
  mood: string;
  moodHindi: string;
  colorAccent: string;
  badge: string;
}

export interface VehicleWorldConfig {
  id: VehicleCategory;
  name: string;
  nameHindi: string;
  tagline: string;
  taglineHindi: string;
  heroHeadline: string;
  heroSubtitle: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  badge: string;
  environmentDescription: string;
  defaultPlaylistId: string;
  hornName: string;
  hornNameHindi: string;
  engineSoundDescription: string;
  stats: {
    speed: string;
    rpm: string;
    gear: string;
    odometer: string;
    fuel: string;
  };
}
