interface NotepadProps {
  windowId: string;
  launchArgs?: Record<string, unknown>;
}

const GUIDE_TEXT = `═══════════════════════════════════════════════════
  WELCOME
═══════════════════════════════════════════════════

Hey! Welcome to my portfolio.

Yes — this entire website is a simulated Windows XP
computer. Everything you see IS the portfolio.
The desktop, the apps, the files — it's all real
(well, simulated-real).

Here's how to get around:


───── DESKTOP ICONS ─────

Double-click any icon to open it.
Single-click to select. Click away to deselect.


───── START MENU ─────

Click the green "start" button in the bottom-left.
You'll find shortcuts to all my apps, projects,
socials, and system tools.


───── TASKBAR ─────

Open windows appear here. Click them to switch
between apps, minimize, or restore.


───── MY COMPUTER ─────

Browse the virtual filesystem. You'll find:

  C:\\Projects\\     → My development projects
  C:\\Social\\       → LinkedIn, GitHub, Gmail
  C:\\Users\\Zaid\\   → Documents, Resume, this guide
  C:\\Games\\        → Snake, Minesweeper, DOOM
  C:\\Recycle Bin\\     → ...don't open secret_project.exe


───── PROJECTS ─────

My projects are installed as apps on this computer.
Find Reson, AudioFlow, and others on the desktop
or through My Computer → Projects.


───── COMMAND PROMPT ─────

A fully working simulated terminal. Try commands
like dir, cd, help, and open to navigate the
filesystem and launch apps from the command line.


───── GAMES ─────

Need a break? Snake, Minesweeper, and a fully
playable DOOM are all here. Yes, actual DOOM.


───── ABOUT ME ─────

Open "About Me.txt" on the desktop or in
My Computer → Documents for my full profile,
skills, education, and project details.


───── WINDOW MANAGEMENT ─────

Drag title bars to move windows. Resize from
edges and corners. Minimize, maximize, restore,
and close — just like the real thing.


───── KEYBOARD NAVIGATION ─────

Tab, Enter, Space, and Arrow keys all work.
Alt+F4 closes the focused window.


───── EASTER EGGS ─────

There are hidden surprises scattered around.
Explore the Recycle Bin. Try the Command Prompt.
But seriously — do NOT run secret_project.exe.

You've been warned.


═══════════════════════════════════════════════════
  Enjoy exploring!
═══════════════════════════════════════════════════`;

export function Notepad({ windowId: _windowId, launchArgs }: NotepadProps) {
  const content = (launchArgs?.initialContent as string) || GUIDE_TEXT;

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
          {content}
        </div>
      </div>
    </div>
  );
}
