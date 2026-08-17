import BootGif from '../../assets/Logo/windows_xp_boot_screen_animation_in_hd_by_lukeinatordude_db6dw1k.gif';
import WindowsLogoSmall from '../../assets/Logo/WindowsLogo-small.png';
import BlissWallpaper from '../../assets/Wallpapers/Windows XP/Desktop/Bliss.bmp';

// Standard XP Icons mapping (using placeholders until we map the extracted .ico names)
import Icon1 from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON31_1.ico';
import Icon2 from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON20_1.ico';
import Icon3 from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON28_1.ico';
import Icon4 from '../../assets/Icons/Windows XP/ico/shell32.dll/ICON37_1.ico';

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
  XP_MY_COMPUTER_ICON: Icon1,
  XP_RECYCLE_BIN_ICON_EMPTY: Icon2,
  XP_NOTEPAD_ICON: Icon3,
  XP_COMMAND_PROMPT_ICON: Icon4,
  XP_INTERNET_ICON: Icon1,
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
