import type { ComponentType } from 'react';
import { AssetRegistry } from '../assets/registry';

import { FileExplorer } from '../apps/file-explorer/FileExplorer';
import { Notepad } from '../apps/notepad/Notepad';
import { EditableNotepad } from '../apps/notepad/EditableNotepad';
import { CommandPrompt } from '../apps/command-prompt/CommandPrompt';
import { ControlPanel } from '../apps/control-panel/ControlPanel';

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
  component?: ComponentType<any>;
}

export const appRegistry: Record<string, AppDefinition> = {
  'file-explorer': {
    id: 'file-explorer',
    title: 'My Computer',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    singleInstance: false,
    defaultWindow: { width: 600, height: 400, resizable: true, maximizable: true, minWidth: 300, minHeight: 200 },
    category: 'system',
    component: FileExplorer,
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
    component: Notepad,
  },
  'notepad': {
    id: 'notepad',
    title: 'Untitled - Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    singleInstance: false,
    defaultWindow: { width: 500, height: 450, resizable: true, maximizable: true, minWidth: 200, minHeight: 150 },
    category: 'utility',
    component: EditableNotepad,
  },
  'command-prompt': {
    id: 'command-prompt',
    title: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    singleInstance: false,
    defaultWindow: { width: 660, height: 400, resizable: true, maximizable: true, minWidth: 400, minHeight: 200 },
    category: 'system',
    component: CommandPrompt,
  },
  'control-panel': {
    id: 'control-panel',
    title: 'Control Panel',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON, // Using computer icon as placeholder
    singleInstance: true,
    defaultWindow: { width: 700, height: 500, resizable: true, maximizable: true, minWidth: 500, minHeight: 400 },
    category: 'system',
    component: ControlPanel,
  }
};
