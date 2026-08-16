import { useWindowStore } from '../../stores/window-store';
import { AssetRegistry } from '../../assets/registry';
import { useState, useEffect } from 'react';
import { StartMenu } from './StartMenu';

export function Taskbar() {
  const windows = useWindowStore(state => state.windows);
  const focusWindow = useWindowStore(state => state.focusWindow);
  const minimizeWindow = useWindowStore(state => state.minimizeWindow);
  const restoreWindow = useWindowStore(state => state.restoreWindow);
  const toggleStartMenu = useWindowStore(state => state.toggleStartMenu);
  const startMenuOpen = useWindowStore(state => state.startMenuOpen);
  
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StartMenu />
      <div className="absolute bottom-0 left-0 right-0 h-[40px] z-[9999] flex text-white select-none bg-gradient-to-b from-[#245edb] via-[#3f8cf3] to-[#245edb] border-t border-[#003399]">
        {/* Start Button */}
        <button 
          className={`flex items-center h-full px-4 lg:px-6 hover:brightness-110 active:brightness-90 rounded-r-[14px] font-bold text-xl sm:text-2xl italic tracking-wide shadow-[inset_1px_1px_2px_rgba(255,255,255,0.6)] ${
            startMenuOpen 
              ? 'bg-gradient-to-b from-[#2a7a37] to-[#1e5a26] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)]' 
              : 'bg-gradient-to-b from-[#3b9c4f] to-[#2a7a37]'
          }`}
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
          onClick={toggleStartMenu}
        >
          <img src={AssetRegistry.XP_BOOT_LOGO} alt="Start" className="w-6 h-6 sm:w-7 sm:h-7 mr-2 drop-shadow-md pointer-events-none" />
          start
        </button>

      {/* Task Buttons Area */}
      <div className="flex-1 flex items-center px-2 space-x-1 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none' }}>
        {windows.map(win => {
          const isActive = win.isFocused && win.state !== 'minimized';
          return (
            <button
              key={win.windowId}
              className={`flex items-center max-w-[180px] flex-1 h-[32px] px-2 rounded-[3px] border ${
                isActive 
                  ? 'bg-gradient-to-b from-[#1b439c] to-[#3a75d7] border-[#102b63] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-gray-100'
                  : 'bg-gradient-to-b from-[#3c81f3] to-[#245edb] border-[#102b63] hover:brightness-110 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] text-white'
              }`}
              onClick={() => {
                if (isActive) {
                  minimizeWindow(win.windowId);
                } else {
                  if (win.state === 'minimized') {
                    restoreWindow(win.windowId);
                  } else {
                    focusWindow(win.windowId);
                  }
                }
              }}
            >
              <img src={win.icon} className="w-5 h-5 mr-2 object-contain pointer-events-none shrink-0" alt="" />
              <span className="truncate text-sm tracking-wider pointer-events-none">{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray Placeholder */}
      <div className="flex items-center h-full px-4 bg-gradient-to-b from-[#0e5bcc] to-[#127ef6] border-l border-[#0e4ba7] shadow-[inset_1px_0_1px_rgba(255,255,255,0.3)] min-w-[90px] justify-end shrink-0">
        <span className="text-sm font-normal text-white">{time}</span>
      </div>
    </div>
    </>
  );
}
