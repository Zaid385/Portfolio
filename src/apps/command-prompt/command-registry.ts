import type { CommandDefinition, CommandContext, CommandResult } from './types';
import { getFsPath, type FsFolderNode } from '../../registries/virtual-fs';
import { userData, projectData, socialData } from '../../content';

const commands: CommandDefinition[] = [];

commands.push({
  name: 'help',
  aliases: ['?'],
  description: 'Lists all available commands.',
  execute: (_args, _ctx) => {
    const lines = ['Available commands:'];
    commands.filter(c => !c.hidden).forEach(c => {
      lines.push(`  ${c.name.padEnd(15)} - ${c.description}`);
    });
    return { output: lines };
  }
});

commands.push({
  name: 'about',
  description: 'Displays a short bio.',
  execute: () => ({ output: userData.summary })
});

commands.push({
  name: 'whoami',
  description: 'Prints current user identity.',
  execute: () => ({ output: `${userData.name} - ${userData.title}` })
});

commands.push({
  name: 'skills',
  description: 'Lists technical skills.',
  execute: () => ({ output: userData.skills.join(', ') })
});

commands.push({
  name: 'projects',
  description: 'Lists portfolio projects.',
  execute: () => ({ output: projectData.map(p => `- ${p.name}: ${p.shortDescription}`) })
});

commands.push({
  name: 'socials',
  description: 'Lists social links.',
  execute: () => ({ output: socialData.map(s => `- ${s.label}: ${s.url}`) })
});

commands.push({
  name: 'games',
  description: 'Lists available games.',
  execute: () => ({ output: 'Available games: Snake, Minesweeper. Type "open <game>" or find it on the Desktop.' })
});

commands.push({
  name: 'echo',
  description: 'Prints the given text.',
  execute: (args) => ({ output: args.join(' ') })
});

commands.push({
  name: 'date',
  description: 'Prints current local date/time.',
  execute: () => ({ output: new Date().toString() })
});

commands.push({
  name: 'pwd',
  description: 'Prints current working directory.',
  execute: (_args, ctx) => ({ output: getFsPath(ctx.cwd) })
});

commands.push({
  name: 'cls',
  aliases: ['clear'],
  description: 'Clears the screen.',
  execute: (_args, ctx) => {
    ctx.clearScreen();
  }
});

commands.push({
  name: 'dir',
  aliases: ['ls'],
  description: 'Lists directory contents.',
  execute: (_args, ctx) => {
    const node = ctx.fs.nodesById[ctx.cwd];
    if (!node || node.type !== 'folder') return { error: 'Current directory is invalid.' };
    
    const folder = node as FsFolderNode;
    const lines = [
      ` Directory of ${getFsPath(ctx.cwd)}`,
      ''
    ];
    
    if (folder.childIds.length === 0) {
      lines.push('  (empty folder)');
    } else {
      folder.childIds.forEach(id => {
        const child = ctx.fs.nodesById[id];
        if (child) {
          const typeStr = child.type === 'folder' ? '<DIR>' : '     ';
          lines.push(`${typeStr.padEnd(8)} ${child.name}`);
        }
      });
    }
    return { output: lines };
  }
});

commands.push({
  name: 'cd',
  description: 'Changes current working directory.',
  usage: 'cd <path>',
  execute: (args, ctx) => {
    if (args.length === 0) return { output: getFsPath(ctx.cwd) };
    const target = args.join(' ');
    
    if (target === '.') return;
    if (target === '..') {
      const node = ctx.fs.nodesById[ctx.cwd];
      if (node && node.parentId) {
        ctx.setCwd(node.parentId);
      }
      return;
    }

    const node = ctx.fs.nodesById[ctx.cwd];
    if (!node || node.type !== 'folder') return { error: 'Invalid current directory.' };
    
    const folder = node as FsFolderNode;
    
    // Simple child resolution
    const childId = folder.childIds.find(id => {
      const child = ctx.fs.nodesById[id];
      return child && child.name.toLowerCase() === target.toLowerCase();
    });
    
    if (childId) {
      const child = ctx.fs.nodesById[childId];
      if (child.type === 'folder') {
        ctx.setCwd(childId);
      } else {
        return { error: 'The directory name is invalid.' };
      }
    } else {
      return { error: 'The system cannot find the path specified.' };
    }
  }
});

commands.push({
  name: 'open',
  aliases: ['start'],
  description: 'Opens a file or application.',
  usage: 'open <appId or file>',
  execute: (args, ctx) => {
    if (args.length === 0) return { error: 'Missing argument. Usage: open <appId or file>' };
    const target = args.join(' ').toLowerCase();
    
    // 1. Check virtual filesystem in current directory
    const node = ctx.fs.nodesById[ctx.cwd];
    if (node && node.type === 'folder') {
      const folder = node as FsFolderNode;
      const childId = folder.childIds.find(id => ctx.fs.nodesById[id]?.name.toLowerCase() === target);
      if (childId) {
        const child = ctx.fs.nodesById[childId];
        if (child.type === 'file' || child.type === 'app-link') {
          const appId = child.type === 'file' ? child.openAppId : child.appId;
          ctx.launchApp(appId, child.launchArgs);
          return { output: `Opening ${child.name}...` };
        } else if (child.type === 'folder') {
          ctx.setCwd(childId);
          return { output: `Navigated to ${child.name}` };
        }
      }
    }
    
    // 2. Try launching as direct appId
    ctx.launchApp(target);
    return { output: `Attempting to launch application '${target}'...` };
  }
});

export const commandRegistry = commands;

export function parseAndExecute(input: string, ctx: CommandContext): CommandResult | void {
  const tokens = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  if (tokens.length === 0 || !tokens[0]) return;
  
  const cmdName = tokens[0].toLowerCase().replace(/"/g, '');
  const args = tokens.slice(1).map(t => t.replace(/^"|"$/g, ''));
  
  const def = commandRegistry.find(c => 
    c.name === cmdName || (c.aliases && c.aliases.includes(cmdName))
  );
  
  if (!def) {
    return { error: `'${cmdName}' is not recognized as an internal or external command. Type 'help' for a list of available commands.` };
  }
  
  return def.execute(args, ctx);
}
