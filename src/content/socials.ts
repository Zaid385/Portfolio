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
    url: 'https://www.linkedin.com/in/zaid-asaad',
    icon: AssetRegistry.ICON_LINKEDIN,
    description: 'View my professional experience, education, and endorsements on LinkedIn.',
    embeddable: false
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/Zaid385',
    icon: AssetRegistry.ICON_GITHUB,
    description: 'Explore my open source contributions and code repositories on GitHub.',
    embeddable: false
  },
  {
    id: 'gmail',
    label: 'Gmail',
    url: 'https://mail.google.com/mail/?view=cm&fs=1&to=zaidasaad385@gmail.com',
    icon: AssetRegistry.ICON_GMAIL,
    description: 'Send me an email directly via Gmail.',
    embeddable: false
  }
];
