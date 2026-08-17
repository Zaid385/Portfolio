import { useRef, useEffect, useState } from 'react';

interface DoomAppProps {
  windowId: string;
  isFocused?: boolean;
  isMinimized?: boolean;
}

export function DoomApp({ isFocused, isMinimized }: DoomAppProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const doc = iframeRef.current.contentWindow.document;
        // Inject CSS to force the canvas to fit within the viewport and maintain aspect ratio
        const style = doc.createElement('style');
        style.textContent = `
          body, html { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important; 
            height: 100% !important; 
            overflow: hidden !important; 
            background-color: black !important; 
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          canvas {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: fill !important;
            outline: none !important;
            box-shadow: none !important;
          }
          /* Hide emscripten default output elements if they are visible */
          .emscripten_border, #status, #output, #spinner {
            display: none !important;
          }
        `;
        doc.head.appendChild(style);
      } catch (e) {
        console.error("Could not inject styles into DOOM iframe", e);
      }
    }
  };

  // When focused, try to automatically give the iframe focus
  useEffect(() => {
    if (isFocused && !isMinimized && iframeRef.current) {
      // Focus the iframe so keyboard events go to the game
      iframeRef.current.focus();
    }
  }, [isFocused, isMinimized]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none">
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 text-white font-['Tahoma']">
          <div className="text-xl font-bold mb-4 animate-pulse text-red-600">Initializing DOOM Engine...</div>
          <div className="w-48 h-2 bg-gray-800 rounded overflow-hidden border border-gray-600">
            <div className="w-full h-full bg-red-600 origin-left animate-pulse" />
          </div>
        </div>
      )}

      {/* 
        When the window is NOT focused, we place an invisible overlay over the iframe.
        This prevents the iframe from stealing mouse events or hover states, 
        and allows the first click to properly focus the window via WindowManager. 
      */}
      {!isFocused && !isMinimized && (
        <div className="absolute inset-0 z-10 cursor-default" />
      )}

      {/* 
        When minimized, we can optionally hide the iframe entirely or just leave it. 
        Display 'none' is already handled by the Window.tsx shell, but we ensure it here too.
      */}
      <iframe
        ref={iframeRef}
        src="/assets/doom.html"
        className="w-full h-full border-none outline-none block"
        style={{ display: isMinimized ? 'none' : 'block', backgroundColor: 'black' }}
        onLoad={handleIframeLoad}
        title="DOOM Engine"
        sandbox="allow-scripts allow-same-origin"
        scrolling="no"
      />
    </div>
  );
}
