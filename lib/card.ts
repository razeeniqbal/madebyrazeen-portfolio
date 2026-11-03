import { contact, profile, titledName } from '@/content/profile';
import { getCurrentRole } from '@/content/experience';
import { featuredCredentials } from '@/content/achievements';
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

/** "(+60) 13-7441727" -> "+60137441727", for tel:, wa.me and the vCard. */
const e164 = (phone: string) => `+${phone.replace(/\D/g, '')}`;

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
    // Professional registration first, then the featured certifications by code.
    credentials: [
      'Ts. · MBOT',
      ...featuredCredentials.filter((a) => a.type !== 'professional-registration').map((a) => credentialCode(a) ?? a.title),
    ],
  };
}

export type Card = ReturnType<typeof getCard>;

/** vCard 3.0 text: escape per RFC 2426, fold long lines at 75 octets, CRLF line ends. */
const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const fold = (line: string) => line.match(/.{1,74}/g)!.join('\r\n ');

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
    `NOTE:${esc(`${card.headline}. Professional Technologist (Ts.), MBOT. Card: ${CARD_URL}`)}`,
    photoBase64 && `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`,
    'END:VCARD',
  ].filter(Boolean) as string[];
  return lines.map(fold).join('\r\n') + '\r\n';
}
