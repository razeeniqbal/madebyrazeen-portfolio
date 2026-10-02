import { Hero } from '@/components/v2/home/Hero';
import { SelectedWork } from '@/components/v2/home/SelectedWork';
import { JournalTeaser } from '@/components/v2/home/JournalTeaser';
import { RunningTeaser } from '@/components/v2/home/RunningTeaser';
import { AboutTeaser, ContactBlock } from '@/components/v2/home/AboutContact';
import { JsonLd } from '@/components/v2/seo/JsonLd';
import { SITE_URL } from '@/lib/site';
import { contact, education, profile } from '@/content/profile';
import { getCurrentRole } from '@/content/experience';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: SITE_URL,
  jobTitle: profile.role,
  worksFor: { '@type': 'Organization', name: getCurrentRole()?.company },
  alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  sameAs: [contact.github, contact.linkedin],
  knowsAbout: ['Data engineering', 'Artificial intelligence', 'Machine learning', 'Product engineering'],
};

// Home is a trailer, not the database (refinement spec §11): six moments, depth lives on the destination pages.
// Rhythm: dark · light · dark · light · dark · light, then the dark footer.
export default function HomePage() {
  return (
    <>
      <JsonLd data={person} />
      <Hero />
      <SelectedWork />
      <AboutTeaser />
      <JournalTeaser />
      <RunningTeaser />
      <ContactBlock index="05" surface="light" title={['Have an idea?', 'Let’s build something.']} />
    </>
  );
}
