/**
 * Identity, contact, education, recognition and bio.
 * Edit in the admin (/keystatic → Profile & identity) or in content/data/profile.json.
 */
import data from './data/profile.json';

const { contact: contactData, education: educationData, recognition: recognitionData, bio: bioData, ...profileData } = data;

export const profile = profileData;

/** Full name with the professional title: "Ts. Mohamad Razeen Iqbal Roslan". Photo captions use it. */
export const titledName = [profile.title, profile.legalName].filter(Boolean).join(' ');

export const contact = contactData;

export const education = educationData;

export const recognition = recognitionData;

/** Short bio (used by the assistant). */
export const bio = bioData;
