import { useEffect } from 'react';
import { useWindowStore } from '../../stores/window-store';
import { startMenuConfig } from '../../registries/start-menu-config';
import { AssetRegistry } from '../../assets/registry';

export function StartMenu() {
  const { startMenuOpen, closeStartMenu, launchApp } = useWindowStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && startMenuOpen) {
        closeStartMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startMenuOpen, closeStartMenu]);

  if (!startMenuOpen) return null;

  const leftEntries = startMenuConfig.filter(e => e.column === 'left').sort((a, b) => a.order - b.order);
  const rightEntries = startMenuConfig.filter(e => e.column === 'right').sort((a, b) => a.order - b.order);

  const handleLaunch = (appId?: string, launchArgs?: Record<string, unknown>) => {
    if (appId) {
      launchApp(appId, launchArgs);
      closeStartMenu();
    }
  };

  return (
    <>
      {/* Invisible overlay to catch outside clicks */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={closeStartMenu}
        onContextMenu={(e) => { e.preventDefault(); closeStartMenu(); }}
      />
      
      {/* Start Menu Container */}
      <div className="absolute bottom-[40px] left-0 w-[380px] bg-white rounded-tr-lg border-2 border-[#003399] flex flex-col shadow-[2px_2px_10px_rgba(0,0,0,0.5)] z-[9999] select-none text-black overflow-hidden">
        
        {/* Header */}
        <div className="h-[60px] bg-gradient-to-r from-[#245edb] to-[#003399] border-b-2 border-white flex items-center px-2">
          <div className="w-12 h-12 rounded-[5px] border-[2px] border-[#95b2ee] p-[2px] flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <img src={AssetRegistry.PROFILE_PIC} className="w-full h-full object-cover rounded-[3px]" alt="Zaid" />
          </div>
          <span className="ml-3 text-white font-bold text-xl drop-shadow-md">Zaid</span>
        </div>

        {/* Columns */}
        <div className="flex h-[380px]">
          {/* Left Column (White) */}
          <div className="flex-1 bg-white flex flex-col py-2 px-1">
            {leftEntries.map(entry => (
              <button 
                key={entry.id}
                className="flex items-center px-2 py-2 hover:bg-[#2f71cd] hover:text-white rounded-sm w-full text-left"
                onClick={() => handleLaunch(entry.appId, entry.launchArgs)}
              >
                <img src={entry.icon} className="w-8 h-8 mr-2 object-contain pointer-events-none" alt="" />
                <span className="text-sm font-semibold pointer-events-none">{entry.label}</span>
              </button>
            ))}
          </div>

          {/* Vertical Separator */}
          <div className="w-[1px] bg-gradient-to-b from-transparent via-[#d3e5fa] to-transparent" />

          {/* Right Column (Light Blue) */}
          <div className="w-[160px] bg-[#d3e5fa] border-l border-white flex flex-col py-2 px-1">
            {rightEntries.map(entry => (
              <button 
                key={entry.id}
                className="flex items-center px-2 py-2 hover:bg-[#2f71cd] hover:text-white rounded-sm w-full text-left"
                onClick={() => handleLaunch(entry.appId, entry.launchArgs)}
              >
                <img src={entry.icon} className="w-6 h-6 mr-2 object-contain pointer-events-none" alt="" />
                <span className="text-sm font-bold text-[#003399] pointer-events-none">{entry.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="h-[40px] bg-gradient-to-r from-[#245edb] to-[#003399] flex justify-end items-center px-3 border-t-2 border-white">
           <div className="flex items-center space-x-2">
             <button className="flex items-center text-white text-xs hover:brightness-110 cursor-default">
               <div className="w-6 h-6 bg-[#e8664b] rounded-[3px] mr-1 border border-white flex items-center justify-center font-bold shadow-sm">⏻</div>
               Turn Off Computer
             </button>
           </div>
        </div>
      </div>
    </>
  );
}
