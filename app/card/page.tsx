import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import QRCode from 'qrcode';
import { CARD_PATH, CARD_PHOTO, CARD_URL, getCard } from '@/lib/card';
import { ShareCard } from '@/components/v2/card/ShareCard';
import { ShowQr } from '@/components/v2/card/ShowQr';
import { CredentialBadge } from '@/components/v2/credentials/CredentialBadge';

const card = getCard();

export const metadata: Metadata = {
  title: `${card.shortName} · Card`,
  description: `${card.fullName}: ${card.role}${card.company ? `, ${card.company}` : ''}. Save the contact, or open the portfolio, LinkedIn and GitHub.`,
  alternates: { canonical: CARD_PATH },
  openGraph: { type: 'profile', url: CARD_URL, title: card.fullName, description: card.headline },
};

export const viewport: Viewport = { themeColor: '#0b0b0b' };

/**
 * The digital business card. Opened from a QR code or an NFC tag, mostly on a phone, so it is one
 * screen: who, what, and the two things people want (save the contact, open a link), then a QR to
 * pass it on. No site header: it is a card, not a page of the portfolio.
 */
export default async function CardPage() {
  const qr = await QRCode.toString(CARD_URL, { type: 'svg', errorCorrectionLevel: 'M', margin: 1, color: { dark: '#0b0b0b', light: '#ffffff' } });

  const links = [
    { label: 'Email', value: card.email, href: `mailto:${card.email}` },
    card.phone && { label: 'Call', value: card.phoneDisplay, href: `tel:${card.phone}` },
    card.whatsapp && { label: 'WhatsApp', value: 'Message', href: card.whatsapp, external: true },
    { label: 'LinkedIn', value: 'in/razeeniqbal', href: card.linkedin, external: true },
    { label: 'GitHub', value: '@razeeniqbal', href: card.github, external: true },
    { label: 'Portfolio', value: 'portfolio.madebyrazeen.com', href: card.portfolio },
    { label: 'Trainer profile', value: 'PDF', href: card.trainerProfile, external: true },
    card.resume && { label: 'Resume', value: 'PDF', href: card.resume, external: true },
  ].filter(Boolean) as { label: string; value?: string; href: string; external?: boolean }[];

  const primary = 'label flex h-12 items-center justify-center gap-2 transition-colors';

  return (
    <main data-surface="dark" className="min-h-dvh bg-surface text-ink">
      <div className="mx-auto flex max-w-md flex-col px-5 pb-12 pt-6">
        {/* Top bar: the owner's shortcut to a scannable QR (also /card?qr from the home screen) */}
        <div className="mb-3 flex items-center justify-between">
          <span className="label text-muted">Digital card</span>
          <Suspense fallback={<span className="h-9" />}>
            <ShowQr svg={qr} name={card.shortName} url={CARD_URL} />
          </Suspense>
        </div>

        {/* Card face */}
        {/* Centred, as a printed business card reads: photo, name, role, credentials */}
        <section aria-label="Card" className="border border-line bg-raised/40 p-6 text-center">
          <div className="flex flex-col items-center">
            <Image src={CARD_PHOTO} width={480} height={480} alt={`Portrait of ${card.legalName}`} priority className="h-24 w-24 shrink-0 rounded-full object-cover" />
            <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight">{card.shortName}</h1>
            <p className="mt-1 text-sm text-muted">{card.legalName}</p>
          </div>
          {/* Role: title, company, place */}
          <div className="mt-6 flex flex-col items-center border-t border-line pt-5">
            <p className="text-xl font-semibold leading-snug">{card.role}</p>
            {card.company && (
              <p className="mt-1 flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                {card.company}
              </p>
            )}
            {card.location && (
              <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8Z" />
                  <circle cx="8" cy="6.5" r="1.6" />
                </svg>
                {card.location}
              </p>
            )}
          </div>

          {/* Credentials as badges: official artwork where it exists, a typographic tile otherwise */}
          {card.badges.length > 0 && (
            <div className="mt-5 border-t border-line pt-5">
              <p className="label text-muted">Credentials</p>
              <ul aria-label="Credentials" className="mx-auto mt-3 grid max-w-xs grid-cols-5 gap-2">
                {card.badges.map((b) => {
                  const body = (
                    <>
                      <CredentialBadge credential={b.credential} size={44} />
                      <span className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-wide">{b.label}</span>
                    </>
                  );
                  const cls = 'flex flex-col items-center text-center';
                  return (
                    <li key={b.title} title={`${b.title} · ${b.issuer}`}>
                      {b.verifyUrl ? (
                        <a href={b.verifyUrl} target="_blank" rel="noopener noreferrer" aria-label={`${b.title}, ${b.issuer}: verify`} className={`${cls} transition-opacity hover:opacity-80`}>
                          {body}
                        </a>
                      ) : (
                        <span aria-label={`${b.title}, ${b.issuer}`} className={cls}>
                          {body}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* The two things people came for */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a href="/card/vcard" className={`${primary} bg-lime text-carbon hover:bg-ink hover:text-surface`}>
            Save contact
          </a>
          <ShareCard url={CARD_URL} title={card.fullName} className={`${primary} border border-line hover:border-ink`} />
        </div>

        {/* Links */}
        <ul aria-label="Contact and links" className="mt-8 divide-y divide-line border-y border-line">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="group flex items-baseline justify-between gap-4 py-3.5"
              >
                <span className="label text-muted">{l.label}</span>
                <span className="min-w-0 truncate text-right group-hover:text-lime">
                  {l.value} <span aria-hidden="true">{l.external ? '↗' : '→'}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Pass it on */}
        <section aria-label="QR code" className="mt-10 flex flex-col items-center text-center">
          <div className="w-48 bg-white p-3" role="img" aria-label={`QR code for ${CARD_URL}`} dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="label mt-4 text-muted">Scan to open this card</p>
          <a href="/card/qr?download=1" className="label mt-2 border-b border-current pb-0.5 hover:text-lime">
            Download QR (SVG)
          </a>
        </section>

        <p className="label mt-12 text-center text-muted">
          <Link href="/" className="hover:text-lime">
            Made by Razeen
          </Link>
        </p>
      </div>
    </main>
  );
}
