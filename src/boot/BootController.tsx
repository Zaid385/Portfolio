import { useState } from 'react';
import { BiosStage } from './BiosStage';
import { LoadingStage } from './LoadingStage';

type BootState = 'BIOS' | 'LOADING' | 'DONE';

export function BootController({ onBootComplete }: { onBootComplete: () => void }) {
  const [bootState, setBootState] = useState<BootState>('BIOS');

  if (bootState === 'DONE') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 w-full h-[100dvh] bg-black cursor-none overflow-hidden m-0 p-0">
      {bootState === 'BIOS' && (
        <BiosStage onComplete={() => setBootState('LOADING')} />
      )}
      {bootState === 'LOADING' && (
        <LoadingStage onComplete={() => {
           setBootState('DONE');
           onBootComplete();
        }} />
      )}
    </div>
  );
}
