import { AssetRegistry } from '../assets/registry';

export interface AppConfig {
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

export const appConfig: Record<string, AppConfig> = {
  'file-explorer': {
    id: 'file-explorer',
    title: 'My Computer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    singleInstance: false,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 300, minHeight: 200 },
    category: 'system',
  },
  'recycle-bin': {
    id: 'recycle-bin',
    title: 'Recycle Bin',
    icon: AssetRegistry.XP_RECYCLE_BIN_ICON_EMPTY,
    singleInstance: true,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 300, minHeight: 200 },
    category: 'system',
  },
  'navigation-guide': {
    id: 'navigation-guide',
    title: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    singleInstance: false,
    defaultWindow: { width: 500, height: 450, resizable: true, maximizable: true, minWidth: 200, minHeight: 150 },
    category: 'utility',
  },
  'notepad': {
    id: 'notepad',
    title: 'Untitled - Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    singleInstance: false,
    defaultWindow: { width: 500, height: 450, resizable: true, maximizable: true, minWidth: 200, minHeight: 150 },
    category: 'utility',
  },
  'command-prompt': {
    id: 'command-prompt',
    title: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    singleInstance: false,
    defaultWindow: { width: 660, height: 400, resizable: true, maximizable: true, minWidth: 400, minHeight: 200 },
    category: 'system',
  },
  'control-panel': {
    id: 'control-panel',
    title: 'Control Panel',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    singleInstance: true,
    defaultWindow: { width: 700, height: 500, resizable: true, maximizable: true, minWidth: 500, minHeight: 400 },
    category: 'system',
  },
  'browser': {
    id: 'browser',
    title: 'Internet Explorer',
    icon: AssetRegistry.XP_INTERNET_ICON,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'utility',
  },
  'social-viewer': {
    id: 'social-viewer',
    title: 'Social Profile',
    icon: AssetRegistry.XP_INTERNET_ICON,
    singleInstance: false,
    defaultWindow: { width: 700, height: 500, resizable: true, maximizable: true, minWidth: 500, minHeight: 400 },
    category: 'portfolio',
  },
  'project-viewer': {
    id: 'project-viewer',
    title: 'Project Viewer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 600, minHeight: 500 },
    category: 'portfolio',
  },
  'snake': {
    id: 'snake',
    title: 'Snake',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    singleInstance: true,
    defaultWindow: { width: 420, height: 480, resizable: false, maximizable: false },
    category: 'game',
  },
  'minesweeper': {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON, // Placeholder until asset mapped
    singleInstance: true,
    defaultWindow: { width: 620, height: 430, resizable: false, maximizable: false },
    category: 'game',
  }
};
