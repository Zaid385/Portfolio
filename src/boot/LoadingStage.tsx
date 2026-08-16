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
    <div className="w-full h-full bg-black flex flex-col justify-center items-center relative overflow-hidden">
      <div className="flex flex-col items-center justify-center space-y-24 w-full px-4">
        
        <div className="flex flex-col items-center">
          <div className="flex items-end relative pt-12 sm:pt-16 pr-8">
            <img 
              src={AssetRegistry.XP_BOOT_LOGO} 
              alt="Windows Logo" 
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain absolute top-0 right-0 sm:-right-4"
            />
            <div className="flex flex-col items-start relative z-10">
              <span className="text-white text-lg sm:text-2xl tracking-wide ml-1">Microsoft<sup className="text-[0.6em] ml-[2px]">®</sup></span>
              <span className="text-white text-5xl sm:text-7xl font-bold tracking-tighter flex items-start leading-none">
                Windows<sup className="text-[0.4em] font-normal tracking-normal mt-1 sm:mt-2 ml-1">®</sup>
              </span>
            </div>
            <span className="text-[#eb6c2e] text-4xl sm:text-5xl font-bold ml-1 sm:ml-2 mb-0 sm:mb-1 tracking-tighter relative z-10">xp</span>
          </div>
        </div>

        <div className="xp-boot-bar-container">
          <div className="xp-boot-bar-blocks">
            <div className="xp-boot-bar-block"></div>
            <div className="xp-boot-bar-block"></div>
            <div className="xp-boot-bar-block"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-8 text-left text-[#5a7edc] font-sans text-sm sm:text-xl">
        <p>Copyright © Made with love, loads of coffee and all nighters :)</p>
      </div>
    </div>
  );
}
