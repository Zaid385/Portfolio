import { useState } from 'react';
import { BootController } from './boot/BootController';

function App() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {!bootComplete && (
        <BootController onBootComplete={() => setBootComplete(true)} />
      )}
      
      {bootComplete && (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 xp-fade-in bg-blue-900">
          <h1 className="text-3xl font-bold">Desktop Placeholder</h1>
          <p>Phase 1 Complete: Boot Sequence finished!</p>
        </div>
      )}
    </div>
  );
}

export default App;
