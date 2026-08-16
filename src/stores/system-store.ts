import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SystemState {
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  batteryLevel: number;
  batteryState: 'Full' | 'High' | 'Medium' | 'Low' | 'Critical' | 'Charging';
  volume: number;
  isMuted: boolean;
  brightness: number;
  animationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  
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
    }
  )
);
