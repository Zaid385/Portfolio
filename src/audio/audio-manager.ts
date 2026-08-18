import { AssetRegistry } from '../assets/registry';
import { useSystemStore } from '../stores/system-store';

export type SoundId =
  | 'startup' | 'shutdown' | 'error' | 'notification' | 'menu-open' | 'menu-close'
  | 'window-open' | 'window-close' | 'click'
  | 'recycle-empty' | 'bsod-trigger'
  | 'minesweeper-flag' | 'minesweeper-reveal' | 'minesweeper-explode'
  | 'snake-eat' | 'snake-gameover';

const soundMap: Partial<Record<SoundId, string>> = {
  'startup': AssetRegistry.SND_STARTUP,
  'shutdown': AssetRegistry.SND_SHUTDOWN,
  'error': AssetRegistry.SND_ERROR,
  'notification': AssetRegistry.SND_NOTIFY,
  'menu-open': AssetRegistry.SND_START,
  'menu-close': AssetRegistry.SND_MENU_COMMAND,
  'window-open': AssetRegistry.SND_START,
  'window-close': AssetRegistry.SND_MINIMIZE,
  'click': AssetRegistry.SND_START,
  'recycle-empty': AssetRegistry.SND_RECYCLE,
  'bsod-trigger': AssetRegistry.SND_CRITICAL_STOP,
};

class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private isReady = false;
  private pendingSounds: SoundId[] = [];

  constructor() {
    // Defer AudioContext creation until first user interaction
    // to comply with browser autoplay policies
    const initHandler = () => {
      if (!this.context) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          this.context = new AudioContextClass();
          this.masterGain = this.context.createGain();
          this.masterGain.connect(this.context.destination);
        } catch (e) {
          console.error('Failed to create AudioContext:', e);
          return;
        }
      }

      if (this.context.state === 'suspended') {
        this.context.resume().then(() => {
          this.isReady = true;
          this.flushPending();
          this.removeInitListeners();
        }).catch(console.error);
      } else {
        this.isReady = true;
        this.flushPending();
        this.removeInitListeners();
      }
    };

    this._initHandler = initHandler;
    window.addEventListener('click', initHandler);
    window.addEventListener('keydown', initHandler);
    window.addEventListener('touchstart', initHandler);
    window.addEventListener('pointerdown', initHandler);
  }

  private _initHandler: (() => void) | null = null;

  private removeInitListeners() {
    if (this._initHandler) {
      window.removeEventListener('click', this._initHandler);
      window.removeEventListener('keydown', this._initHandler);
      window.removeEventListener('touchstart', this._initHandler);
      window.removeEventListener('pointerdown', this._initHandler);
      this._initHandler = null;
    }
  }

  private flushPending() {
    const pending = [...this.pendingSounds];
    this.pendingSounds = [];
    pending.forEach(id => this.play(id));
  }

  private async getBuffer(url: string): Promise<AudioBuffer | null> {
    if (!this.context) return null;
    if (this.bufferCache.has(url)) return this.bufferCache.get(url)!;
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.bufferCache.set(url, audioBuffer);
      return audioBuffer;
    } catch (e) {
      console.error('Failed to load audio:', url, e);
      return null;
    }
  }

  /**
   * Attempt to play a synthesized game sound. Returns true if handled.
   */
  private playSynthesized(soundId: SoundId, gainValue: number): boolean {
    if (!this.context) return false;
    const ctx = this.context;
    const t = ctx.currentTime;

    switch (soundId) {
      case 'snake-eat': {
        // Quick ascending chirp — satisfying "collect" feel
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.07);
        g.gain.setValueAtTime(gainValue * 0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(g).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
        return true;
      }

      case 'snake-gameover': {
        // Three descending tones — classic "failure" jingle
        const freqs = [440, 330, 220];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, t + i * 0.18);
          g.gain.setValueAtTime(gainValue * 0.2, t + i * 0.18);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.16);
          osc.connect(g).connect(ctx.destination);
          osc.start(t + i * 0.18);
          osc.stop(t + i * 0.18 + 0.16);
        });
        return true;
      }

      case 'minesweeper-reveal': {
        // Soft, subtle tick — unobtrusive for frequent clicks
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);
        g.gain.setValueAtTime(gainValue * 0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(g).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
        return true;
      }

      case 'minesweeper-flag': {
        // Short double-click sound for placing/removing flags
        [0, 0.06].forEach(offset => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, t + offset);
          g.gain.setValueAtTime(gainValue * 0.12, t + offset);
          g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.03);
          osc.connect(g).connect(ctx.destination);
          osc.start(t + offset);
          osc.stop(t + offset + 0.03);
        });
        return true;
      }

      case 'minesweeper-explode': {
        // Low boom + noise burst — dramatic mine explosion
        // Sub-bass boom
        const boom = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(80, t);
        boom.frequency.exponentialRampToValueAtTime(30, t + 0.4);
        boomGain.gain.setValueAtTime(gainValue * 0.5, t);
        boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        boom.connect(boomGain).connect(ctx.destination);
        boom.start(t);
        boom.stop(t + 0.4);

        // Noise burst for crackle/debris
        const bufferSize = ctx.sampleRate * 0.3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(gainValue * 0.35, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        // Bandpass to shape the noise into something more explosion-like
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, t);
        filter.Q.setValueAtTime(0.5, t);
        noise.connect(filter).connect(noiseGain).connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 0.3);

        return true;
      }

      default:
        return false;
    }
  }

  public async play(soundId: SoundId, options?: { volumeOverride?: number }) {
    const state = useSystemStore.getState();
    if (!state.soundEffectsEnabled && soundId !== 'startup' && soundId !== 'shutdown') return;
    if (state.isMuted) return;

    // If audio not ready yet, queue important sounds
    if (!this.isReady || !this.context || !this.masterGain) {
      if (soundId === 'startup' || soundId === 'shutdown') {
        this.pendingSounds.push(soundId);
      }
      return;
    }

    // Re-check context state
    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch {
        return;
      }
    }

    const vol = options?.volumeOverride ?? state.volume;
    const gainValue = Math.pow(vol / 100, 2);

    // Try synthesized game sounds first
    if (this.playSynthesized(soundId, gainValue)) return;

    // Fall back to file-based sounds
    const url = soundMap[soundId];
    if (!url) return;

    const buffer = await this.getBuffer(url);
    if (!buffer) return;

    this.masterGain.gain.setValueAtTime(gainValue, this.context.currentTime);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start(0);
  }
}

export const audioManager = new AudioManager();
