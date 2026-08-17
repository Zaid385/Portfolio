import { useEffect } from 'react';
import { useSystemStore } from '../stores/system-store';

export function ShutdownScreen() {
  const setSystemStatus = useSystemStore(state => state.setSystemStatus);

  useEffect(() => {
    // Wait for 4 seconds, then "power off" and return to booting
    const timer = setTimeout(() => {
      setSystemStatus('booting');
    }, 4000); // Increased timeout to 4s to let the sound finish
    return () => clearTimeout(timer);
  }, [setSystemStatus]);

  return (
    <div 
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center font-['Tahoma',_sans-serif] select-none opacity-100"
      style={{
        background: 'linear-gradient(to bottom, #003399 0%, #2562d9 50%, #003399 100%)',
        cursor: 'default'
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-[80px] h-[80px] border-4 border-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-[40px] h-[40px] border-4 border-white rounded-full border-t-transparent animate-spin" />
        </div>
        <span className="text-white text-2xl font-bold drop-shadow-md">
          Windows is shutting down...
        </span>
      </div>
    </div>
  );
}
