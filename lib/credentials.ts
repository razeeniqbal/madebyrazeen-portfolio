/**
 * Pure credential helpers (no data import, so client components can use them without bundling the dataset).
 */
import type { Achievement } from '@/content/achievements';

/** "2023" from "September 2023"; undefined when no date is recorded (never guessed). */
export const credentialYear = (a: Achievement) => a.issuedDate.match(/\d{4}/)?.[0];

/** Exam code such as "AI-102" when the title carries one. */
export const credentialCode = (a: Achievement) => a.title.match(/\(([A-Z]{2,3}-\d{3})\)/)?.[1];

/** Title without vendor prefix or exam code, for compact lists. */
export const credentialShortTitle = (a: Achievement) =>
  a.title.replace(/^Microsoft Certified:\s*/, '').replace(/\s*\([A-Z]{2,3}-\d{3}\)\s*$/, '');

// Vendor landing pages that don't verify anything; never shown as a "Verify" link.
const GENERIC_URLS = new Set([
  'https://learn.microsoft.com/en-us/certifications/',
  'https://www.pythoninstitute.org/',
  'https://www.cloudskillsboost.google/',
]);
export const credentialVerifyUrl = (a: Achievement) => (a.credentialUrl && !GENERIC_URLS.has(a.credentialUrl) ? a.credentialUrl : undefined);
