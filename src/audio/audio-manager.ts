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
  private context: AudioContext;
  private masterGain: GainNode;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private isResumed = false;
  private pendingStartup = false;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    
    const resumeHandler = () => {
      if (!this.isResumed && this.context.state !== 'running') {
        this.context.resume().then(() => {
          this.isResumed = true;
          if (this.pendingStartup) {
            this.pendingStartup = false;
            this.play('startup');
          }
        }).catch(console.error);
      }
      window.removeEventListener('click', resumeHandler);
      window.removeEventListener('keydown', resumeHandler);
      window.removeEventListener('touchstart', resumeHandler);
    };
    
    window.addEventListener('click', resumeHandler);
    window.addEventListener('keydown', resumeHandler);
    window.addEventListener('touchstart', resumeHandler);
  }

  private async getBuffer(url: string): Promise<AudioBuffer | null> {
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
    if (!state.soundEffectsEnabled && soundId !== 'startup') return;
    if (state.isMuted) return;

    if (this.context.state === 'suspended' || !this.isResumed) {
      if (soundId === 'startup') {
        this.pendingStartup = true;
      }
      return;
    }

    const url = soundMap[soundId];
    if (!url) return;

    const buffer = await this.getBuffer(url);
    if (!buffer) return;

    const vol = options?.volumeOverride ?? state.volume;
    const gainValue = Math.pow(vol / 100, 2); // Perceptual volume mapping
    
    // Prevent cracking by clamping or small ramp
    this.masterGain.gain.setValueAtTime(gainValue, this.context.currentTime);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start(0);
  }
}

export const audioManager = new AudioManager();
