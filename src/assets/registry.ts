import BootGif from '../../assets/Logo/windows_xp_boot_screen_animation_in_hd_by_lukeinatordude_db6dw1k.gif';
import WindowsLogoSmall from '../../assets/Logo/WindowsLogo-small.png';
import BlissWallpaper from '../../assets/Wallpapers/Windows XP/Desktop/Bliss.bmp';

// Standard XP Icons mapping
import IcoMyComputer from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON16_1.ico';
import IcoRecycleEmpty from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON32_1.ico';
import IcoRecycleFull from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON33_1.ico';
import IcoError from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON138_1.ico'; // Placeholder for Error (user32.dll missing)
import ProfilePic from '../../assets/Profile/banana-leclerc.png';

// Sounds
import SndStartup from '../../assets/Sounds/Windows XP/Windows XP Startup.wav';
import SndError from '../../assets/Sounds/Windows XP/Windows XP Error.wav';
import SndNotify from '../../assets/Sounds/Windows XP/Windows XP Notify.wav';
import SndStart from '../../assets/Sounds/Windows XP/Windows XP Start.wav';
import SndMenuCommand from '../../assets/Sounds/Windows XP/Windows XP Menu Command.wav';
import SndRecycle from '../../assets/Sounds/Windows XP/Windows XP Recycle.wav';
import SndCriticalStop from '../../assets/Sounds/Windows XP/Windows XP Critical Stop.wav';
import SndMinimize from '../../assets/Sounds/Windows XP/Windows XP Minimize.wav';

export const AssetRegistry = {
  XP_BOOT_LOADING_BAR: BootGif,
  XP_BOOT_LOGO: WindowsLogoSmall,
  XP_BLISS_WALLPAPER: BlissWallpaper,
  XP_MY_COMPUTER_ICON: IcoMyComputer,
  XP_RECYCLE_BIN_ICON_EMPTY: IcoRecycleEmpty,
  XP_RECYCLE_BIN_ICON_FULL: IcoRecycleFull,
  XP_FOLDER_ICON: '/assets/Folder_Open.png',
  XP_FOLDER_OPEN_ICON: '/assets/Folder_Open.png',
  XP_CONTROL_PANEL_ICON: '/assets/Control_Panel.png',
  XP_INTERNET_ICON: '/assets/Browser_Internet.png',
  XP_NOTEPAD_ICON: '/assets/Notepad.png',
  XP_COMMAND_PROMPT_ICON: '/assets/Command Prompt.ico',
  XP_ERROR_ICON: IcoError,
  XP_GAME_ICON: '/assets/pngwing.com.png',
  
  // Custom specific icons
  ICON_SNAKE: '/assets/snake.png',
  ICON_DOOM: '/assets/Doom.png',
  ICON_MINESWEEPER: '/assets/pngwing.com.png',
  ICON_RESUME: '/assets/resume.ico',
  ICON_GITHUB: '/assets/GitHub_Invertocat_Black.svg',
  ICON_LINKEDIN: '/assets/LI-In-Bug.png',
  ICON_NAVIGATION: '/assets/navigation-guide.ico',
  ICON_RESON: '/assets/Reson-logo.svg',
  ICON_AUDIOFLOW: '/assets/AudioFLow_icon_green.svg',
  ICON_WIFI: '/assets/wifi.png',
  ICON_BLUETOOTH: '/assets/bluetooth.png',
  ICON_DRIVE: '/assets/Drive_HardDisk.png',
  ICON_DOCUMENT: '/assets/File_Document.png',
  PROFILE_PIC: ProfilePic,

  // Sounds
  SND_STARTUP: SndStartup,
  SND_ERROR: SndError,
  SND_NOTIFY: SndNotify,
  SND_START: SndStart,
  SND_MENU_COMMAND: SndMenuCommand,
  SND_RECYCLE: SndRecycle,
  SND_CRITICAL_STOP: SndCriticalStop,
  SND_MINIMIZE: SndMinimize,
};
