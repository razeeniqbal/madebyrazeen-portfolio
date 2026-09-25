import { Hero } from '@/components/v2/home/Hero';
import { Intro } from '@/components/v2/home/Intro';
import { SelectedWork } from '@/components/v2/home/SelectedWork';
import { FeaturedSystem } from '@/components/v2/home/FeaturedSystem';
import { Capabilities } from '@/components/v2/home/Capabilities';
import { Experience } from '@/components/v2/home/Experience';
import { RunningTeaser } from '@/components/v2/home/RunningTeaser';
import { ExploringNotes } from '@/components/v2/home/ExploringNotes';
import { LabTeaser } from '@/components/v2/home/LabTeaser';
import { AboutTeaser, ContactBlock } from '@/components/v2/home/AboutContact';
import { JsonLd } from '@/components/v2/seo/JsonLd';
import { SITE_URL } from '@/lib/site';
import { contact, education, profile } from '@/content/profile';
import { experience } from '@/content/experience';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: SITE_URL,
  jobTitle: experience[0].role,
  worksFor: { '@type': 'Organization', name: experience[0].company },
  alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  sameAs: [contact.github, contact.linkedin],
  knowsAbout: ['Data engineering', 'Artificial intelligence', 'Machine learning', 'Product engineering'],
};

// Dark/light rhythm follows PRD §8.
export default function HomePage() {
  return (
    <>
      <JsonLd data={person} />
      <Hero />
      <Intro />
      <SelectedWork />
      <FeaturedSystem />
      <Capabilities />
      <Experience />
      <RunningTeaser />
      <ExploringNotes />
      <LabTeaser />
      <AboutTeaser />
      <ContactBlock />
    </>
  );
}
