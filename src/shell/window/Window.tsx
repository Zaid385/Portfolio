import { useWindowStore, type WindowInstance } from '../../stores/window-store';
import { FileExplorer } from '../../apps/file-explorer/FileExplorer';

export function Window({ win }: { win: WindowInstance }) {
  const store = useWindowStore();
  
  if (win.state === 'minimized') return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    store.focusWindow(win.windowId);
    
    if ((e.target as HTMLElement).closest('button')) return;
    if (win.state === 'maximized') return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...win.position };

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      store.updateWindowPosition(win.windowId, {
        x: startPos.x + dx,
        y: Math.max(0, startPos.y + dy) 
      });
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const style: React.CSSProperties = {
    zIndex: win.zIndex,
    ...(win.state === 'maximized' ? {
      top: 0,
      left: 0,
      width: '100%',
      height: 'calc(100% - 40px)',
    } : {
      top: win.position.y,
      left: win.position.x,
      width: win.size.width,
      height: win.size.height,
    })
  };

  return (
    <div 
      className={`absolute flex flex-col bg-[#ece9d8] border rounded-t-md overflow-hidden shadow-[2px_2px_10px_rgba(0,0,0,0.5)]
        ${win.isFocused ? 'border-[#003399]' : 'border-[#6582c5]'}
      `}
      style={style}
      onMouseDown={() => store.focusWindow(win.windowId)}
    >
      <div 
        className={`flex items-center justify-between px-1 py-[3px] cursor-default select-none
          ${win.isFocused ? 'bg-gradient-to-r from-[#0058e6] via-[#3a93ff] to-[#0058e6] text-white' : 'bg-gradient-to-r from-[#7a96df] via-[#9db9f5] to-[#7a96df] text-gray-200'}
        `}
        onPointerDown={handlePointerDown}
      >
        <div className="flex items-center overflow-hidden h-5">
          <img src={win.icon} className="w-4 h-4 mx-1 object-contain pointer-events-none" alt="" />
          <span className="font-bold text-[13px] tracking-wide truncate pr-2" style={{ textShadow: win.isFocused ? '1px 1px 1px rgba(0,0,0,0.7)' : 'none' }}>
            {win.title}
          </span>
        </div>
        
        <div className="flex space-x-[2px] shrink-0 mr-[2px]">
          <button 
            className="w-[21px] h-[21px] bg-[#d3e5fa] hover:bg-[#b0cff7] border border-white rounded-[2px] flex items-start justify-center text-black font-bold shadow-sm"
            onClick={() => store.minimizeWindow(win.windowId)}
          ><span className="relative -top-1">_</span></button>
          
          <button 
            className={`w-[21px] h-[21px] bg-[#d3e5fa] hover:bg-[#b0cff7] border border-white rounded-[2px] flex items-center justify-center text-black font-bold shadow-sm ${!win.isMaximizable ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (!win.isMaximizable) return;
              if (win.state === 'maximized') store.restoreWindow(win.windowId);
              else store.maximizeWindow(win.windowId);
            }}
          >
            <span className="text-[10px]">{win.state === 'maximized' ? '❐' : '□'}</span>
          </button>
          
          <button 
            className="w-[21px] h-[21px] bg-[#e8664b] hover:bg-[#f08570] text-white border border-white rounded-[2px] flex items-center justify-center font-bold shadow-sm"
            onClick={() => store.closeWindow(win.windowId)}
          >×</button>
        </div>
      </div>
      
      <div className="flex-1 bg-white border-t border-[#003399] overflow-auto relative m-[2px]">
        {win.appId === 'file-explorer' ? (
          <FileExplorer initialNodeId={win.launchArgs?.initialPath as string | undefined} windowId={win.windowId} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
             <h2 className="text-xl font-bold mb-2 text-gray-600">{win.appId}</h2>
             <p className="text-sm">App Content Placeholder</p>
             {win.launchArgs && <pre className="mt-4 text-xs text-left bg-gray-100 p-2 rounded">{JSON.stringify(win.launchArgs, null, 2)}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}
