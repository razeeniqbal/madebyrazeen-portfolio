// V1 compatibility layer. V2 content lives in /content; these shapes feed the archived V1 pages.
import { profile, contact, education, bio } from '@/content/profile';
import { experience } from '@/content/experience';

export const educationCards = education.map(({ short: _short, ...e }) => ({ ...e, logo: undefined }));

export const careers = experience.map((r) => ({
  company: r.company,
  role: r.role,
  period: r.period,
  location: r.location,
  type: r.type,
  logo: undefined,
  responsibilities: r.highlights,
}));

export const personalInfo = {
  name: profile.name,
  role: profile.role,
  email: contact.email,
  phone: contact.phone,
  location: profile.location,
  github: contact.github,
  linkedin: contact.linkedin,
  bio: bio.short,
  cgpa: education[0].cgpa,
  university: education[0].short,
  status: profile.status,
  languages: [...profile.languages],
};
