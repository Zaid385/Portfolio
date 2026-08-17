import { AssetRegistry } from '../assets/registry';

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
    launchArgs: { initialPath: 'C:\\Recycled' },
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
    id: 'desktop-notepad-editable',
    label: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    appId: 'notepad',
    order: 3,
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
    appId: 'social-viewer',
    launchArgs: { socialId: 'linkedin' },
    order: 6,
  },
  {
    id: 'desktop-github',
    label: 'GitHub',
    icon: AssetRegistry.ICON_GITHUB,
    appId: 'social-viewer',
    launchArgs: { socialId: 'github' },
    order: 7,
  },
  {
    id: 'desktop-project-1',
    label: 'Audioflow',
    icon: AssetRegistry.ICON_AUDIOFLOW,
    appId: 'project-viewer',
    launchArgs: { projectId: 'placeholder-project-1' },
    order: 8,
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
