import data from './data/achievements.json';

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  issuedDate: string;
  description: string;
  category: 'certification' | 'award' | 'course' | 'achievement';
  image: string;
  credentialUrl?: string;
  credentialId?: string;
  /** Shown in the Home hero strip and first on the Resume. */
  featured: boolean;
}

// Data: content/data/achievements.json (edited in the admin → Credentials).
export const achievements: Achievement[] = data.items.map((a) => ({
  ...a,
  category: a.category as Achievement['category'],
  credentialUrl: a.credentialUrl || undefined,
  credentialId: a.credentialId || undefined,
  featured: Boolean(a.featured),
}));

export const featuredCredentials = achievements.filter((a) => a.featured);
