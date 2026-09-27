/**
 * Builds the assistant's knowledge base from the site's own content, so the chatbot
 * can only draw on what the site already says. The output is deterministic (no dates,
 * no random ordering), which keeps the system prompt byte-identical between requests
 * and therefore cacheable.
 */
import { profile, contact, education, recognition, bio } from '@/content/profile';
import { experience } from '@/content/experience';
import { getProjects } from '@/content/projects';
import { getCaseStudy, type Block } from '@/content/case-studies';
import { achievements } from '@/content/achievements';
import { capabilities } from '@/content/capabilities';
import { chapters } from '@/content/story';
import { availability, helpWith } from '@/content/contact';
import { experiments, exploring } from '@/content/lab';
import { notes } from '@/content/notes';
import { isSampleData, getTotals, getPersonalBests, getRaces, formatDuration } from '@/content/running';
import { SITE_URL } from '@/lib/site';

function blockText(b: Block): string {
  switch (b.kind) {
    case 'text':
      return b.body.join('\n');
    case 'list':
      return b.items.map((i) => `- ${i.title}: ${i.detail}`).join('\n');
    case 'steps':
      return `${b.label}: ${b.steps.join(' → ')}`;
    case 'flow':
      return `${b.label}: ${b.nodes.map((n) => `${n.title} (${n.detail})`).join(' → ')}`;
    case 'metrics':
      return b.items.map((m) => `- ${m.label}: ${m.value}${m.illustrative ? ' (illustrative, not a real measurement)' : ''}`).join('\n');
    case 'table':
      return [b.caption, b.columns.join(' | '), ...b.rows.map((r) => r.join(' | ')), b.note ?? ''].join('\n');
    case 'image':
      return '';
  }
}

export function buildKnowledge(): string {
  const out: string[] = [];

  out.push(`# Razeen Iqbal\nRole: ${profile.role}\nLocation: ${profile.location}\nStatus: ${availability.headline}. ${availability.detail}`);
  out.push(`Statement: ${profile.statement.join(' ')}\n${profile.supporting}`);
  out.push(`Languages: ${profile.languages.join(', ')}`);
  out.push(`Contact: email ${contact.email}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}. Contact page: ${SITE_URL}/contact. Online resume: ${SITE_URL}/resume.`);

  out.push(`## Bio\n${bio.story.join('\n')}`);

  out.push(`## Story (About page)\n${chapters.map((c) => `### ${c.period}: ${c.title}\n${c.body.join('\n')}`).join('\n')}`);

  out.push(
    `## Experience\n${experience
      .map((r) => `### ${r.role}, ${r.company} (${r.period}, ${r.location}, ${r.type})\n${r.highlights.map((h) => `- ${h}`).join('\n')}`)
      .join('\n')}`,
  );

  out.push(`## Education\n${education.map((e) => `- ${e.degree} in ${e.field}, ${e.institution} (${e.period}), CGPA ${e.cgpa}`).join('\n')}`);
  out.push(`## Recognition\n${recognition.map((r) => `- ${r.year}: ${r.title}. ${r.detail}`).join('\n')}`);
  out.push(`## Capabilities\n${capabilities.map((c) => `- ${c.group}: ${c.items.join(', ')}`).join('\n')}`);
  out.push(`## What Razeen can help with\n${helpWith.map((h) => `- ${h.title}: ${h.detail}`).join('\n')}`);

  out.push(
    `## Projects\n${getProjects()
      .map((p) => {
        const links = [p.links.live && `live: ${p.links.live}`, p.links.source && `source: ${p.links.source}`].filter(Boolean).join(', ');
        const study = getCaseStudy(p.slug);
        const detail = study
          ? `\nCase study: ${study.lede}\n${study.sections.map((s) => `#### ${s.headline}\n${s.blocks.map(blockText).filter(Boolean).join('\n')}`).join('\n')}`
          : '';
        return `### ${p.title} (${p.year}, ${p.status}${p.placeholder ? ', details still being written' : ''})\n${p.summary}\nStack: ${p.stack.join(', ')}${links ? `\n${links}` : ''}${p.confidential ? '\nRepository is private.' : ''}\nPage: ${SITE_URL}/work/${p.slug}${detail}`;
      })
      .join('\n')}`,
  );

  out.push(
    `## Lab experiments\n${experiments.map((e) => `- ${e.title} (${e.status}): ${e.summary}`).join('\n')}\nCurrently exploring:\n${exploring.map((e) => `- ${e.label}: ${e.detail}`).join('\n')}`,
  );

  out.push(`## Stories (writing)\n${notes.map((n) => `- ${n.title} (${n.status}): ${n.summary}`).join('\n')}`);

  if (isSampleData()) {
    out.push(
      `## Running\nRazeen runs road races. The running statistics on the site are currently SAMPLE data, not real results; do not quote them as Razeen’s times. Running page: ${SITE_URL}/running`,
    );
  } else {
    const t = getTotals();
    const pbs = getPersonalBests()
      .filter((b) => b.sec)
      .map((b) => `${b.label}: ${formatDuration(b.sec!)}${b.run ? ` (${b.run.race?.name ?? b.run.date})` : ''}`)
      .join('; ');
    const races = getRaces()
      .map((r) => `${r.date} ${r.race?.name} ${r.distanceKm} km in ${formatDuration(r.elapsedSec ?? r.durationSec)}`)
      .join('; ');
    out.push(
      `## Running\nRazeen runs road races. Data synced from Garmin and Strava; treadmill runs excluded. ${t.runs} outdoor runs, ${t.km.toFixed(0)} km since ${t.since}. Personal bests (fastest efforts): ${pbs}. Races: ${races}. Running page: ${SITE_URL}/running`,
    );
  }

  const byIssuer = new Map<string, string[]>();
  achievements.forEach((a) => byIssuer.set(a.organization, [...(byIssuer.get(a.organization) ?? []), `${a.title} (${a.issuedDate})`]));
  out.push(
    `## Certifications & courses (${achievements.length})\n${[...byIssuer.entries()].map(([org, list]) => `- ${org}: ${list.join('; ')}`).join('\n')}`,
  );

  return out.join('\n\n');
}
