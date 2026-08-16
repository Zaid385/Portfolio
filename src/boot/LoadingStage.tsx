import { useEffect } from 'react';
import { AssetRegistry } from '../assets/registry';

export function LoadingStage({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    let isCancelled = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MIN_DURATION = prefersReducedMotion ? 500 : 3500;
    
    // Simulate real app readiness gate
    const readinessPromise = Promise.resolve(); 
    
    const start = Date.now();
    readinessPromise.then(() => {
      if (isCancelled) return;
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      setTimeout(() => {
        if (!isCancelled) onComplete();
      }, remaining);
    }).catch((err) => {
      console.error("Boot readiness failed", err);
      // Fallback behavior: still proceed to desktop after timeout
      setTimeout(() => {
         if (!isCancelled) onComplete();
      }, MIN_DURATION);
    });

    return () => {
      isCancelled = true;
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
      <img 
        src={AssetRegistry.XP_BOOT_LOADING_BAR} 
        alt="Windows XP Loading" 
        className="w-full max-w-xl h-auto"
      />
    </div>
  );
}
