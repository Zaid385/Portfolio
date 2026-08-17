import { socialData, userData } from '../../content';

interface SocialAppProps {
  windowId: string;
  socialId?: string;
}

export function SocialApp({ windowId: _windowId, socialId }: SocialAppProps) {
  const record = socialData.find(s => s.id === socialId);

  if (!record) {
    return (
      <div className="flex w-full h-full bg-white items-center justify-center text-black font-['Tahoma'] p-4">
        <div className="flex flex-col items-center max-w-sm text-center">
          <span className="text-4xl mb-4">❌</span>
          <h2 className="font-bold text-lg text-red-600 mb-2">Social Profile Not Found</h2>
          <p className="text-sm">The requested social profile '{socialId}' could not be located in the content registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#ece9d8] font-['Tahoma'] text-black select-none">
      {/* App Header/Toolbar */}
      <div className="flex items-center p-3 border-b border-[#a0a0a0] bg-gradient-to-b from-[#f2f2f2] to-[#d4d0c8]">
        <img src={record.icon} alt={record.label} className="w-8 h-8 mr-4 drop-shadow-md" />
        <div className="flex-1">
          <h2 className="text-lg font-bold leading-tight">{userData.name} on {record.label}</h2>
          <p className="text-xs text-gray-600 mt-[2px]">{record.description}</p>
        </div>
        <button 
          onClick={() => window.open(record.url, '_blank', 'noopener,noreferrer')}
          className="ml-4 px-4 py-2 bg-white border border-[#003c74] rounded hover:bg-[#c1d2ee] active:bg-[#98b4e2] shadow-[1px_1px_2px_rgba(0,0,0,0.2)] font-bold text-[#003c74] whitespace-nowrap flex items-center space-x-2"
        >
          <span>Open Website</span>
          <span className="text-xl leading-none">↗</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative border-t border-white overflow-hidden">
        {record.embeddable ? (
          <iframe 
            src={record.url} 
            className="w-full h-full border-none"
            title={`${record.label} Profile`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
            <div className="bg-white border border-gray-300 shadow-md p-8 rounded-lg max-w-md flex flex-col items-center">
              <img src={record.icon} alt={record.label} className="w-16 h-16 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">{record.label} Security Policy</h3>
              <p className="text-sm text-gray-600 mb-6">
                {record.label} prevents its pages from being embedded inside other websites to protect user security.
              </p>
              <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
              <p className="text-sm font-bold text-gray-700 mb-4">
                You can view my full profile by opening it in a new browser tab.
              </p>
              <button 
                onClick={() => window.open(record.url, '_blank', 'noopener,noreferrer')}
                className="px-6 py-2 bg-[#0ea0ed] text-white font-bold rounded shadow hover:bg-[#33b8fb] active:bg-[#003399]"
              >
                Launch {record.label}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
