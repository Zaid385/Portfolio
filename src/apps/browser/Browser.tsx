import { useState } from 'react';
import type { FormEvent } from 'react';

// Basic URL validation
const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return str.includes('.') && !str.includes(' ');
  }
};

const formatUrl = (str: string) => {
  if (isUrl(str)) {
    return str.startsWith('http') ? str : `https://${str}`;
  }
  // Google search with iframe workaround param
  return `https://www.google.com/search?q=${encodeURIComponent(str)}&igu=1`;
};

interface BrowserProps {
  windowId: string;
}

export function Browser({ windowId: _windowId }: BrowserProps) {
  const [history, setHistory] = useState<string[]>(['https://www.google.com/webhp?igu=1']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [addressBar, setAddressBar] = useState('https://www.google.com/webhp?igu=1');
  const [loading, setLoading] = useState(false);

  const currentUrl = history[historyIndex];

  const navigate = (url: string) => {
    const formatted = formatUrl(url);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formatted);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setAddressBar(formatted);
  };

  const handleGo = (e?: FormEvent) => {
    e?.preventDefault();
    if (addressBar.trim()) {
      navigate(addressBar);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAddressBar(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAddressBar(history[historyIndex + 1]);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const isInternal = currentUrl.startsWith(window.location.origin) || currentUrl.startsWith('/');
  
  return (
    <div className="flex flex-col w-full h-full bg-[#ece9d8] font-['Tahoma'] text-black select-none">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-1 border-b border-[#a0a0a0] bg-[#ece9d8]">
        <button 
          onClick={handleBack} 
          disabled={historyIndex === 0} 
          className="p-1 px-2 disabled:opacity-50 hover:bg-[#c1d2ee] active:bg-[#98b4e2] rounded border border-transparent hover:border-[#316ac5]"
          title="Back"
        >
          <span className="text-xl font-bold text-green-600">←</span>
        </button>
        <button 
          onClick={handleForward} 
          disabled={historyIndex === history.length - 1} 
          className="p-1 px-2 disabled:opacity-50 hover:bg-[#c1d2ee] active:bg-[#98b4e2] rounded border border-transparent hover:border-[#316ac5]"
          title="Forward"
        >
          <span className="text-xl font-bold text-green-600">→</span>
        </button>
        <button 
          onClick={handleRefresh} 
          className="p-1 px-2 hover:bg-[#c1d2ee] active:bg-[#98b4e2] rounded border border-transparent hover:border-[#316ac5]"
          title="Refresh"
        >
          <span className="text-xl font-bold text-blue-600">↻</span>
        </button>
        
        <div className="w-[1px] h-6 bg-gray-400 mx-1"></div>

        <form onSubmit={handleGo} className="flex-1 flex items-center ml-2 space-x-1">
          <span className="text-sm text-gray-600 px-1">Address</span>
          <div className="flex-1 flex border border-[#7f9db9] bg-white h-[22px] overflow-hidden">
             <input 
              type="text" 
              className="flex-1 px-2 py-0 outline-none text-sm leading-none"
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <button 
            type="submit" 
            className="px-2 h-[22px] bg-[#ece9d8] hover:bg-[#c1d2ee] active:bg-[#98b4e2] rounded flex items-center justify-center border border-transparent hover:border-[#316ac5]"
          >
            <span className="text-green-600 text-xs mr-1">►</span> <span className="text-sm">Go</span>
          </button>
        </form>
      </div>
      
      {/* Fallback Banner for External Sites */}
      {!isInternal && (
        <div className="bg-[#ffffe1] border-b border-[#716f64] p-1 px-3 text-xs flex justify-between items-center shrink-0 shadow-sm z-10">
          <div className="flex items-center">
            <span className="text-yellow-600 font-bold mr-2">⚠</span>
            <span>If this page refuses to connect due to security policies, you can open it externally.</span>
          </div>
          <button 
            onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
            className="px-3 py-[2px] bg-[#ece9d8] border border-[#716f64] rounded hover:bg-[#c1d2ee] active:bg-[#98b4e2] shadow-[1px_1px_0_white_inset] whitespace-nowrap ml-4"
          >
            Open in New Tab ↗
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-gray-500 flex flex-col items-center">
              <span className="text-4xl mb-2">⌛</span>
              <span>Loading...</span>
            </div>
          </div>
        ) : (
          <iframe 
            key={currentUrl}
            src={currentUrl} 
            className="w-full h-full border-none"
            title="Browser Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
}
