import { useEffect } from 'react';
import { BootController } from './boot/BootController';
import { useSystemStore } from './stores/system-store';
import { useWindowStore } from './stores/window-store';
import { Desktop } from './shell/desktop/Desktop';
import { WindowManager } from './shell/window/WindowManager';
import { Taskbar } from './shell/taskbar/Taskbar';
import { audioManager } from './audio/audio-manager';
import { BSOD } from './shell/bsod/BSOD';

function App() {
  const systemStatus = useSystemStore(state => state.systemStatus);
  const setSystemStatus = useSystemStore(state => state.setSystemStatus);
  const brightness = useSystemStore(state => state.brightness);
  const closeAllWindows = useWindowStore(state => state.closeAllWindows);
  const darkenOpacity = 0.95 - (brightness / 100) * 0.95;

  useEffect(() => {
    if (systemStatus === 'restarting') {
      closeAllWindows();
    }
  }, [systemStatus, closeAllWindows]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        const activeWindow = useWindowStore.getState().windows.find(w => w.isFocused);
        if (activeWindow) {
          useWindowStore.getState().closeWindow(activeWindow.windowId);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="w-full h-[100dvh] bg-black text-white overflow-hidden relative">
      {(systemStatus === 'booting' || systemStatus === 'restarting') && (
        <BootController 
          key={systemStatus} // Force remount if restarting
          onBootComplete={() => {
            setSystemStatus('normal');
            audioManager.play('startup');
          }} 
        />
      )}
      
      {systemStatus === 'normal' && (
        <div className="w-full h-full xp-fade-in relative z-0">
          <Desktop />
          <WindowManager />
          <Taskbar />
        </div>
      )}

      {systemStatus === 'crashed' && (
        <BSOD />
      )}

      {brightness < 100 && (
        <div 
          className="fixed inset-0 bg-black pointer-events-none z-[9999] transition-opacity duration-150"
          style={{ opacity: darkenOpacity }}
        />
      )}
    </div>
  );
}

export default App;
