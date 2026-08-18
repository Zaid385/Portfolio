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
  category?: 'system' | 'portfolio' | 'game' | 'utility' | 'internet' | 'project';
}

export const appConfig: Record<string, AppConfig> = {
  'file-explorer': {
    id: 'file-explorer',
    title: 'My Computer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    singleInstance: false,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'system',
  },
  'navigation-guide': {
    id: 'navigation-guide',
    title: 'Navigation guide',
    icon: AssetRegistry.ICON_NAVIGATION,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'utility',
  },
  'about-me': {
    id: 'about-me',
    title: 'About Me',
    icon: AssetRegistry.ICON_ABOUT_ME,
    singleInstance: true,
    defaultWindow: { width: 700, height: 550, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'utility',
  },
  'notepad': {
    id: 'notepad',
    title: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    singleInstance: false,
    defaultWindow: { width: 500, height: 400, resizable: true, maximizable: true, minWidth: 300, minHeight: 200 },
    category: 'utility',
  },
  'command-prompt': {
    id: 'command-prompt',
    title: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    singleInstance: false,
    defaultWindow: { width: 1100, height: 750, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'utility',
  },
  'control-panel': {
    id: 'control-panel',
    title: 'Control Panel',
    icon: AssetRegistry.XP_CONTROL_PANEL_ICON,
    singleInstance: true,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'system',
  },
  'browser': {
    id: 'browser',
    title: 'Internet Explorer',
    icon: AssetRegistry.XP_INTERNET_ICON,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'internet',
  },
  'social-viewer': {
    id: 'social-viewer',
    title: 'Social Profile',
    icon: AssetRegistry.XP_INTERNET_ICON,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'internet',
  },
  'project-viewer': {
    id: 'project-viewer',
    title: 'Project Details',
    icon: AssetRegistry.XP_FOLDER_ICON,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'project',
  },
  'snake': {
    id: 'snake',
    title: 'Snake',
    icon: AssetRegistry.ICON_SNAKE,
    singleInstance: true,
    defaultWindow: { width: 550, height: 600, resizable: true, maximizable: true, minWidth: 350, minHeight: 400 },
    category: 'game',
  },
  'minesweeper': {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: AssetRegistry.ICON_MINESWEEPER,
    singleInstance: true,
    defaultWindow: { width: 520, height: 580, resizable: true, maximizable: true, minWidth: 400, minHeight: 450 },
    category: 'game',
  },
  'doom': {
    id: 'doom',
    title: 'DOOM',
    icon: AssetRegistry.ICON_DOOM,
    singleInstance: true,
    defaultWindow: { width: 640, height: 480, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'game',
  },
  'error-dialog': {
    id: 'error-dialog',
    title: 'System Error',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    singleInstance: false,
    defaultWindow: { width: 350, height: 160, resizable: false, maximizable: false },
    category: 'system',
  },
  'iframe-app': {
    id: 'iframe-app',
    title: 'Application',
    icon: AssetRegistry.XP_INTERNET_ICON,
    singleInstance: false,
    defaultWindow: { width: 800, height: 600, resizable: true, maximizable: true, minWidth: 400, minHeight: 300 },
    category: 'internet',
  }
};
