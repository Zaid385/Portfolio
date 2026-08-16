import { create } from 'zustand';

interface WindowState {
  windows: string[];
  openWindow: (id: string) => void;
}

export const useWindowStore = create<WindowState>((set) => ({
  windows: [],
  openWindow: (id) => set((state) => ({ windows: [...state.windows, id] })),
}));
