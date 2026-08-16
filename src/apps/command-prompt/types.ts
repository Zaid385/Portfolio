import type { VirtualFilesystem } from '../../registries/virtual-fs';

export interface CommandContext {
  cwd: string;
  setCwd: (path: string) => void;
  fs: VirtualFilesystem;
  history: string[];
  print: (line: string | string[]) => void;
  clearScreen: () => void;
  launchApp: (appId: string, args?: Record<string, unknown>) => void;
}

export interface CommandResult {
  output?: string | string[];
  error?: string;
}

export interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  hidden?: boolean;
  execute: (args: string[], ctx: CommandContext) => CommandResult | void;
}
