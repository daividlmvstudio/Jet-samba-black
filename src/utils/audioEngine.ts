// Web Audio & HTML5 Audio custom high-fidelity player engine

export type AudioToneType = 'anthem' | 'energetic' | 'ballad' | 'acoustic';

const FALLBACK_SAMBA_STREAMS: Record<AudioToneType, string> = {
  anthem: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=brazil-party-samba-carnival-122979.mp3',
  energetic: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=brazilian-street-carnival-batucada-samba-112194.mp3',
  ballad: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8230554.mp3?filename=brazilian-bossa-nova-samba-10702.mp3',
  acoustic: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_34190fa6e1.mp3?filename=samba-brasil-11004.mp3'
};

class BandAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private currentAudioUrl: string | null = null;
  private currentTone: AudioToneType = 'anthem';
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;
  private onTimeUpdate?: (seconds: number) => void;
  private onTrackEnded?: () => void;
  private currentTime: number = 0;
  private totalDuration: number = 228;
  private htmlAudio: HTMLAudioElement | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private rhythmTimerId: number | null = null;
  private hasTriedFallbackUrl: boolean = false;

  public unlockAudioContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private isPlayableMediaUrl(url?: string): boolean {
    if (!url) return false;
    const clean = url.trim();
    if (clean.startsWith('data:audio/')) return true;
    if (clean.startsWith('blob:')) return true;
    if (clean.match(/\.(mp3|wav|ogg|m4a|aac|flac)($|\?)/i)) return true;
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      if (clean.includes('soundcloud.com/') && !clean.includes('api.soundcloud.com') && !clean.match(/\.(mp3|wav|ogg)$/i)) {
        return false;
      }
      if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
        return false;
      }
      return true;
    }
    return false;
  }

  public playTrack(
    trackId: string,
    durationSec: number,
    audioUrl?: string,
    audioTone: AudioToneType = 'anthem',
    onUpdate?: (s: number) => void,
    onEnd?: () => void
  ) {
    this.stop();

    this.currentTrackId = trackId;
    this.currentTone = audioTone;
    this.totalDuration = Math.max(10, durationSec || 218);
    this.currentTime = 0;
    this.isPlaying = true;
    this.onTimeUpdate = onUpdate;
    this.onTrackEnded = onEnd;
    this.hasTriedFallbackUrl = false;

    // Use given URL or default to matching high quality Samba audio stream
    const targetUrl = (audioUrl && this.isPlayableMediaUrl(audioUrl))
      ? audioUrl
      : FALLBACK_SAMBA_STREAMS[audioTone] || FALLBACK_SAMBA_STREAMS.anthem;

    this.currentAudioUrl = targetUrl;
    this.playHtmlAudio(targetUrl);
  }

  private playHtmlAudio(url: string) {
    try {
      if (!this.htmlAudio) {
        this.htmlAudio = new Audio();
      }

      this.htmlAudio.pause();
      this.htmlAudio.src = url;
      this.htmlAudio.volume = this.volume;
      this.htmlAudio.currentTime = 0;

      this.htmlAudio.ontimeupdate = () => {
        if (!this.htmlAudio) return;
        this.currentTime = Math.floor(this.htmlAudio.currentTime);
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.currentTime);
        }
      };

      this.htmlAudio.onended = () => {
        this.stop();
        if (this.onTrackEnded) {
          this.onTrackEnded();
        }
      };

      this.htmlAudio.onerror = () => {
        console.warn('Audio playback error for url, attempting fallback stream or synth:', url);
        if (this.isPlaying) {
          if (!this.hasTriedFallbackUrl) {
            this.hasTriedFallbackUrl = true;
            const fallbackStream = FALLBACK_SAMBA_STREAMS[this.currentTone] || FALLBACK_SAMBA_STREAMS.anthem;
            if (fallbackStream !== url) {
              this.playHtmlAudio(fallbackStream);
              return;
            }
          }
          this.playSynthesizedTone();
        }
      };

      const playPromise = this.htmlAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('HTML Audio play was prevented or failed, attempting synth/fallback:', err);
          if (this.isPlaying) {
            this.playSynthesizedTone();
          }
        });
      }
    } catch (e) {
      console.warn('HTML Audio initialization failed, fallback to Web Audio:', e);
      this.playSynthesizedTone();
    }
  }

  private playSynthesizedTone() {
    this.initContext();
    this.scheduleNotes(this.currentTone);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      this.currentTime += 1;
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime);
      }
      if (this.currentTime >= this.totalDuration) {
        this.stop();
        if (this.onTrackEnded) {
          this.onTrackEnded();
        }
      }
    }, 1000);
  }

  private stopActiveOscillators() {
    if (this.rhythmTimerId) {
      clearInterval(this.rhythmTimerId);
      this.rhythmTimerId = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already stopped oscillators
      }
    });
    this.activeOscillators = [];
  }

  private scheduleNotes(tone: AudioToneType) {
    this.stopActiveOscillators();
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    // Harmonic & melodic scale sets based on audio tone
    let chordFreqs: number[][] = [];
    let intervalMs = 450;

    switch (tone) {
      case 'energetic':
        // Upbeat Samba Rock in D major / B minor
        chordFreqs = [
          [293.66, 369.99, 440.0], // D major
          [246.94, 293.66, 369.99], // B minor
          [329.63, 392.0, 493.88], // E minor
          [220.0, 277.18, 329.63]  // A major
        ];
        intervalMs = 380;
        break;
      case 'ballad':
        // Smooth soul ballad in F major / D minor
        chordFreqs = [
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [146.83, 174.61, 220.0, 261.63], // Dm7
          [196.0, 233.08, 293.66, 349.23], // Gm7
          [130.81, 164.81, 196.0, 246.94]  // C7
        ];
        intervalMs = 600;
        break;
      case 'acoustic':
        // Warm organic arpeggios in G major
        chordFreqs = [
          [196.0, 246.94, 293.66, 392.0],  // G
          [164.81, 196.0, 246.94, 329.63], // Em
          [220.0, 261.63, 329.63, 440.0],  // Am
          [146.83, 220.0, 293.66, 369.99]  // D
        ];
        intervalMs = 500;
        break;
      case 'anthem':
      default:
        // Authentic JET SAMBA BLACK groove (Lady style A minor / D9)
        chordFreqs = [
          [220.0, 261.63, 329.63, 440.0], // Am7
          [146.83, 220.0, 277.18, 329.63], // D9
          [174.61, 220.0, 261.63, 349.23], // F7M
          [164.81, 207.65, 246.94, 329.63]  // E7(#9)
        ];
        intervalMs = 420;
        break;
    }

    let chordStep = 0;

    const playRhythmicPulse = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // 1. Bass / Surdo Kick Punch
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, now);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
      kickGain.gain.setValueAtTime(0.35 * this.volume, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.3);

      // 2. Snare / Tamborim Accent (Every alternating beat)
      if (chordStep % 2 === 1) {
        const snareNoise = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        const snareFilter = this.ctx.createBiquadFilter();

        snareFilter.type = 'bandpass';
        snareFilter.frequency.value = 1200;
        snareNoise.type = 'triangle';
        snareNoise.frequency.setValueAtTime(280, now);
        snareNoise.frequency.exponentialRampToValueAtTime(80, now + 0.12);

        snareGain.gain.setValueAtTime(0.2 * this.volume, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        snareNoise.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(this.masterGain);

        snareNoise.start(now);
        snareNoise.stop(now + 0.14);
      }

      // 3. Harmonic Samba Rock Chord Strum
      const currentChord = chordFreqs[chordStep % chordFreqs.length];
      chordStep++;

      currentChord.forEach((freq, noteIndex) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = tone === 'acoustic' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(tone === 'acoustic' ? 1400 : 2200, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);

        osc.type = tone === 'acoustic' ? 'triangle' : 'sawtooth';
        // Add micro strum delay between chord strings
        const noteDelay = noteIndex * 0.015;
        osc.frequency.setValueAtTime(freq, now + noteDelay);

        noteGain.gain.setValueAtTime(0.09 * this.volume, now + noteDelay);
        noteGain.gain.exponentialRampToValueAtTime(0.0005, now + noteDelay + 0.45);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now + noteDelay);
        osc.stop(now + noteDelay + 0.48);
      });
    };

    playRhythmicPulse();
    this.rhythmTimerId = window.setInterval(playRhythmicPulse, intervalMs);
  }

  public pause() {
    this.isPlaying = false;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.stopActiveOscillators();
  }

  public resume() {
    if (!this.currentTrackId || this.isPlaying) return;

    this.isPlaying = true;

    if (this.htmlAudio && this.isPlayableMediaUrl(this.currentAudioUrl || undefined)) {
      this.htmlAudio.play().catch(() => {
        this.playSynthesizedTone();
      });
    } else {
      this.playSynthesizedTone();
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
      this.htmlAudio.src = '';
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.stopActiveOscillators();
    this.currentTime = 0;
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.totalDuration));
    if (this.htmlAudio && this.isPlayableMediaUrl(this.currentAudioUrl || undefined)) {
      try {
        this.htmlAudio.currentTime = this.currentTime;
      } catch {
        // Ignore seek error if audio not ready
      }
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }
}

export const audioEngine = new BandAudioEngine();
