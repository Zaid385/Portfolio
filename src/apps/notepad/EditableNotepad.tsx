import { useState } from 'react';

interface EditableNotepadProps {
  windowId: string;
}

export function EditableNotepad({ windowId: _windowId }: EditableNotepadProps) {
  const [content, setContent] = useState('');
  
  return (
    <div className="flex flex-col w-full h-full bg-white text-black text-[13px] font-['Tahoma',_sans-serif]">
      {/* Menu Bar */}
      <div className="flex items-center px-1 py-[2px] bg-[#ece9d8] border-b border-[#d4d0c8] select-none text-xs">
        <div className="px-2 py-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-[2px]">File</div>
        <div className="px-2 py-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-[2px]">Edit</div>
        <div className="px-2 py-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-[2px]">Format</div>
        <div className="px-2 py-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-[2px]">View</div>
        <div className="px-2 py-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-[2px]">Help</div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-0 bg-white">
        <textarea 
          aria-label="Text editor"
          className="w-full h-full p-1 focus:outline-none resize-none font-['Lucida_Console',_monospace] text-[13px] leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
