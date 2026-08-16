import { create } from 'zustand';
import { appRegistry } from '../registries/app-registry';

export interface WindowInstance {
  windowId: string;
  appId: string;
  title: string;
  icon: string;
  launchArgs?: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  restoreBounds?: { x: number; y: number; width: number; height: number };
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  isFocused: boolean;
  isResizable: boolean;
  isMaximizable: boolean;
  minWidth: number;
  minHeight: number;
}

interface WindowState {
  windows: WindowInstance[];
  nextZIndex: number;
  startMenuOpen: boolean;
  
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  
  launchApp: (appId: string, launchArgs?: Record<string, unknown>) => string | null;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
}

const CASCADE_OFFSET = 26;

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  nextZIndex: 100,
  startMenuOpen: false,

  toggleStartMenu: () => set((s) => ({ startMenuOpen: !s.startMenuOpen })),
  closeStartMenu: () => set({ startMenuOpen: false }),

  launchApp: (appId, launchArgs) => {
    const appDef = appRegistry[appId];
    if (!appDef) {
      console.error(`Unknown appId: ${appId}`);
      return null;
    }

    const state = get();
    
    // Check single instance
    if (appDef.singleInstance) {
      const existing = state.windows.find(w => w.appId === appId);
      if (existing) {
        state.restoreWindow(existing.windowId);
        state.focusWindow(existing.windowId);
        return existing.windowId;
      }
    }

    // Cascade positioning
    const { windows, nextZIndex } = state;
    
    // Simple cascade: offset by CASCADE_OFFSET from the default x/y, 
    // wrapping back around if we spawn too many.
    const cascadeCount = windows.length;
    let x = appDef.defaultWindow.x ?? (50 + (cascadeCount * CASCADE_OFFSET) % 200);
    let y = appDef.defaultWindow.y ?? (50 + (cascadeCount * CASCADE_OFFSET) % 200);

    const windowId = `${appId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    const newWindow: WindowInstance = {
      windowId,
      appId,
      title: appDef.title,
      icon: appDef.icon,
      launchArgs,
      position: { x, y },
      size: { width: appDef.defaultWindow.width, height: appDef.defaultWindow.height },
      zIndex: nextZIndex,
      state: 'normal',
      isFocused: true,
      isResizable: appDef.defaultWindow.resizable,
      isMaximizable: appDef.defaultWindow.maximizable,
      minWidth: appDef.defaultWindow.minWidth ?? 200,
      minHeight: appDef.defaultWindow.minHeight ?? 150,
    };

    set((s) => ({
      windows: s.windows.map(w => ({ ...w, isFocused: false })).concat(newWindow),
      nextZIndex: s.nextZIndex + 1,
    }));

    return windowId;
  },

  closeWindow: (windowId) => {
    set((s) => {
      const remaining = s.windows.filter(w => w.windowId !== windowId);
      // Auto-focus top-most window
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
        if (topWindow.state !== 'minimized') {
          return { windows: remaining.map(w => w.windowId === topWindow.windowId ? { ...w, isFocused: true } : w) };
        }
      }
      return { windows: remaining };
    });
  },

  focusWindow: (windowId) => {
    set((s) => {
      const win = s.windows.find(w => w.windowId === windowId);
      if (!win) return s;
      if (win.isFocused && win.zIndex === s.nextZIndex - 1) return s; // already focused and on top
      
      const newZ = s.nextZIndex;
      return {
        windows: s.windows.map(w => ({
          ...w,
          isFocused: w.windowId === windowId,
          zIndex: w.windowId === windowId ? newZ : w.zIndex,
        })),
        nextZIndex: newZ + 1,
      };
    });
  },

  minimizeWindow: (windowId) => {
    set((s) => ({
      windows: s.windows.map(w => 
        w.windowId === windowId 
          ? { ...w, state: 'minimized', isFocused: false } 
          : w
      )
    }));
  },

  maximizeWindow: (windowId) => {
    set((s) => ({
      windows: s.windows.map(w => {
        if (w.windowId !== windowId) return w;
        if (!w.isMaximizable) return w;
        
        return {
          ...w,
          state: 'maximized',
          restoreBounds: { x: w.position.x, y: w.position.y, width: w.size.width, height: w.size.height },
          isFocused: true,
          zIndex: s.nextZIndex,
        };
      }),
      nextZIndex: s.nextZIndex + 1,
    }));
  },

  restoreWindow: (windowId) => {
    set((s) => ({
      windows: s.windows.map(w => {
        if (w.windowId !== windowId) return w;
        
        return {
          ...w,
          state: 'normal',
          position: w.restoreBounds ? { x: w.restoreBounds.x, y: w.restoreBounds.y } : w.position,
          size: w.restoreBounds ? { width: w.restoreBounds.width, height: w.restoreBounds.height } : w.size,
          isFocused: true,
          zIndex: s.nextZIndex,
        };
      }),
      nextZIndex: s.nextZIndex + 1,
    }));
  },

  updateWindowPosition: (windowId, position) => {
    set((s) => ({
      windows: s.windows.map(w => 
        w.windowId === windowId && w.state === 'normal' 
          ? { ...w, position } 
          : w
      )
    }));
  },

  updateWindowSize: (windowId, size) => {
    set((s) => ({
      windows: s.windows.map(w => 
        w.windowId === windowId && w.state === 'normal'
          ? { ...w, size } 
          : w
      )
    }));
  },
}));
