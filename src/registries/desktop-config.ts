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
    appId: 'recycle-bin',
    order: 1,
  },
  {
    id: 'desktop-notepad',
    label: 'Navigation guide.txt',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
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
    order: 3,
  }
];
