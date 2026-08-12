export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  image?: string;
}

// Intentional empty state
export const certifications: Certification[] = [];
