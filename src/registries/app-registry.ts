import { AssetRegistry } from '../assets/registry';

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  singleInstance: boolean;
  defaultWindow: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    resizable: boolean;
    maximizable: boolean;
    minWidth?: number;
    minHeight?: number;
  };
  category?: 'system' | 'portfolio' | 'game' | 'utility';
}

export const appRegistry: Record<string, AppDefinition> = {
  'file-explorer': {
    id: 'file-explorer',
    title: 'My Computer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    singleInstance: false,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 300, minHeight: 200 },
    category: 'system'
  },
  'recycle-bin': {
    id: 'recycle-bin',
    title: 'Recycle Bin',
    icon: AssetRegistry.XP_RECYCLE_BIN_ICON_EMPTY,
    singleInstance: true,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 300, minHeight: 200 },
    category: 'system'
  },
  'navigation-guide': {
    id: 'navigation-guide',
    title: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    singleInstance: false,
    defaultWindow: { width: 500, height: 450, resizable: true, maximizable: true, minWidth: 200, minHeight: 150 },
    category: 'utility'
  },
  'command-prompt': {
    id: 'command-prompt',
    title: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    singleInstance: false,
    defaultWindow: { width: 660, height: 400, resizable: true, maximizable: true, minWidth: 400, minHeight: 200 },
    category: 'system'
  }
};
