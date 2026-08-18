import { AssetRegistry } from '../assets/registry';
import { aboutMeText } from '../content/about-me';

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
    label: 'Navigation guide',
    icon: AssetRegistry.ICON_NAVIGATION,
    appId: 'navigation-guide',
    column: 'left',
    order: 2,
  },
  {
    id: 'sm-about-me',
    label: 'About Me',
    icon: AssetRegistry.ICON_ABOUT_ME,
    appId: 'about-me',
    launchArgs: { initialContent: aboutMeText },
    column: 'left',
    order: 2.5,
  },
  {
    id: 'sm-notepad-editable',
    label: 'Notepad',
    icon: AssetRegistry.XP_NOTEPAD_ICON,
    appId: 'notepad',
    column: 'left',
    order: 3,
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
    appId: 'file-explorer',
    launchArgs: { initialPath: 'recycled-dir' },
    column: 'right',
    order: 1,
  },
  {
    id: 'sm-control-panel',
    label: 'Control Panel',
    icon: AssetRegistry.XP_CONTROL_PANEL_ICON,
    appId: 'control-panel',
    column: 'right',
    order: 2,
  },
  {
    id: 'sm-linkedin',
    label: 'LinkedIn',
    icon: AssetRegistry.ICON_LINKEDIN,
    appId: 'external-link',
    launchArgs: { url: 'https://www.linkedin.com/in/zaid-asaad' },
    column: 'right',
    order: 3,
  },
  {
    id: 'sm-github',
    label: 'GitHub',
    icon: AssetRegistry.ICON_GITHUB,
    appId: 'external-link',
    launchArgs: { url: 'https://github.com/Zaid385' },
    column: 'right',
    order: 4,
  },
  {
    id: 'sm-gmail',
    label: 'Gmail',
    icon: AssetRegistry.ICON_GMAIL,
    appId: 'external-link',
    launchArgs: { url: 'https://mail.google.com/mail/?view=cm&fs=1&to=zaidasaad385@gmail.com' },
    column: 'right',
    order: 5,
  },
  {
    id: 'sm-project-1',
    label: 'Audioflow',
    icon: AssetRegistry.ICON_AUDIOFLOW,
    appId: 'iframe-app',
    launchArgs: { url: 'https://audioflow-4pg4.onrender.com' },
    column: 'right',
    order: 5,
  },
  {
    id: 'sm-project-2',
    label: 'Reson',
    icon: AssetRegistry.ICON_RESON,
    appId: 'iframe-app',
    launchArgs: { url: 'https://reson-4nav.onrender.com' },
    column: 'right',
    order: 6,
  },
  {
    id: 'sm-games-folder',
    label: 'Games',
    icon: AssetRegistry.XP_FOLDER_ICON,
    column: 'right',
    order: 5,
    children: [
      {
        id: 'sm-game-snake',
        label: 'Snake',
        icon: AssetRegistry.ICON_SNAKE,
        appId: 'snake',
        column: 'right',
        order: 0,
      },
      {
        id: 'sm-game-minesweeper',
        label: 'Minesweeper',
        icon: AssetRegistry.ICON_MINESWEEPER,
        appId: 'minesweeper',
        column: 'right',
        order: 1,
      },
      {
        id: 'sm-game-doom',
        label: 'DOOM',
        icon: AssetRegistry.ICON_DOOM,
        appId: 'doom',
        column: 'right',
        order: 2,
      }
    ]
  }
];
