import { AssetRegistry } from '../assets/registry';
import { projectData, socialData } from '../content';

export type FsNodeType = 'folder' | 'file' | 'app-link';

export interface FsNodeBase {
  id: string;
  name: string;
  type: FsNodeType;
  parentId: string | null;
}

export interface FsFolderNode extends FsNodeBase {
  type: 'folder';
  childIds: string[];
}

export interface FsFileNode extends FsNodeBase {
  type: 'file';
  fileKind: 'text' | 'document' | 'image' | 'project-ref' | 'social-ref';
  contentRef?: string;
  openAppId: string;
  launchArgs?: Record<string, unknown>;
  icon: string;
}

export interface FsAppLinkNode extends FsNodeBase {
  type: 'app-link';
  appId: string;
  launchArgs?: Record<string, unknown>;
  icon: string;
}

export type FsNode = FsFolderNode | FsFileNode | FsAppLinkNode;

export interface VirtualFilesystem {
  nodesById: Record<string, FsNode>;
  rootId: string;
}

export const virtualFs: VirtualFilesystem = {
  rootId: 'root',
  nodesById: {
    'root': {
      id: 'root',
      name: 'My Computer',
      type: 'folder',
      parentId: null,
      childIds: ['c-drive'],
    },
    'c-drive': {
      id: 'c-drive',
      name: 'Local Disk (C:)',
      type: 'folder',
      parentId: 'root',
      childIds: ['users-dir', 'projects-dir', 'social-dir', 'games-dir'],
    },
    'users-dir': {
      id: 'users-dir',
      name: 'Users',
      type: 'folder',
      parentId: 'c-drive',
      childIds: ['zaid-dir'],
    },
    'zaid-dir': {
      id: 'zaid-dir',
      name: 'Zaid',
      type: 'folder',
      parentId: 'users-dir',
      childIds: ['desktop-dir', 'documents-dir', 'downloads-dir'],
    },
    'desktop-dir': {
      id: 'desktop-dir',
      name: 'Desktop',
      type: 'folder',
      parentId: 'zaid-dir',
      childIds: ['my-computer-link', 'recycle-bin-link'],
    },
    'my-computer-link': {
      id: 'my-computer-link',
      name: 'My Computer',
      type: 'app-link',
      parentId: 'desktop-dir',
      appId: 'file-explorer',
      icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    },
    'recycle-bin-link': {
      id: 'recycle-bin-link',
      name: 'Recycle Bin',
      type: 'app-link',
      parentId: 'desktop-dir',
      appId: 'recycle-bin',
      icon: AssetRegistry.XP_RECYCLE_BIN_ICON_EMPTY,
    },
    'documents-dir': {
      id: 'documents-dir',
      name: 'Documents',
      type: 'folder',
      parentId: 'zaid-dir',
      childIds: ['resume-file', 'nav-guide-file'],
    },
    'resume-file': {
      id: 'resume-file',
      name: 'Resume.pdf',
      type: 'file',
      fileKind: 'document',
      parentId: 'documents-dir',
      openAppId: 'pdf-viewer',
      icon: AssetRegistry.XP_NOTEPAD_ICON,
    },
    'nav-guide-file': {
      id: 'nav-guide-file',
      name: 'Navigation guide.txt',
      type: 'file',
      fileKind: 'text',
      parentId: 'documents-dir',
      openAppId: 'navigation-guide',
      icon: AssetRegistry.XP_NOTEPAD_ICON,
    },
    'downloads-dir': {
      id: 'downloads-dir',
      name: 'Downloads',
      type: 'folder',
      parentId: 'zaid-dir',
      childIds: [],
    },
    'projects-dir': {
      id: 'projects-dir',
      name: 'Projects',
      type: 'folder',
      parentId: 'c-drive',
      childIds: [], // Dynamically populated
    },
    'social-dir': {
      id: 'social-dir',
      name: 'Social',
      type: 'folder',
      parentId: 'c-drive',
      childIds: [], // Dynamically populated
    },
    'games-dir': {
      id: 'games-dir',
      name: 'Games',
      type: 'folder',
      parentId: 'c-drive',
      childIds: ['snake-link', 'minesweeper-link'],
    },
    'snake-link': {
      id: 'snake-link',
      name: 'Snake',
      type: 'app-link',
      parentId: 'games-dir',
      appId: 'snake',
      icon: AssetRegistry.XP_NOTEPAD_ICON,
    },
    'minesweeper-link': {
      id: 'minesweeper-link',
      name: 'Minesweeper',
      type: 'app-link',
      parentId: 'games-dir',
      appId: 'minesweeper',
      icon: AssetRegistry.XP_NOTEPAD_ICON,
    },
  },
};

// Hydrate Projects dynamically
const projectIds: string[] = [];
projectData.forEach(p => {
  const fileId = `project-${p.id}-file`;
  projectIds.push(fileId);
  virtualFs.nodesById[fileId] = {
    id: fileId,
    name: p.name,
    type: 'file',
    fileKind: 'project-ref',
    parentId: 'projects-dir',
    openAppId: 'project-viewer',
    launchArgs: { projectId: p.id },
    icon: p.icon,
  };
});
(virtualFs.nodesById['projects-dir'] as FsFolderNode).childIds = projectIds;

// Hydrate Socials dynamically
const socialIds: string[] = [];
socialData.forEach(s => {
  const fileId = `social-${s.id}-file`;
  socialIds.push(fileId);
  virtualFs.nodesById[fileId] = {
    id: fileId,
    name: s.label,
    type: 'file',
    fileKind: 'social-ref',
    parentId: 'social-dir',
    openAppId: 'social-viewer',
    launchArgs: { socialId: s.id },
    icon: s.icon,
  };
});
(virtualFs.nodesById['social-dir'] as FsFolderNode).childIds = socialIds;

export function getFsPath(nodeId: string): string {
  if (nodeId === 'root') return 'My Computer';
  let path = '';
  let current: string | null = nodeId;
  while (current && current !== 'root') {
    const node: FsNode | undefined = virtualFs.nodesById[current];
    if (node) {
      path = path ? `${node.name}\\${path}` : node.name;
      current = node.parentId;
    } else {
      break;
    }
  }
  return `My Computer\\${path}`;
}
