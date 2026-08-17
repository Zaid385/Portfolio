import { useEffect, useState } from 'react';
import { useSystemStore } from '../../stores/system-store';
import { audioManager } from '../../audio/audio-manager';

export function BSOD() {
  const triggerRestart = useSystemStore(state => state.triggerRestart);
  const crashError = useSystemStore(state => state.crashError);
  const [dumpProgress, setDumpProgress] = useState(0);

  useEffect(() => {
    audioManager.play('bsod-trigger');
    
    // Simulate memory dump progress
    const interval = setInterval(() => {
      setDumpProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => triggerRestart(), 1000);
          return 100;
        }
        return p + Math.floor(Math.random() * 5) + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [triggerRestart]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0000AA] text-white p-8 md:p-16 font-['Lucida_Console',_'Courier_New',_monospace] text-[15px] sm:text-[18px] leading-tight select-none cursor-none flex flex-col items-start overflow-hidden">
      
      <p className="mb-6 max-w-4xl">
        A problem has been detected and Windows has been shut down to prevent damage to your computer.
      </p>

      {crashError && (
        <p className="mb-6 max-w-4xl font-bold uppercase">
          {crashError}
        </p>
      )}

      <p className="mb-6 max-w-4xl">
        If this is the first time you've seen this Stop error screen,
        restart your computer. If this screen appears again, follow
        these steps:
      </p>

      <p className="mb-6 max-w-4xl">
        Check to make sure any new hardware or software is properly installed.
        If this is a new installation, ask your hardware or software manufacturer
        for any Windows updates you might need.
      </p>

      <p className="mb-8 max-w-4xl">
        If problems continue, disable or remove any newly installed hardware
        or software. Disable BIOS memory options such as caching or shadowing.
        If you need to use Safe Mode to remove or disable components, restart
        your computer, press F8 to select Advanced Startup Options, and then
        select Safe Mode.
      </p>

      <p className="mb-6">
        Technical information:
      </p>

      <p className="mb-8 font-bold">
        *** STOP: 0x000000D1 (0x0000000C,0x00000002,0x00000000,0xF86B5A89)
      </p>

      <p className="mb-6 font-bold">
        *** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GV3.sys - Address F86B5A89 base at F86B5000, DateStamp 3dd991eb
      </p>

      <p className="mb-2">
        Beginning dump of physical memory
      </p>
      <p className="mb-6">
        Physical memory dump complete.
      </p>
      <p>
        Contact your system administrator or technical support group for further assistance.
      </p>

      <div className="absolute bottom-10 left-8 md:left-16">
        Dumping physical memory to disk: {Math.min(100, dumpProgress)}
      </div>

    </div>
  );
}
