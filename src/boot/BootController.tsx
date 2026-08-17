import { useState } from 'react';
import { BiosStage } from './BiosStage';
import { LoadingStage } from './LoadingStage';
import { WelcomeStage } from './WelcomeStage';

type BootState = 'BIOS' | 'LOADING' | 'WELCOME' | 'DONE';

export function BootController({ onBootComplete }: { onBootComplete: () => void }) {
  const [bootState, setBootState] = useState<BootState>('BIOS');

  if (bootState === 'DONE') {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 w-full h-[100dvh] bg-black overflow-hidden m-0 p-0 ${bootState === 'WELCOME' ? '' : 'cursor-none'}`}>
      {bootState === 'BIOS' && (
        <BiosStage onComplete={() => setBootState('LOADING')} />
      )}
      {bootState === 'LOADING' && (
        <LoadingStage onComplete={() => setBootState('WELCOME')} />
      )}
      {bootState === 'WELCOME' && (
        <WelcomeStage onComplete={() => {
           setBootState('DONE');
           onBootComplete();
        }} />
      )}
    </div>
  );
}
