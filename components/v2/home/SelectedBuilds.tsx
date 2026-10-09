import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { statusLabel } from '@/components/v2/work/ProjectMeta';
import { evidenceLabel } from '@/lib/assets';
import { getProject, getProjects, type Project } from '@/content/projects';
import { home } from '@/content/home';
import { BuildShowcase, type ShowcaseBuild } from './BuildShowcase';

/**
 * Home 01. Four builds chosen on purpose (home.json), each led by where it started, not by its stack.
 * An interactive showcase: one large real product view at a time on desktop, a swipeable row on phones.
 */
export function SelectedBuilds() {
  const builds: ShowcaseBuild[] = home.builds.projects
    .map((slug) => getProject(slug))
    .filter((p): p is Project => Boolean(p))
    .map((p) => {
      const image = p.productImage ?? p.cover;
      return {
        slug: p.slug,
        title: p.title,
        origin: p.origin,
        summary: p.summary,
        status: statusLabel[p.status] + (p.links.live ? ' · Live' : ''),
        live: p.status === 'active' || p.status === 'under-construction',
        liveUrl: p.links.live,
        stack: p.stack,
        image: image ? { src: image.src, width: image.width, height: image.height, alt: image.alt } : undefined,
        evidence: image?.evidence ? evidenceLabel[image.evidence] : undefined,
      };
    });
  const total = getProjects().length;

  return (
    <Section surface="light" id="work">
      <div className="page-grid gap-y-12 md:gap-y-16">
        <SectionHeader index="01" eyebrow="Selected builds" title={home.builds.title} size="md" />
        <BuildShowcase builds={builds} />
        <div className="col-span-full flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <ArrowLink href="/projects">View all projects</ArrowLink>
          <TechnicalLabel>{total} projects</TechnicalLabel>
        </div>
      </div>
    </Section>
  );
}
