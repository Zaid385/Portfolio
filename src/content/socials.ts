import { AssetRegistry } from '../assets/registry';

export interface SocialRecord {
  id: string;
  label: string;
  url: string;
  icon: string;
  description?: string;
  embeddable: boolean;
}

export const socialData: SocialRecord[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: '[YOUR LINKEDIN URL]',
    icon: AssetRegistry.XP_INTERNET_ICON,
    description: 'View my professional experience, education, and endorsements on LinkedIn.',
    embeddable: false
  },
  {
    id: 'github',
    label: 'GitHub',
    url: '[YOUR GITHUB URL]',
    icon: AssetRegistry.XP_INTERNET_ICON,
    description: 'Explore my open source contributions and code repositories on GitHub.',
    embeddable: false
  }
];
