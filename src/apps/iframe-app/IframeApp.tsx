import { useState } from 'react';

interface IframeAppProps {
  windowId: string;
  launchArgs?: Record<string, unknown>;
}

export function IframeApp({ windowId: _windowId, launchArgs }: IframeAppProps) {
  const url = (launchArgs?.url as string) || '';
  const [loading, setLoading] = useState(true);

  if (!url) {
    return (
      <div className="flex w-full h-full bg-white items-center justify-center text-black font-['Tahoma'] p-4 text-center">
        <p>No URL provided for this application.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-white relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-gray-500 flex flex-col items-center">
            <span className="text-4xl mb-2">⌛</span>
            <span>Loading App...</span>
          </div>
        </div>
      )}
      <iframe 
        src={url} 
        className="w-full h-full border-none"
        title="App Content"
        onLoad={() => setLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
