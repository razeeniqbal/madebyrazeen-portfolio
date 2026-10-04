import { Hero } from '@/components/v2/home/Hero';
import { Currently } from '@/components/v2/home/Currently';
import { SelectedBuilds } from '@/components/v2/home/SelectedBuilds';
import { PathTeaser, ContactBlock } from '@/components/v2/home/AboutContact';
import { FeaturedWork } from '@/components/v2/home/FeaturedWork';
import { SharingTeaser } from '@/components/v2/home/SharingTeaser';
import { JournalTeaser } from '@/components/v2/home/JournalTeaser';
import { LifeTeaser } from '@/components/v2/home/LifeTeaser';
import { JsonLd } from '@/components/v2/seo/JsonLd';
import { SITE_URL } from '@/lib/site';
import { contact, education, profile } from '@/content/profile';
import { getCurrentRole } from '@/content/experience';
import type { Metadata } from 'next';

// Home: name and role, the same pairing as the hero label.
export const metadata: Metadata = {
  title: { absolute: 'Razeen Iqbal · Data Engineer & AI Solutions Engineer' },
  alternates: { canonical: '/' },
  description:
    'Razeen Iqbal, Data Engineer and AI Solutions Engineer. Civil engineering, then data, then AI: the products he builds, his professional data and AI work, training, writing and life away from the screen.',
};

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

// Home is the trailer, not the database: who Razeen is, what he is doing now, what he builds, how he got
// here, how he applies it at work, how he shares it, how he thinks, and life away from the screen.
// Rhythm: dark hero + currently · light builds · dark path + featured work · light sharing + journal ·
// dark life · light contact, then the dark footer.
export default function HomePage() {
  return (
    <>
      <JsonLd data={person} />
      <Hero />
      <Currently />
      <SelectedBuilds />
      <PathTeaser />
      <FeaturedWork />
      <SharingTeaser />
      <JournalTeaser />
      <LifeTeaser />
      <ContactBlock index="07" surface="light" title={['Have something', 'worth building?']} />
    </>
  );
}
