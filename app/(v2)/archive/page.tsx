import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';

export const metadata: Metadata = {
  alternates: { canonical: '/archive' },
  title: 'Portfolio archive',
  description: 'Earlier versions of this portfolio, kept as part of the story.',
};

const versions = [
  { v: 'V2', year: 2026, name: 'Engineering notebook', note: 'Current', href: '/' },
  { v: 'V1', year: 2025, name: 'Dark card portfolio', note: 'Archived as it was', href: '/archive/v1' },
];

// PRD §47: preserve the previous portfolio to show evolution.
export default function ArchivePage() {
  return (
    <Section surface="light" className="!pt-16">
      <div className="page-grid gap-y-12">
        <SectionHeader as="h1" size="xl" eyebrow="Portfolio archive" title={['Same person.', 'Different versions.']} />
        <ol className="col-span-full">
          {versions.map((ver) => (
            <li key={ver.v} className="border-t border-line">
              <Link href={ver.href} className="group grid grid-cols-[4rem_1fr_auto] items-baseline gap-4 py-8 md:grid-cols-[6rem_1fr_12rem_2rem]">
                <span className="text-display-md">{ver.v}</span>
                <span>
                  <span className="text-xl font-semibold group-hover:underline">{ver.name}</span>
                  <TechnicalLabel as="span" className="mt-1 block">
                    {ver.year}
                  </TechnicalLabel>
                </span>
                <TechnicalLabel className="hidden md:block">{ver.note}</TechnicalLabel>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
