export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

// Intentional empty state
export const experience: Experience[] = [];
