import { useEffect, useRef, useState } from 'react';
import { BootController } from './boot/BootController';
import { useSystemStore } from './stores/system-store';
import { useWindowStore } from './stores/window-store';
import { Desktop } from './shell/desktop/Desktop';
import { WindowManager } from './shell/window/WindowManager';
import { Taskbar } from './shell/taskbar/Taskbar';
import { audioManager } from './audio/audio-manager';
import { BSOD } from './shell/bsod/BSOD';
import { ShutdownScreen } from './shell/ShutdownScreen';
import { AssetRegistry } from './assets/registry';

function App() {
  const systemStatus = useSystemStore(state => state.systemStatus);
  const setSystemStatus = useSystemStore(state => state.setSystemStatus);
  const brightness = useSystemStore(state => state.brightness);
  const closeAllWindows = useWindowStore(state => state.closeAllWindows);
  const darkenOpacity = 0.95 - (brightness / 100) * 0.95;
  const hasAutoOpened = useRef(false);

  // Check if initial viewport is mobile-sized
  const [showMobileWarning, setShowMobileWarning] = useState(() => window.innerWidth < 768);

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
            // Auto-open Navigation Guide on first login of this browser session
            if (!hasAutoOpened.current) {
              hasAutoOpened.current = true;
              setTimeout(() => {
                useWindowStore.getState().launchApp('navigation-guide');
              }, 800); // Small delay so the desktop renders first
            }
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

      {systemStatus === 'shutting-down' && (
        <ShutdownScreen />
      )}

      {brightness < 100 && (
        <div 
          className="fixed inset-0 bg-black pointer-events-none z-[9999] transition-opacity duration-150"
          style={{ opacity: darkenOpacity }}
        />
      )}

      {showMobileWarning && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-[#ece9d8] border border-[#0055ea] shadow-xl w-full max-w-[320px] overflow-hidden rounded-t-md font-[Tahoma] text-black select-none">
            <div className="bg-gradient-to-r from-[#0058e6] to-[#3a93ff] text-white px-2 py-1 font-bold text-[13px] flex items-center justify-between">
              <span>System Notice</span>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <img src={AssetRegistry.XP_ERROR_ICON} alt="Warning" className="w-10 h-10 mb-4" />
              <div className="text-[13px] mb-1 font-bold">Under development</div>
              <div className="text-[13px] mb-6">This app is not optimized for Mobile view yet</div>
              <div className="flex gap-4 w-full justify-center">
                <button 
                  className="px-4 py-1 min-w-[70px] bg-[#ece9d8] border-2 border-white shadow-[1px_1px_0px_#000,_inset_-1px_-1px_0px_#aca899] active:shadow-[inset_1px_1px_1px_#000] focus:outline-1 focus:outline-dotted focus:outline-black text-[12px]"
                  onClick={() => window.location.href = 'about:blank'}
                >
                  ok
                </button>
                <button 
                  className="px-4 py-1 bg-[#ece9d8] border-2 border-white shadow-[1px_1px_0px_#000,_inset_-1px_-1px_0px_#aca899] active:shadow-[inset_1px_1px_1px_#000] focus:outline-1 focus:outline-dotted focus:outline-black text-[12px]"
                  onClick={() => setShowMobileWarning(false)}
                >
                  proceed anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
