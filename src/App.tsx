import { useState } from 'react';
import { BootController } from './boot/BootController';
import { useSystemStore } from './stores/system-store';
import { Desktop } from './shell/desktop/Desktop';
import { WindowManager } from './shell/window/WindowManager';
import { Taskbar } from './shell/taskbar/Taskbar';
import { audioManager } from './audio/audio-manager';

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const brightness = useSystemStore(state => state.brightness);
  const darkenOpacity = 0.95 - (brightness / 100) * 0.95;

  return (
    <div className="w-full h-[100dvh] bg-black text-white overflow-hidden relative">
      {!bootComplete && (
        <BootController onBootComplete={() => {
          setBootComplete(true);
          audioManager.play('startup');
        }} />
      )}
      
      {bootComplete && (
        <div className="w-full h-full xp-fade-in relative z-0">
          <Desktop />
          <WindowManager />
          <Taskbar />
        </div>
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
