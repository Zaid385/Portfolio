import { AssetRegistry } from '../assets/registry';

export interface ProjectRecord {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  repoUrl?: string;
  deploymentUrl?: string;
  icon: string;
  screenshots: string[];
  embeddable?: boolean;
  status?: 'deployed' | 'in-progress' | 'archived';
}

export const projectData: ProjectRecord[] = [
  {
    id: 'placeholder-project-1',
    name: '[PROJECT 1 NAME]',
    shortDescription: '[PROJECT 1 SHORT DESCRIPTION]',
    longDescription: '[PROJECT 1 FULL DESCRIPTION]',
    techStack: ['[TECH 1]', '[TECH 2]'],
    repoUrl: '[PROJECT 1 REPOSITORY URL]',
    deploymentUrl: '[PROJECT 1 DEPLOYMENT URL]',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    screenshots: [],
    embeddable: false,
    status: 'deployed'
  },
  {
    id: 'placeholder-project-2',
    name: '[PROJECT 2 NAME]',
    shortDescription: '[PROJECT 2 SHORT DESCRIPTION]',
    longDescription: '[PROJECT 2 FULL DESCRIPTION]',
    techStack: ['[TECH 1]', '[TECH 2]'],
    repoUrl: '[PROJECT 2 REPOSITORY URL]',
    deploymentUrl: '[PROJECT 2 DEPLOYMENT URL]',
    icon: AssetRegistry.XP_MY_COMPUTER_ICON,
    screenshots: [],
    embeddable: true,
    status: 'in-progress'
  }
];
