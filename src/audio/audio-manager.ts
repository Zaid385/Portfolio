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
  'snake-eat': AssetRegistry.SND_START,
  'snake-gameover': AssetRegistry.SND_ERROR,
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

    const url = soundMap[soundId];
    if (!url) return;

    const buffer = await this.getBuffer(url);
    if (!buffer) return;

    const vol = options?.volumeOverride ?? state.volume;
    const gainValue = Math.pow(vol / 100, 2); // Perceptual volume mapping
    
    this.masterGain.gain.setValueAtTime(gainValue, this.context.currentTime);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start(0);
  }
}

export const audioManager = new AudioManager();
