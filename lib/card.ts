import { contact, profile, titledName } from '@/content/profile';
import { getCurrentRole } from '@/content/experience';
import { achievements, featuredCredentials } from '@/content/achievements';
import { credentialCode } from '@/lib/credentials';
import { trainerProfile } from '@/content/trainer';
import { SITE_URL } from '@/lib/site';

/**
 * The digital business card (/card): one source for the card page, the saved contact (vCard)
 * and the QR code. Everything comes from the profile, so editing Keystatic updates all three.
 */

export const CARD_PATH = '/card';
export const CARD_URL = `${SITE_URL}${CARD_PATH}`;
export const CARD_PHOTO = '/card/razeen-contact.jpg';

/**
 * "(+60) 13-7441727" -> "+60137441727", for tel:, wa.me and the vCard. A national number
 * ("013-7441727") gets Malaysia's +60; anything still not 8 to 15 digits is left off the card.
 */
function e164(phone: string): string | undefined {
  let digits = phone.replace(/\D/g, '');
  const international = phone.includes('+');
  if (!international && digits.startsWith('0')) digits = `60${digits.slice(1)}`;
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : undefined;
}

/** The current professional registration behind the title, when the credentials list has one (MBOT for Ts.). */
const registration = () => {
  const today = new Date().toISOString().slice(0, 10);
  return achievements.find(
    (a) => a.type === 'professional-registration' && /\bMBOT\b/.test(a.organization) && (!a.expiresOn || a.expiresOn >= today),
  );
};

export function getCard() {
  const role = getCurrentRole();
  const phone = contact.phone ? e164(contact.phone) : undefined;
  return {
    shortName: [profile.title, profile.name].filter(Boolean).join(' '),
    fullName: titledName,
    title: profile.title,
    legalName: profile.legalName,
    role: role?.role ?? profile.role,
    company: role?.company,
    headline: profile.role,
    location: profile.location,
    email: contact.email,
    phone,
    phoneDisplay: contact.phone,
    whatsapp: phone ? `https://wa.me/${phone.slice(1)}` : undefined,
    linkedin: contact.linkedin,
    github: contact.github,
    portfolio: SITE_URL,
    resume: profile.resume,
    trainerProfile: trainerProfile.href,
    registration: registration() ? 'Professional Technologist (Ts.), MBOT' : undefined,
    // Professional registration first (only while it is on record), then the featured certifications by code.
    credentials: [
      ...(registration() ? ['Ts. · MBOT'] : []),
      ...featuredCredentials.filter((a) => a.type !== 'professional-registration').map((a) => credentialCode(a) ?? a.title),
    ],
  };
}

export type Card = ReturnType<typeof getCard>;

/** vCard 3.0 text: escape per RFC 2426, fold long lines at 75 octets, CRLF line ends. */
const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
/** Fold every 74 characters, counted by code point so an emoji or accented letter is never cut in half. */
const fold = (line: string) => {
  const chars = Array.from(line);
  const parts: string[] = [];
  for (let i = 0; i < chars.length; i += 74) parts.push(chars.slice(i, i + 74).join(''));
  return parts.join('\r\n ');
};

export function toVCard(card: Card, photoBase64?: string): string {
  const [given, ...rest] = card.legalName.split(' ');
  const family = rest.pop() ?? '';
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc([given, ...rest].join(' '))};;${esc(card.title ?? '')};`,
    `FN:${esc(card.fullName)}`,
    `NICKNAME:${esc(card.shortName)}`,
    card.company && `ORG:${esc(card.company)}`,
    `TITLE:${esc(card.role)}`,
    card.phone && `TEL;TYPE=CELL:${card.phone}`,
    `EMAIL;TYPE=INTERNET:${card.email}`,
    `URL:${card.portfolio}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${card.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${card.github}`,
    card.location && `ADR;TYPE=WORK:;;;${esc(card.location.split(',')[0].trim())};;;${esc(card.location.split(',').pop()!.trim())}`,
    `NOTE:${esc([card.headline, card.registration, `Card: ${CARD_URL}`].filter(Boolean).join('. '))}`,
    photoBase64 && `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`,
    'END:VCARD',
  ].filter(Boolean) as string[];
  return lines.map(fold).join('\r\n') + '\r\n';
}
