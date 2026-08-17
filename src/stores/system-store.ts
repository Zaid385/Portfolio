import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SystemStatus = 'booting' | 'normal' | 'crashed' | 'restarting';

interface SystemState {
  systemStatus: SystemStatus;
  crashError?: string;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  batteryLevel: number;
  batteryState: 'Full' | 'High' | 'Medium' | 'Low' | 'Critical' | 'Charging';
  volume: number;
  isMuted: boolean;
  brightness: number;
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  
  triggerCrash: (errorMsg?: string) => void;
  triggerRestart: () => void;
  setSystemStatus: (status: SystemStatus) => void;
  
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setBrightness: (b: number) => void;
  setAnimationsEnabled: (v: boolean) => void;
  setSoundEffectsEnabled: (v: boolean) => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      systemStatus: 'booting',
      crashError: undefined,
      
      triggerCrash: (errorMsg = 'A problem has been detected and Windows has been shut down to prevent damage to your computer.') => set({ systemStatus: 'crashed', crashError: errorMsg }),
      triggerRestart: () => set({ systemStatus: 'restarting' }),
      setSystemStatus: (status) => set({ systemStatus: status }),
      wifiEnabled: true,
      bluetoothEnabled: false,
      batteryLevel: 85,
      batteryState: 'Charging',
      volume: 70,
      isMuted: false,
      brightness: 100,
      animationsEnabled: true,
      soundEffectsEnabled: true,
      
      toggleWifi: () => set((state) => ({ wifiEnabled: !state.wifiEnabled })),
      toggleBluetooth: () => set((state) => ({ bluetoothEnabled: !state.bluetoothEnabled })),
      setVolume: (vol) => set({ volume: vol, isMuted: vol === 0 }),
      toggleMute: () => set((state) => ({ 
        isMuted: !state.isMuted, 
        volume: state.isMuted ? (state.volume === 0 ? 50 : state.volume) : 0 
      })),
      setBrightness: (b) => set({ brightness: b }),
      setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
      setSoundEffectsEnabled: (v) => set({ soundEffectsEnabled: v }),
    }),
    {
      name: 'xp-portfolio:settings',
      partialize: (state) => ({
        wifiEnabled: state.wifiEnabled,
        bluetoothEnabled: state.bluetoothEnabled,
        volume: state.volume,
        isMuted: state.isMuted,
        brightness: state.brightness,
        animationsEnabled: state.animationsEnabled,
        soundEffectsEnabled: state.soundEffectsEnabled,
      }),
    }
  )
);
