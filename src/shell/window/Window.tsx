import { useWindowStore, type WindowInstance } from '../../stores/window-store';
import { appComponents } from '../../registries/app-components';

export function Window({ win }: { win: WindowInstance }) {
  const store = useWindowStore();
  const Component = appComponents[win.appId];

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
      
      const newX = startPos.x + dx;
      const newY = startPos.y + dy;
      
      // Ensure the title bar remains accessible
      const maxX = window.innerWidth - 100;
      const minX = -win.size.width + 100;
      const maxY = window.innerHeight - 40; // Above taskbar
      
      store.updateWindowPosition(win.windowId, {
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)) 
      });
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleResizeDown = (e: React.PointerEvent, direction: string) => {
    e.stopPropagation();
    store.focusWindow(win.windowId);
    if (!win.isResizable || win.state === 'maximized') return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...win.position };
    const startSize = { ...win.size };

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newX = startPos.x;
      let newY = startPos.y;
      let newW = startSize.width;
      let newH = startSize.height;

      if (direction.includes('e')) newW += dx;
      if (direction.includes('s')) newH += dy;
      if (direction.includes('w')) {
        newX += dx;
        newW -= dx;
      }
      if (direction.includes('n')) {
        newY += dy;
        newH -= dy;
      }

      // Enforce min width/height
      if (newW < win.minWidth) {
        if (direction.includes('w')) newX -= (win.minWidth - newW);
        newW = win.minWidth;
      }
      if (newH < win.minHeight) {
        if (direction.includes('n')) newY -= (win.minHeight - newH);
        newH = win.minHeight;
      }

      store.updateWindowSize(win.windowId, { width: newW, height: newH });
      store.updateWindowPosition(win.windowId, { x: newX, y: newY });
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
    display: win.state === 'minimized' ? 'none' : 'flex',
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
      role="dialog"
      aria-label={win.title}
      className={`absolute flex flex-col bg-[#ece9d8] border rounded-t-md overflow-hidden shadow-[2px_2px_10px_rgba(0,0,0,0.5)]
        ${win.isFocused ? 'border-[#003399]' : 'border-[#6582c5]'}
        transition-opacity motion-reduce:transition-none
      `}
      style={style}
      onMouseDown={() => store.focusWindow(win.windowId)}
      tabIndex={-1}
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
        
        <div className="flex space-x-[2px] shrink-0 mr-[2px]" aria-label="Window controls">
          <button 
            aria-label="Minimize"
            className="w-[21px] h-[21px] bg-gradient-to-b from-[#286dd4] to-[#1b51ab] hover:brightness-110 border border-white rounded-[3px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-end justify-center pb-[3px]"
            onClick={() => store.minimizeWindow(win.windowId)}
          ><div className="w-[7px] h-[2px] bg-white font-bold drop-shadow-md"></div></button>
          
          <button 
            aria-label={win.state === 'maximized' ? 'Restore Down' : 'Maximize'}
            className={`w-[21px] h-[21px] bg-gradient-to-b from-[#286dd4] to-[#1b51ab] hover:brightness-110 border border-white rounded-[3px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center ${!win.isMaximizable ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (!win.isMaximizable) return;
              if (win.state === 'maximized') store.restoreWindow(win.windowId);
              else store.maximizeWindow(win.windowId);
            }}
          >
            {win.state === 'maximized' ? (
              <div className="relative w-[10px] h-[9px]">
                <div className="absolute top-0 right-0 w-[7px] h-[6px] border-[1.5px] border-white rounded-[1px] drop-shadow-md"></div>
                <div className="absolute bottom-0 left-0 w-[7px] h-[6px] border-[1.5px] border-white rounded-[1px] bg-[#1b51ab] drop-shadow-md"></div>
              </div>
            ) : (
              <div className="w-[10px] h-[9px] border-[1.5px] border-white rounded-[1px] border-t-[2.5px] drop-shadow-md"></div>
            )}
          </button>
          
          <button 
            aria-label="Close"
            className="w-[21px] h-[21px] bg-gradient-to-b from-[#e5533e] to-[#c23624] hover:brightness-110 border border-white rounded-[3px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center"
            onClick={() => store.closeWindow(win.windowId)}
          >
             <div className="text-white font-bold text-[15px] leading-none drop-shadow-md pb-[2px]" aria-hidden="true">×</div>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white border-t border-[#003399] overflow-auto relative m-[2px]">
        {Component ? (
          <Component 
            windowId={win.windowId} 
            initialNodeId={win.launchArgs?.initialPath as string | undefined} 
            launchArgs={win.launchArgs} 
            isFocused={win.isFocused}
            isMinimized={win.state === 'minimized'}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
             <h2 className="text-xl font-bold mb-2 text-gray-600">{win.appId}</h2>
             <p className="text-sm">App Content Placeholder</p>
             {win.launchArgs && <pre className="mt-4 text-xs text-left bg-gray-100 p-2 rounded">{JSON.stringify(win.launchArgs, null, 2)}</pre>}
          </div>
        )}
      </div>

      {win.isResizable && win.state !== 'maximized' && (
        <>
          <div className="absolute top-[-4px] left-[-4px] w-3 h-3 cursor-nwse-resize z-50" onPointerDown={e => handleResizeDown(e, 'nw')} />
          <div className="absolute top-[-4px] right-[-4px] w-3 h-3 cursor-nesw-resize z-50" onPointerDown={e => handleResizeDown(e, 'ne')} />
          <div className="absolute bottom-[-4px] left-[-4px] w-3 h-3 cursor-nesw-resize z-50" onPointerDown={e => handleResizeDown(e, 'sw')} />
          <div className="absolute bottom-[-4px] right-[-4px] w-3 h-3 cursor-nwse-resize z-50" onPointerDown={e => handleResizeDown(e, 'se')} />
          
          <div className="absolute top-[-4px] left-2 right-2 h-2 cursor-ns-resize z-40" onPointerDown={e => handleResizeDown(e, 'n')} />
          <div className="absolute bottom-[-4px] left-2 right-2 h-2 cursor-ns-resize z-40" onPointerDown={e => handleResizeDown(e, 's')} />
          <div className="absolute top-2 bottom-2 left-[-4px] w-2 cursor-ew-resize z-40" onPointerDown={e => handleResizeDown(e, 'w')} />
          <div className="absolute top-2 bottom-2 right-[-4px] w-2 cursor-ew-resize z-40" onPointerDown={e => handleResizeDown(e, 'e')} />
        </>
      )}
    </div>
  );
}
