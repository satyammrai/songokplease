import { AmbientProfile, Track, VehicleCategory } from '../types';
import { FLAGSHIP_COMMON_TRACK } from '../data/musicData';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master Gain & Analyser
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // Real HTML5 Audio Element for MP3 tracks
  private audioElement: HTMLAudioElement | null = null;
  private isPlayingRealAudio = false;

  // Musical playback state - Preloaded with Flagship Road Anthem
  private isPlaying = false;
  private currentTrack: Track | null = FLAGSHIP_COMMON_TRACK;
  private currentTime = 0;
  private duration = 288;
  private volume = 0.85;
  private ambientVolume = 0.16; // "not more but little %" default 16%
  private isAmbientMuted = false;
  private isLooping = true; // "give loop option also to replay again again"

  // Timers & Loops
  private playbackTimer: number | null = null;
  private musicStepInterval: number | null = null;
  private currentStep = 0;

  // Ambient nodes
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private ambientNoiseFilter: BiquadFilterNode | null = null;
  private ambientSubGain: GainNode | null = null;
  private ambientNoiseGain: GainNode | null = null;
  private currentProfile: AmbientProfile = 'bus-diesel';

  // Callbacks
  private onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;
  private onTrackEnded: (() => void) | null = null;
  private onPlayStateChange: ((isPlaying: boolean) => void) | null = null;

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(
      this.isAmbientMuted ? 0 : this.ambientVolume,
      this.ctx.currentTime
    );

    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 64;
    this.analyserNode.smoothingTimeConstant = 0.8;

    this.musicGain.connect(this.masterGain);
    this.ambientGain.connect(this.masterGain);
    this.masterGain.connect(this.analyserNode);
    this.analyserNode.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  public setCallbacks(callbacks: {
    onTimeUpdate: (currentTime: number, duration: number) => void;
    onTrackEnded: () => void;
    onPlayStateChange: (isPlaying: boolean) => void;
  }) {
    this.onTimeUpdate = callbacks.onTimeUpdate;
    this.onTrackEnded = callbacks.onTrackEnded;
    this.onPlayStateChange = callbacks.onPlayStateChange;
  }

  public async playTrack(track: Track, startTime = 0) {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.currentTrack = track;
    this.duration = track.duration;
    this.currentTime = startTime;
    this.currentProfile = track.ambientProfile;

    this.stopPlaybackLoops();
    this.startAmbientEngine(track.ambientProfile);

    // If track has a real audio file (e.g. /assets/aistudio/truck-radio_6d5c4aa8.mp3)
    if (track.audioUrl) {
      this.isPlayingRealAudio = true;
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.preload = 'auto';

        this.audioElement.ontimeupdate = () => {
          if (this.audioElement) {
            this.currentTime = Math.floor(this.audioElement.currentTime);
            const dur = Math.floor(this.audioElement.duration || this.duration);
            if (!isNaN(dur) && dur > 0) {
              this.duration = dur;
            }
            this.onTimeUpdate?.(this.currentTime, this.duration);
          }
        };

        this.audioElement.onended = () => {
          if (this.isLooping) {
            if (this.audioElement) {
              this.audioElement.currentTime = 0;
              this.audioElement.play().catch(() => {});
            }
          } else {
            this.onTrackEnded?.();
          }
        };
      }

      // Ensure any previous audio is paused first
      try {
        this.audioElement.pause();
      } catch {}

      // Set the new target track URL and reset position
      const targetSrc = track.audioUrl;
      this.audioElement.src = targetSrc;
      this.audioElement.volume = this.volume;
      this.audioElement.loop = this.isLooping;
      this.audioElement.currentTime = startTime;

      try {
        await this.audioElement.play();
      } catch (err) {
        console.warn('Audio element play interrupted or blocked:', err);
      }
    } else {
      // Procedural synthesizer fallback
      this.isPlayingRealAudio = false;
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.startMusicSynthesizer(track);

      if (this.playbackTimer) clearInterval(this.playbackTimer);
      this.playbackTimer = window.setInterval(() => {
        if (this.isPlaying) {
          this.currentTime += 1;
          this.onTimeUpdate?.(this.currentTime, this.duration);
          if (this.currentTime >= this.duration) {
            if (this.isLooping) {
              this.currentTime = 0;
              this.onTimeUpdate?.(0, this.duration);
            } else {
              this.onTrackEnded?.();
            }
          }
        }
      }, 1000);
    }

    this.isPlaying = true;
    this.onPlayStateChange?.(true);
    this.onTimeUpdate?.(this.currentTime, this.duration);
  }

  public async togglePlay(fallbackTrack?: Track | null) {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {}
    }

    const track = this.currentTrack || fallbackTrack || FLAGSHIP_COMMON_TRACK;
    this.currentTrack = track;
    this.duration = track.duration;

    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.isPlayingRealAudio && this.audioElement && this.currentTime > 0) {
        try {
          this.audioElement.volume = this.volume;
          this.audioElement.loop = this.isLooping;
          await this.audioElement.play();
          this.isPlaying = true;
          this.startAmbientEngine(track.ambientProfile);
          this.onPlayStateChange?.(true);
        } catch (err) {
          console.warn('Direct resume failed, starting via playTrack:', err);
          await this.playTrack(track, this.currentTime || 0);
        }
      } else {
        await this.playTrack(track, this.currentTime || 0);
      }
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement && this.isPlayingRealAudio) {
      this.audioElement.pause();
    }
    if (this.busEngineAudio) {
      try {
        this.busEngineAudio.pause();
      } catch {}
    }
    this.stopPlaybackLoops();
    this.stopAmbientEngine();
    this.onPlayStateChange?.(false);
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.audioElement && this.isPlayingRealAudio) {
      this.audioElement.currentTime = this.currentTime;
    }
    this.onTimeUpdate?.(this.currentTime, this.duration);
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setLoop(loop: boolean) {
    this.isLooping = loop;
    if (this.audioElement) {
      this.audioElement.loop = loop;
    }
  }

  public getIsLooping(): boolean {
    return this.isLooping;
  }

  // Real Bus Engine Audio (strictly 10-15% background noise)
  private busEngineAudio: HTMLAudioElement | null = null;

  public setAmbientVolume(val: number) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    // Kept strictly between 10% and 15% as explicitly instructed
    const scaledBusVol = this.isAmbientMuted
      ? 0
      : Math.min(0.15, Math.max(0.10, 0.10 + this.ambientVolume * 0.05));

    if (this.busEngineAudio) {
      this.busEngineAudio.volume = scaledBusVol;
    }

    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        this.isAmbientMuted ? 0 : this.ambientVolume,
        this.ctx.currentTime
      );
    }
  }

  public toggleAmbientMute(): boolean {
    this.isAmbientMuted = !this.isAmbientMuted;
    const scaledBusVol = this.isAmbientMuted
      ? 0
      : Math.min(0.15, Math.max(0.10, 0.10 + this.ambientVolume * 0.05));

    if (this.busEngineAudio) {
      this.busEngineAudio.volume = scaledBusVol;
      if (this.isAmbientMuted) {
        this.busEngineAudio.pause();
      } else if (this.isPlaying) {
        this.busEngineAudio.play().catch(() => {});
      }
    }

    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        this.isAmbientMuted ? 0 : this.ambientVolume,
        this.ctx.currentTime
      );
    }
    return !this.isAmbientMuted;
  }

  public isAmbienceActive(): boolean {
    return !this.isAmbientMuted;
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  // Real Truck Horns (uploaded by user)
  private hornAudio1: HTMLAudioElement | null = null;
  private hornAudio2: HTMLAudioElement | null = null;
  private lastHornPlayed: 1 | 2 = 2; // Starts with 2 so first click plays 1

  public triggerVehicleHorn(category: VehicleCategory, forceHorn?: 1 | 2): 1 | 2 {
    this.initContext();

    if (category === 'bus') {
      // Alternate between the two authentic uploaded truck horns ("both one by one")
      const nextHorn: 1 | 2 = forceHorn || (this.lastHornPlayed === 1 ? 2 : 1);
      this.lastHornPlayed = nextHorn;

      const hornUrl =
        nextHorn === 1
          ? '/assets/aistudio/horn-truck-4_d6168458.mp3'
          : '/assets/aistudio/horn-truck-5_60ebdfec.mp3';

      try {
        const audio = new Audio(hornUrl);
        audio.volume = Math.min(1, this.volume * 1.15);
        audio.play().catch(() => {});
      } catch (err) {
        console.warn('Horn audio error:', err);
      }

      return nextHorn;
    } else if (category === 'car') {
      const audio = new Audio('/assets/aistudio/horn-truck-4_d6168458.mp3');
      audio.volume = this.volume;
      audio.play().catch(() => {});
      return 1;
    } else {
      const audio = new Audio('/assets/aistudio/horn-truck-5_60ebdfec.mp3');
      audio.volume = this.volume;
      audio.play().catch(() => {});
      return 2;
    }
  }

  public getLastHornPlayed(): 1 | 2 {
    return this.lastHornPlayed;
  }

  // Synthesize hot chai pour & cup clink sound effect for "Chai for the driver"
  public playChaiSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Warm bubbling pour noise
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.05);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.75);

    // 2. Ceramic cup clink (metallic/ceramic chime)
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(2489, now + 0.5); // D#7 high clink
    bellGain.gain.setValueAtTime(0.2, now + 0.5);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    bellOsc.connect(bellGain);
    bellGain.connect(this.masterGain);
    bellOsc.start(now + 0.5);
    bellOsc.stop(now + 0.9);
  }

  // --- Procedural Ambient Engine ---
  private startAmbientEngine(profile: AmbientProfile) {
    if (!this.ctx || !this.ambientGain) return;
    this.stopAmbientEngine();

    const now = this.ctx.currentTime;

    // Create pinkish road noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    this.ambientNoiseSource = this.ctx.createBufferSource();
    this.ambientNoiseSource.buffer = noiseBuffer;
    this.ambientNoiseSource.loop = true;

    this.ambientNoiseFilter = this.ctx.createBiquadFilter();
    this.ambientNoiseGain = this.ctx.createGain();
    this.ambientSubGain = this.ctx.createGain();

    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc2 = this.ctx.createOscillator();

    // 10-15% real background bus engine noise uploaded by user (used across bus, car, bike)
    try {
      if (!this.busEngineAudio) {
        this.busEngineAudio = new Audio(
          '/assets/aistudio/What_does_a_Bus_Engine_looks_like_when_started___TcKBXvHIJ3A__d55dc3ef.mp3'
        );
        this.busEngineAudio.loop = true;
      }
      const scaledVol = this.isAmbientMuted
        ? 0
        : Math.min(0.15, Math.max(0.10, 0.10 + this.ambientVolume * 0.05)); // 10-15% volume
      this.busEngineAudio.volume = scaledVol;
      if (!this.isAmbientMuted) {
        this.busEngineAudio.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Bus engine audio error:', err);
    }

    if (profile === 'bus-diesel') {
      // Low diesel rumble: 52Hz + 104Hz + deep road friction
      this.ambientOsc1.type = 'triangle';
      this.ambientOsc1.frequency.setValueAtTime(54, now);

      this.ambientOsc2.type = 'sawtooth';
      this.ambientOsc2.frequency.setValueAtTime(108, now);

      this.ambientNoiseFilter.type = 'lowpass';
      this.ambientNoiseFilter.frequency.setValueAtTime(180, now);

      this.ambientSubGain.gain.setValueAtTime(0.14, now);
      this.ambientNoiseGain.gain.setValueAtTime(0.08, now);
    } else if (profile === 'car-smooth') {
      // Smooth modern cruiser: 115Hz harmonic purr + gentle wind rush
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(80, now);

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(160, now);

      this.ambientNoiseFilter.type = 'bandpass';
      this.ambientNoiseFilter.frequency.setValueAtTime(320, now);

      this.ambientSubGain.gain.setValueAtTime(0.1, now);
      this.ambientNoiseGain.gain.setValueAtTime(0.08, now);
    } else {
      // Royal Enfield Bullet 350 Thumper: Rhythmic 8Hz sub-pulse + 68Hz cylinder boom
      this.ambientOsc1.type = 'triangle';
      this.ambientOsc1.frequency.setValueAtTime(68, now);

      this.ambientOsc2.type = 'sawtooth';
      this.ambientOsc2.frequency.setValueAtTime(136, now);

      this.ambientNoiseFilter.type = 'lowpass';
      this.ambientNoiseFilter.frequency.setValueAtTime(260, now);

      this.ambientSubGain.gain.setValueAtTime(0.2, now);
      this.ambientNoiseGain.gain.setValueAtTime(0.14, now);
    }

    // Connect nodes
    this.ambientOsc1.connect(this.ambientSubGain);
    this.ambientOsc2.connect(this.ambientSubGain);
    this.ambientSubGain.connect(this.ambientGain);

    this.ambientNoiseSource.connect(this.ambientNoiseFilter);
    this.ambientNoiseFilter.connect(this.ambientNoiseGain);
    this.ambientNoiseGain.connect(this.ambientGain);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
    this.ambientNoiseSource.start();
  }

  private stopAmbientEngine() {
    if (this.busEngineAudio) {
      try {
        this.busEngineAudio.pause();
      } catch {
        // Ignore if already paused
      }
    }
    try {
      this.ambientOsc1?.stop();
      this.ambientOsc2?.stop();
      this.ambientNoiseSource?.stop();
      this.ambientOsc1?.disconnect();
      this.ambientOsc2?.disconnect();
      this.ambientNoiseSource?.disconnect();
    } catch {
      // Ignore if already stopped
    }
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientNoiseSource = null;
  }

  // --- Procedural High-Fidelity Road Music Synthesizer ---
  private startMusicSynthesizer(track: Track) {
    if (!this.ctx || !this.musicGain) return;

    const baseFreqs: Record<string, number> = {
      'D Major': 146.83,
      'G Major': 196.0,
      'E Minor': 164.81,
      'A Major': 220.0,
      'C Major': 130.81,
      'F Major': 174.61,
      'A Minor': 220.0,
      'E Major': 164.81,
      'B Minor': 246.94,
      'G Minor': 196.0,
      'C# Minor': 138.59,
      'F# Minor': 185.0,
      'Db Major': 138.59,
    };

    const root = baseFreqs[track.key] || 164.81;
    const isMinor = track.key.includes('Minor');

    const chords = isMinor
      ? [
          [root, root * 1.2, root * 1.5],
          [root * 1.26, root * 1.58, root * 1.89],
          [root * 1.2, root * 1.5, root * 1.8],
          [root * 1.33, root * 1.6, root * 2.0],
        ]
      : [
          [root, root * 1.25, root * 1.5],
          [root * 1.5, root * 1.875, root * 2.25],
          [root * 1.667, root * 2.0, root * 2.5],
          [root * 1.333, root * 1.667, root * 2.0],
        ];

    const melodyScale = [
      root * 2,
      root * 2 * (isMinor ? 1.125 : 1.125),
      root * 2 * (isMinor ? 1.2 : 1.25),
      root * 2 * 1.333,
      root * 2 * 1.5,
      root * 2 * (isMinor ? 1.6 : 1.667),
      root * 2 * (isMinor ? 1.8 : 1.875),
      root * 4,
    ];

    const bpm = track.bpm || 110;
    const stepIntervalMs = (60 / bpm / 2) * 1000;

    this.currentStep = 0;

    this.musicStepInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.musicGain) return;

      const now = this.ctx.currentTime;
      const chordIndex = Math.floor((this.currentStep / 16) % chords.length);
      const currentChord = chords[chordIndex];
      const stepInMeasure = this.currentStep % 16;

      // Bassline
      if (stepInMeasure % 4 === 0 || stepInMeasure % 4 === 2) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = track.category === 'bike' ? 'sawtooth' : 'triangle';
        const bassNote = currentChord[0] * 0.5;
        bassOsc.frequency.setValueAtTime(bassNote, now);

        bassGain.gain.setValueAtTime(0.24, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.36);
      }

      // Highway Kick
      if (stepInMeasure % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

        kickGain.gain.setValueAtTime(0.32, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.2);
      }

      // Pad
      if (stepInMeasure === 0) {
        currentChord.forEach((freq) => {
          if (!this.ctx || !this.musicGain) return;
          const padOsc = this.ctx.createOscillator();
          const padGain = this.ctx.createGain();
          padOsc.type = 'sine';
          padOsc.frequency.setValueAtTime(freq, now);

          padGain.gain.setValueAtTime(0.001, now);
          padGain.gain.linearRampToValueAtTime(0.045, now + 0.4);
          padGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

          padOsc.connect(padGain);
          padGain.connect(this.musicGain);
          padOsc.start(now);
          padOsc.stop(now + 3.0);
        });
      }

      // Melody
      if (stepInMeasure % 2 === 0 || (stepInMeasure % 4 === 3 && Math.random() > 0.4)) {
        const noteIndex =
          Math.floor(Math.sin(this.currentStep * 0.7) * 3.5 + 3.5) % melodyScale.length;
        const melodyFreq = melodyScale[noteIndex];

        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        const leadFilter = this.ctx.createBiquadFilter();

        leadOsc.type =
          track.category === 'bus' ? 'sawtooth' : track.category === 'car' ? 'sine' : 'triangle';
        leadOsc.frequency.setValueAtTime(melodyFreq, now);

        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(track.category === 'car' ? 1400 : 2200, now);

        leadGain.gain.setValueAtTime(0.001, now);
        leadGain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(this.musicGain);
        leadOsc.start(now);
        leadOsc.stop(now + 0.4);
      }

      this.currentStep++;
    }, stepIntervalMs);
  }

  private stopPlaybackLoops() {
    if (this.musicStepInterval) {
      clearInterval(this.musicStepInterval);
      this.musicStepInterval = null;
    }
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyserNode) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }
}

export const audioEngine = new AudioEngine();
