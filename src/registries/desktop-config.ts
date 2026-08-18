import { AssetRegistry } from '../assets/registry';
import { resumeData } from '../content/resume';
import { aboutMeText } from '../content/about-me';

export interface DesktopIconConfig {
  id: string;
  label: string;
  icon: string;
  appId: string;
  launchArgs?: Record<string, unknown>;
  order: number;
}

export const desktopConfig: DesktopIconConfig[] = [
  {
    id: 'desktop-my-computer',
    label: 'My Computer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    appId: 'file-explorer',
    order: 0,
  },
  {
    id: 'desktop-recycle-bin',
    label: 'Recycle Bin',
    icon: AssetRegistry.XP_RECYCLE_BIN_ICON_EMPTY,
    appId: 'file-explorer',
    launchArgs: { initialPath: 'recycled-dir' },
    order: 1,
  },
  {
    id: 'desktop-notepad',
    label: 'Navigation guide.txt',
    icon: AssetRegistry.ICON_NAVIGATION,
    appId: 'navigation-guide',
    order: 2,
  },
  {
    id: 'desktop-about-me',
    label: 'About Me.txt',
    icon: AssetRegistry.ICON_ABOUT_ME,
    appId: 'about-me',
    launchArgs: { initialContent: aboutMeText },
    order: 2.5,
  },
  {
    id: 'desktop-notepad-editable',
    label: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    appId: 'notepad',
    order: 3,
  },
  {
    id: 'desktop-resume',
    label: 'Resume.pdf',
    icon: AssetRegistry.ICON_RESUME,
    appId: 'external-link',
    launchArgs: { url: resumeData.documentAsset },
    order: 3.5,
  },
  {
    id: 'desktop-cmd',
    label: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    appId: 'command-prompt',
    order: 4,
  },
  {
    id: 'desktop-browser',
    label: 'Internet Explorer',
    icon: AssetRegistry.XP_INTERNET_ICON,
    appId: 'browser',
    order: 5,
  },
  {
    id: 'desktop-linkedin',
    label: 'LinkedIn',
    icon: AssetRegistry.ICON_LINKEDIN,
    appId: 'external-link',
    launchArgs: { url: 'https://www.linkedin.com/in/zaid-asaad' },
    order: 6,
  },
  {
    id: 'desktop-github',
    label: 'GitHub',
    icon: AssetRegistry.ICON_GITHUB,
    appId: 'external-link',
    launchArgs: { url: 'https://github.com/Zaid385' },
    order: 7,
  },
  {
    id: 'desktop-gmail',
    label: 'Gmail',
    icon: AssetRegistry.ICON_GMAIL,
    appId: 'external-link',
    launchArgs: { url: 'https://mail.google.com/mail/?view=cm&fs=1&to=zaidasaad385@gmail.com' },
    order: 8,
  },
  {
    id: 'desktop-project-1',
    label: 'Audioflow',
    icon: AssetRegistry.ICON_AUDIOFLOW,
    appId: 'iframe-app',
    launchArgs: { url: 'https://audioflow-4pg4.onrender.com' },
    order: 8,
  },
  {
    id: 'desktop-project-2',
    label: 'Reson',
    icon: AssetRegistry.ICON_RESON,
    appId: 'iframe-app',
    launchArgs: { url: 'https://reson-4nav.onrender.com' },
    order: 9,
  },
  {
    id: 'desktop-snake',
    label: 'Snake',
    icon: AssetRegistry.ICON_SNAKE,
    appId: 'snake',
    order: 9,
  },
  {
    id: 'desktop-minesweeper',
    label: 'Minesweeper',
    icon: AssetRegistry.ICON_MINESWEEPER,
    appId: 'minesweeper',
    order: 10,
  },
  {
    id: 'desktop-doom',
    label: 'DOOM',
    icon: AssetRegistry.ICON_DOOM,
    appId: 'doom',
    order: 11,
  }
];
