import { AssetRegistry } from '../assets/registry';

export interface StartMenuEntry {
  id: string;
  label: string;
  icon: string;
  appId?: string;
  launchArgs?: Record<string, unknown>;
  children?: StartMenuEntry[];
  column: 'left' | 'right';
  order: number;
}

export const startMenuConfig: StartMenuEntry[] = [
  {
    id: 'sm-cmd',
    label: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    appId: 'command-prompt',
    column: 'left',
    order: 0,
  },
  {
    id: 'sm-notepad',
    label: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    appId: 'navigation-guide',
    column: 'left',
    order: 1,
  },
  {
    id: 'sm-my-computer',
    label: 'My Computer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    appId: 'file-explorer',
    column: 'right',
    order: 0,
  },
  {
    id: 'sm-recycle-bin',
    label: 'Recycle Bin',
    icon: AssetRegistry.XP_RECYCLE_BIN_ICON_EMPTY,
    appId: 'recycle-bin',
    column: 'right',
    order: 1,
  }
];
