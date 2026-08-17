import BootGif from '../../assets/Logo/windows_xp_boot_screen_animation_in_hd_by_lukeinatordude_db6dw1k.gif';
import WindowsLogoSmall from '../../assets/Logo/WindowsLogo-small.png';
import BlissWallpaper from '../../assets/Wallpapers/Windows XP/Desktop/Bliss.bmp';

// Standard XP Icons mapping
import IcoMyComputer from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON16_1.ico';
import IcoRecycleEmpty from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON32_1.ico';
import IcoRecycleFull from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON33_1.ico';
import IcoError from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON138_1.ico';

import ProfilePic from '../../assets/Profile/banana-leclerc.png';

// Custom icons
import IcoFolder from '../../assets/icons-named/Folder_Open.png';
import IcoControlPanel from '../../assets/icons-named/Control_Panel.png';
import IcoInternet from '../../assets/icons-named/Browser_Internet.png';
import IcoTextDoc from '../../assets/icons-named/File_Document.png';
import IcoCmd from '../../assets/icons-named/Command Prompt.ico';
import IcoGame from '../../assets/icons-named/pngwing.com.png';
import IcoSnake from '../../assets/icons-named/snake.png';
import IcoDoom from '../../assets/icons-named/Doom.png';
import IcoResume from '../../assets/icons-named/resume.ico';
import IcoGitHub from '../../assets/icons-named/GitHub_Invertocat_Black.svg';
import IcoLinkedIn from '../../assets/icons-named/LI-In-Bug.png';
import IcoNav from '../../assets/icons-named/navigation-guide.ico';
import IcoReson from '../../assets/icons-named/Reson-logo.svg';
import IcoAudioflow from '../../assets/icons-named/AudioFLow_icon_green.svg';
import IcoWifi from '../../assets/icons-named/wifi.png';
import IcoBluetooth from '../../assets/icons-named/bluetooth.png';
import IcoDrive from '../../assets/icons-named/Drive_HardDisk.png';
import IcoGmail from '../../assets/icons-named/gmail.png';

// Sounds
import SndStartup from '../../assets/Sounds/Windows XP/Windows XP Startup.wav';
import SndError from '../../assets/Sounds/Windows XP/Windows XP Error.wav';
import SndNotify from '../../assets/Sounds/Windows XP/Windows XP Notify.wav';
import SndStart from '../../assets/Sounds/Windows XP/Windows XP Start.wav';
import SndMenuCommand from '../../assets/Sounds/Windows XP/Windows XP Menu Command.wav';
import SndRecycle from '../../assets/Sounds/Windows XP/Windows XP Recycle.wav';
import SndCriticalStop from '../../assets/Sounds/Windows XP/Windows XP Critical Stop.wav';
import SndMinimize from '../../assets/Sounds/Windows XP/Windows XP Minimize.wav';
import SndShutdown from '../../assets/Sounds/Windows XP/Windows XP Shutdown.mp3';

export const AssetRegistry = {
  XP_BOOT_LOADING_BAR: BootGif,
  XP_BOOT_LOGO: WindowsLogoSmall,
  XP_BLISS_WALLPAPER: BlissWallpaper,
  XP_MY_COMPUTER_ICON: IcoMyComputer,
  XP_RECYCLE_BIN_ICON_EMPTY: IcoRecycleEmpty,
  XP_RECYCLE_BIN_ICON_FULL: IcoRecycleFull,
  XP_FOLDER_ICON: IcoFolder,
  XP_FOLDER_OPEN_ICON: IcoFolder,
  XP_CONTROL_PANEL_ICON: IcoControlPanel,
  XP_INTERNET_ICON: IcoInternet,
  XP_NOTEPAD_ICON: IcoTextDoc,
  XP_COMMAND_PROMPT_ICON: IcoCmd,
  XP_ERROR_ICON: IcoError,
  XP_GAME_ICON: IcoGame,
  
  // Custom specific icons
  ICON_SNAKE: IcoSnake,
  ICON_DOOM: IcoDoom,
  ICON_MINESWEEPER: IcoGame,
  ICON_RESUME: IcoResume,
  ICON_GITHUB: IcoGitHub,
  ICON_LINKEDIN: IcoLinkedIn,
  ICON_NAVIGATION: IcoNav,
  ICON_RESON: IcoReson,
  ICON_AUDIOFLOW: IcoAudioflow,
  ICON_WIFI: IcoWifi,
  ICON_BLUETOOTH: IcoBluetooth,
  ICON_DRIVE: IcoDrive,
  ICON_DOCUMENT: IcoTextDoc,
  ICON_GMAIL: IcoGmail,
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
  SND_SHUTDOWN: SndShutdown,
};
