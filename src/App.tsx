import { useState } from 'react';
import { BootController } from './boot/BootController';
import { Desktop } from './shell/desktop/Desktop';
import { WindowManager } from './shell/window/WindowManager';

function App() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <div className="w-full h-[100dvh] bg-black text-white overflow-hidden relative">
      {!bootComplete && (
        <BootController onBootComplete={() => setBootComplete(true)} />
      )}
      
      {bootComplete && (
        <div className="w-full h-full xp-fade-in relative z-0">
          <Desktop />
          <WindowManager />
        </div>
      )}
    </div>
  );
}

export default App;
