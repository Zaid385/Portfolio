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
    id: 'sm-browser',
    label: 'Internet',
    icon: AssetRegistry.XP_INTERNET_ICON,
    appId: 'browser',
    column: 'left',
    order: 0,
  },
  {
    id: 'sm-cmd',
    label: 'Command Prompt',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    appId: 'command-prompt',
    column: 'left',
    order: 1,
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
    id: 'sm-notepad-editable',
    label: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    appId: 'notepad',
    column: 'left',
    order: 2,
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
  },
  {
    id: 'sm-control-panel',
    label: 'Control Panel',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON, // Using computer icon as placeholder
    appId: 'control-panel',
    column: 'right',
    order: 2,
  },
  {
    id: 'sm-socials-folder',
    label: 'Social Profiles',
    icon: AssetRegistry.XP_INTERNET_ICON, // Directory icon usually, use internet for now
    column: 'right',
    order: 3,
    children: [
      {
        id: 'sm-social-linkedin',
        label: 'LinkedIn',
        icon: AssetRegistry.XP_INTERNET_ICON,
        appId: 'social-viewer',
        launchArgs: { socialId: 'linkedin' },
        column: 'right',
        order: 0,
      },
      {
        id: 'sm-social-github',
        label: 'GitHub',
        icon: AssetRegistry.XP_INTERNET_ICON,
        appId: 'social-viewer',
        launchArgs: { socialId: 'github' },
        column: 'right',
        order: 1,
      }
    ]
  },
  {
    id: 'sm-projects-folder',
    label: 'Projects',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    column: 'right',
    order: 4,
    children: [
      {
        id: 'sm-project-1',
        label: 'Audioflow',
        icon: AssetRegistry.XP_MY_COMPUTER_ICON,
        appId: 'project-viewer',
        launchArgs: { projectId: 'placeholder-project-1' },
        column: 'right',
        order: 0,
      }
    ]
  },
  {
    id: 'sm-games-folder',
    label: 'Games',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    column: 'right',
    order: 5,
    children: [
      {
        id: 'sm-game-snake',
        label: 'Snake',
        icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
        appId: 'snake',
        column: 'right',
        order: 0,
      },
      {
        id: 'sm-game-minesweeper',
        label: 'Minesweeper',
        icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
        appId: 'minesweeper',
        column: 'right',
        order: 1,
      }
    ]
  }
];
