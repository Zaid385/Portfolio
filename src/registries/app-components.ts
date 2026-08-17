import type { ComponentType } from 'react';
import { FileExplorer } from '../apps/file-explorer/FileExplorer';
import { Notepad } from '../apps/notepad/Notepad';
import { EditableNotepad } from '../apps/notepad/EditableNotepad';
import { CommandPrompt } from '../apps/command-prompt/CommandPrompt';
import { ControlPanel } from '../apps/control-panel/ControlPanel';
import { Browser } from '../apps/browser/Browser';
import { SocialApp } from '../apps/social/SocialApp';
import { ProjectApp } from '../apps/project-viewer/ProjectApp';
import { Snake } from '../apps/snake/Snake';
import { Minesweeper } from '../apps/minesweeper/Minesweeper';
import { DoomApp } from '../apps/doom/DoomApp';
import { ErrorDialog } from '../apps/error-dialog/ErrorDialog';
import { IframeApp } from '../apps/iframe-app/IframeApp';

export const appComponents: Record<string, ComponentType<any>> = {
  'file-explorer': FileExplorer,
  'navigation-guide': Notepad,
  'notepad': EditableNotepad,
  'command-prompt': CommandPrompt,
  'control-panel': ControlPanel,
  'browser': Browser,
  'social-viewer': SocialApp,
  'project-viewer': ProjectApp,
  'snake': Snake,
  'minesweeper': Minesweeper,
  'doom': DoomApp,
  'error-dialog': ErrorDialog,
  'iframe-app': IframeApp,
};
