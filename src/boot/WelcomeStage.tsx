import { useState, useEffect } from 'react';
import { userData } from '../content';
import { AssetRegistry } from '../assets/registry';
import { audioManager } from '../audio/audio-manager';
import { useSystemStore } from '../stores/system-store';

export function WelcomeStage({ onComplete }: { onComplete: () => void }) {
  const [loggingIn, setLoggingIn] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const setSystemStatus = useSystemStore(state => state.setSystemStatus);

  useEffect(() => {
    // Only play menu command sound when interacting
  }, []);

  const handleLogin = () => {
    if (loggingIn) return;
    setLoggingIn(true);
    audioManager.play('click'); // Click sound

    // XP logon sound usually plays as the desktop appears, App.tsx plays it on boot complete.
    // We will just let App.tsx handle it, or we can play it here and remove it from App.tsx.
    // The instructions say "Optionally play the appropriate XP logon sound through AudioManager" when transitioning.
    
    // Simulate brief transition
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 500); // fade out duration
    }, 1500); // login loading duration
  };

  const handleTurnOff = () => {
    audioManager.play('shutdown');
    setSystemStatus('shutting-down');
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div 
      className={`fixed inset-0 w-full h-full flex flex-col font-['Tahoma',_sans-serif] select-none
        ${fadingOut ? (prefersReducedMotion ? '' : 'transition-opacity duration-500 opacity-0') : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(to bottom, #003399 0%, #2562d9 50%, #003399 100%)',
        cursor: 'default'
      }}
    >
      {/* Top Band */}
      <div className="h-[80px] w-full bg-[#002b80] border-b-2 border-[#3d7add] shadow-md flex items-center justify-end px-10 relative">
        <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <div className="w-full max-w-[900px] h-full flex flex-row items-center px-10">
          
          {/* Left Side: Branding & Instructions */}
          <div className="flex-1 flex flex-col items-end pr-10 text-right">
            <div className="flex items-center gap-4 mb-8 mr-4">
              <img src={AssetRegistry.XP_BOOT_LOGO} alt="Windows XP Logo" className="w-[80px] h-[80px] drop-shadow-lg" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }} />
              <div className="flex flex-col text-left">
                <span className="text-white text-4xl font-bold italic" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Microsoft</span>
                <span className="text-white text-5xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Windows<span className="text-[#ff6b00]">XP</span></span>
              </div>
            </div>
            {!loggingIn && (
              <h2 className="text-white text-xl pr-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                To begin, click your user name
              </h2>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-[60%] bg-gradient-to-b from-transparent via-white/50 to-transparent mx-4 shadow-[1px_0_1px_rgba(0,0,0,0.3)]"></div>

          {/* Right Side: Account Tile */}
          <div className="flex-1 flex flex-col items-start pl-10">
            <button
              onClick={handleLogin}
              className={`group flex items-center gap-4 p-4 rounded-lg transition-all duration-200 outline-none
                ${loggingIn ? 'bg-transparent' : 'hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-white/50'}`}
              aria-label={`Log in as ${userData.name}`}
            >
              <div className={`w-[70px] h-[70px] rounded bg-white p-1 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] border border-[#a0a0a0] overflow-hidden transition-transform ${loggingIn ? '' : 'group-hover:scale-105 group-focus:scale-105'}`}>
                <img 
                  src={AssetRegistry.PROFILE_PIC || AssetRegistry.XP_MY_COMPUTER_ICON} 
                  alt={userData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white text-2xl drop-shadow-md" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  {userData.name}
                </span>
                {!loggingIn && (
                  <>
                    <span className="text-white/70 text-sm mt-0.5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                      {userData.title}
                    </span>
                    <span className="text-white/50 text-xs mt-1 italic">
                      My Portfolio Computer
                    </span>
                  </>
                )}
                {loggingIn && (
                  <span className="text-white/80 text-sm italic mt-1">
                    Loading your personal settings...
                  </span>
                )}
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Band */}
      <div className="h-[100px] w-full bg-[#002b80] border-t-2 border-[#3d7add] shadow-[0_-2px_5px_rgba(0,0,0,0.3)] flex items-center justify-between px-10 relative">
        <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} />
        
        <div className="relative z-10">
          {!loggingIn && (
            <button
              onClick={handleTurnOff}
              className="flex items-center gap-3 p-2 rounded hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-white/50 outline-none transition-colors"
              aria-label="Turn off computer"
            >
              <div className="w-8 h-8 rounded bg-[#d32f2f] flex items-center justify-center border-2 border-white shadow-md">
                <div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent transform -rotate-45" />
              </div>
              <span className="text-white text-lg drop-shadow-md">Turn off computer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
