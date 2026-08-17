import BootGif from '../../assets/Logo/windows_xp_boot_screen_animation_in_hd_by_lukeinatordude_db6dw1k.gif';
import WindowsLogoSmall from '../../assets/Logo/WindowsLogo-small.png';
import BlissWallpaper from '../../assets/Wallpapers/Windows XP/Desktop/Bliss.bmp';

// Standard XP Icons mapping
import IcoMyComputer from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON16_1.ico';
import IcoRecycleEmpty from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON32_1.ico';
import IcoRecycleFull from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON33_1.ico';
import IcoFolder from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON4_1.ico';
import IcoFolderOpen from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON5_1.ico';
import IcoControlPanel from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON22_1.ico';
import IcoInternet from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON14_1.ico'; // Network/World
import IcoTextDoc from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON2_1.ico'; // Generic text doc
import IcoCmd from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON37_1.ico'; // Placeholder for CMD (since cmd.exe is missing)
import IcoError from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON138_1.ico'; // Placeholder for Error (user32.dll missing)
import IcoGame from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON44_1.ico'; // Star icon for games

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
  XP_FOLDER_ICON: IcoFolder,
  XP_FOLDER_OPEN_ICON: IcoFolderOpen,
  XP_CONTROL_PANEL_ICON: IcoControlPanel,
  XP_INTERNET_ICON: IcoInternet,
  XP_NOTEPAD_ICON: IcoTextDoc,
  XP_COMMAND_PROMPT_ICON: IcoCmd,
  XP_ERROR_ICON: IcoError,
  XP_GAME_ICON: IcoGame,
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
