interface NotepadProps {
  windowId: string;
}

const GUIDE_TEXT = `Welcome to my Portfolio OS!

Here's a quick guide on how to navigate this simulated Windows XP environment:

• DESKTOP ICONS: 
Just like the real deal. Single-click to select, click away to deselect.

• DOUBLE-CLICKING ITEMS:
To open applications or folders, double-click the icons on the Desktop or inside My Computer.

• START MENU:
Click the classic green "start" button in the bottom left corner to access quick shortcuts and system commands. 

• TASKBAR:
Open windows will appear here. Click them to minimize, restore, or bring them into focus.

• MY COMPUTER (FILE EXPLORER):
Browse the virtual filesystem to find my projects, resume, and social links. The file system is completely simulated but responds to native XP behaviors like 'Up', 'Back', and 'Forward'.

• OPENING APPLICATIONS:
Double-click a file and it will open in the appropriate viewer (e.g. PDF viewer, Browser, Project viewer).

• WINDOW MANAGEMENT:
You can drag windows by their title bars, minimize/maximize them, and resize them freely by dragging the edges and corners!

• COMMAND PROMPT:
A fully functional simulated terminal. Navigate the filesystem, read files, and execute simulated programs!

• GAMES:
Looking for a break? Play Snake, Minesweeper, or even DOOM, fully integrated into the OS!

• ACCESSIBILITY:
Use Tab, Enter, Spacebar, and Arrow keys to navigate the desktop, file explorer, and menus without a mouse.

• EXPLORATION & EASTER EGGS:
There are hidden surprises in the system. Check the Recycle Bin... but whatever you do, do NOT run secret_project.exe!`;

export function Notepad({ windowId: _windowId }: NotepadProps) {
  // Read-only notepad viewer for the Navigation Guide
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
      <div className="flex-1 overflow-auto p-1 bg-white">
        <div 
          role="document"
          tabIndex={0}
          aria-label="Read-only text editor"
          className="w-full h-full p-1 focus:outline-none whitespace-pre-wrap font-['Lucida_Console',_monospace] text-[13px] leading-relaxed cursor-text select-text"
        >
          {GUIDE_TEXT}
        </div>
      </div>
    </div>
  );
}
