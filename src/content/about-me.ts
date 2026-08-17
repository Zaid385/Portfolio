import { userData } from '../content/user';
import { projectData } from '../content/projects';
import { socialData } from '../content/socials';

function generateAboutMeText(): string {
  const divider = '──────────────────────────────────────────────────';

  const sections: string[] = [];

  // Header
  sections.push(divider);
  sections.push('  ABOUT ME');
  sections.push(divider);
  sections.push('');

  // Name & Title
  sections.push(`NAME:     ${userData.name}`);
  sections.push(`TITLE:    ${userData.title}`);
  sections.push(`LOCATION: ${userData.contact.location}`);
  sections.push('');

  // About
  sections.push(divider);
  sections.push('  ABOUT');
  sections.push(divider);
  sections.push('');
  sections.push(userData.summary);
  sections.push('');

  // Education
  if (userData.education.length > 0) {
    sections.push(divider);
    sections.push('  EDUCATION');
    sections.push(divider);
    sections.push('');
    userData.education.forEach(edu => {
      sections.push(`  ${edu.degree}`);
      sections.push(`  ${edu.institution}`);
      sections.push(`  ${edu.duration}`);
      sections.push('');
    });
  }

  // Skills
  if (userData.skills.length > 0) {
    sections.push(divider);
    sections.push('  SKILLS');
    sections.push(divider);
    sections.push('');
    sections.push(`  ${userData.skills.join('  •  ')}`);
    sections.push('');
  }

  // Projects
  if (projectData.length > 0) {
    sections.push(divider);
    sections.push('  PROJECTS');
    sections.push(divider);
    sections.push('');
    projectData.forEach(p => {
      sections.push(`  ▸ ${p.name} — ${p.shortDescription}`);
      sections.push(`    ${p.longDescription.substring(0, 120)}...`);
      sections.push(`    Tech: ${p.techStack.join(', ')}`);
      if (p.repoUrl) sections.push(`    Repo: ${p.repoUrl}`);
      if (p.deploymentUrl) sections.push(`    Live: ${p.deploymentUrl}`);
      sections.push('');
    });
  }

  // Contact & Socials
  sections.push(divider);
  sections.push('  CONTACT & SOCIALS');
  sections.push(divider);
  sections.push('');
  sections.push(`  Email:    ${userData.contact.email}`);
  sections.push(`  Phone:    ${userData.contact.phone}`);
  socialData.forEach(s => {
    sections.push(`  ${s.label}:${' '.repeat(Math.max(1, 8 - s.label.length))}${s.url}`);
  });
  sections.push('');

  // Footer
  sections.push(divider);
  sections.push('  Thanks for visiting my portfolio computer!');
  sections.push('  Feel free to explore the desktop, open apps, and have fun.');
  sections.push(divider);

  return sections.join('\n');
}

export const aboutMeText = generateAboutMeText();
