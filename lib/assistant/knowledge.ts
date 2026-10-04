/**
 * Builds the assistant's knowledge base from the site's own content, so the chatbot
 * can only draw on what the site already says. The output is deterministic (no dates,
 * no random ordering), which keeps the system prompt byte-identical between requests
 * and therefore cacheable.
 */
import { profile, contact, education, recognition, bio } from '@/content/profile';
import { getExperience, getRoleForProject } from '@/content/experience';
import { getTrainerEngagements } from '@/content/trainer';
import { getLifeInterests } from '@/content/life';
import { getProjects, getPrimaryBuilds } from '@/content/projects';
import { getCaseStudy, type Block } from '@/content/case-studies';
import { achievements, credentialTypeLabel } from '@/content/achievements';
import { capabilities } from '@/content/capabilities';
import { aboutHero, aboutStages, moments, whyBuild, howIWork, principles, learning, currently, beyond } from '@/content/story';
import { availability, helpWith } from '@/content/contact';
import { getPublishedJournalEntries } from '@/content/notes';
import { isSampleData, getTotals, getPersonalBests, getRaces, formatDuration } from '@/content/running';
import { SITE_URL, primaryNav, utilityNav } from '@/lib/site';

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
    case 'gallery':
      return `Screens: ${b.items.map((i) => i.caption).filter(Boolean).join('; ')}`;
  }
}

export function buildKnowledge(): string {
  const out: string[] = [];

  out.push(`# Razeen Iqbal\nRole: ${profile.role}\nLocation: ${profile.location}\nStatus: ${availability.headline}. ${availability.detail}`);
  out.push(`Statement: ${profile.statement.join(' ')}\n${profile.supporting}`);
  out.push(`Languages: ${profile.languages.join(', ')}`);
  out.push(`Contact: email ${contact.email}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}. Contact page: ${SITE_URL}/contact. Online resume: ${SITE_URL}/resume.`);

  out.push(`## Summary\n${bio.short}`);

  // The site map comes from the navigation itself; routes owned by a section (/running under Life) are named.
  out.push(
    `## Site sections\n${primaryNav
      .map((s) => `- ${s.label}: ${SITE_URL}${s.href}${s.also.length ? ` (also ${s.also.map((a) => `${SITE_URL}${a}`).join(', ')}, which belongs to ${s.label})` : ''}`)
      .join('\n')}\nUtilities: ${utilityNav.map((u) => `${u.label} ${SITE_URL}${u.href}`).join(', ')}.`,
  );

  // About: why the path happened, in Razeen's own words (content/data/story.json). Dates and roles are in Experience.
  out.push(
    [
      `## About: why the path happened (${SITE_URL}/about; written in Razeen's own words)`,
      `${aboutHero.title.join(' ')} ${aboutHero.lede.join(' ')}`,
      `The path: ${aboutStages.map((s) => `${s.label} (${s.detail})`).join(' → ')}.`,
      ...moments.map((m) => `### ${m.eyebrow}\n${[...m.body, ...m.questions, ...m.after].join(' ')}`),
      `### ${whyBuild.eyebrow}: ${whyBuild.title.join(' ')}\n${whyBuild.origins
        .map((o) => `${o.lead} ${o.text} That became ${o.project.title} (${o.label}; ${SITE_URL}/projects/${o.project.slug}).`)
        .join('\n')}\n${whyBuild.after.join(' ')}`,
      `### ${howIWork.eyebrow}: ${howIWork.title.join(' ')}\n${howIWork.body.join(' ')} The loop: ${principles.map((p) => `${p.title} (${p.detail})`).join(' → ')}.`,
      `### ${learning.eyebrow}: ${learning.title.join(' ')}\n${learning.body.join(' ')} Growth loop: ${profile.loops.system.join(' → ')}. Details of the sessions: ${SITE_URL}/trainer.`,
      `### Currently\nWorking on: ${currently.working.join(', ')}. Building: ${currently.building.map((p) => p.title).join(', ')}. Exploring: ${currently.exploring.join(', ')}. Sharing: ${currently.sharing.join(', ')}.`,
      `### ${beyond.eyebrow}\n${beyond.body.join(' ')}`,
    ].join('\n'),
  );

  // Career from the canonical record. Unconfirmed dates are said to be unconfirmed, never guessed;
  // confidential roles stay high-level (no client or project detail is stored for them).
  out.push(
    `## Experience\n${getExperience()
      .map((r) => {
        const when = r.datesConfirmed ? r.period : `${r.employmentType ?? 'role'}, dates not confirmed on the site`;
        const head = `### ${r.role}, ${r.company} (${[when, r.location, r.relationship === 'parallel' ? 'parallel to the main career' : ''].filter(Boolean).join(', ')})`;
        const lines = [
          r.summary,
          ...r.responsibilities.map((x) => `- ${x}`),
          r.careerSignificance && `Career significance: ${r.careerSignificance}`,
          r.confidential && 'Client and project details are confidential.',
          ...r.selectedWork
            .filter((w) => w.visibility === 'public')
            .map(
              (w) =>
                `- Selected work: ${w.name} (${[w.context, w.type, w.scale, w.status].filter(Boolean).join(', ')}). ${w.description}${w.recognition ? ` ${w.recognition}.` : ''} Technology: ${w.technologies.join(', ') || 'not specified'}. AI used: ${w.aiUsed ? 'yes' : 'no'}.`,
            ),
        ];
        return [head, ...lines.filter(Boolean)].join('\n');
      })
      .join('\n')}`,
  );

  out.push(
    `## Training and speaking\n${getTrainerEngagements()
      .map((e) => {
        const when = e.dateStart ? `${e.dateStart}${e.dateEnd && e.dateEnd !== e.dateStart ? ` to ${e.dateEnd}` : ''}` : e.year ? String(e.year) : '';
        const meta = [e.organization + (e.partners.length ? ` with ${e.partners.join(', ')}` : ''), e.role, when, e.format].filter(Boolean).join('; ');
        return `- ${e.title} (${meta}). ${e.summary} Topics: ${e.topics.join(', ')}.`;
      })
      .join('\n')}`,
  );

  out.push(
    `## Life (section page: ${SITE_URL}/life; the descriptions are in Razeen's own words)\n${getLifeInterests()
      .map((l) => {
        const project = l.relatedProject ? getProjects().find((p) => p.slug === l.relatedProject) : undefined;
        return `- ${l.name} (${l.type}). ${(l.story.length ? l.story.map((s) => s.text) : l.body).join(' ')}${project ? ` This interest led to the project ${project.title}.` : ''} Page: ${SITE_URL}${l.href}`;
      })
      .join('\n')}`,
  );

  out.push(`## Education\n${education.map((e) => `- ${e.degree} in ${e.field}, ${e.institution} (${e.period}), CGPA ${e.cgpa}`).join('\n')}`);
  out.push(`## Recognition\n${recognition.map((r) => `- ${r.year}: ${r.title}. ${r.detail}`).join('\n')}`);
  out.push(`## Capabilities\n${capabilities.map((c) => `- ${c.group}: ${c.items.join(', ')}`).join('\n')}`);
  out.push(`## What Razeen can help with\n${helpWith.map((h) => `- ${h.title}: ${h.detail}`).join('\n')}`);

  out.push(
    `## Projects\nPrimary builds (Razeen's own, in order): ${getPrimaryBuilds()
      .map((p) => `${p.title}${p.origin ? ` (${p.origin})` : ''}`)
      .join(', ')}. Other projects are professional systems, research and experiments.\n${getProjects()
      .map((p) => {
        const links = [p.links.live && `live: ${p.links.live}`, p.links.source && `source: ${p.links.source}`].filter(Boolean).join(', ');
        const study = getCaseStudy(p.slug);
        const detail = study
          ? `\nCase study: ${study.lede}\n${study.sections.map((s) => `#### ${s.headline}\n${s.blocks.map(blockText).filter(Boolean).join('\n')}`).join('\n')}`
          : '';
        const role = getRoleForProject(p.slug);
        const owner = role ? `\nBelongs to Razeen's work at ${role.company} (${role.role}); see ${SITE_URL}/experience#${role.id}.` : '';
        return `### ${p.title} (${p.year}, ${p.status}, ${p.kind.replace('-', ' ')}${p.placeholder ? ', details still being written' : ''})\n${p.summary}${owner}\nStack: ${p.stack.join(', ')}${links ? `\n${links}` : ''}${p.confidential ? '\nRepository is private.' : ''}\nPage: ${SITE_URL}/projects/${p.slug}${detail}`;
      })
      .join('\n')}`,
  );

  // Only published entries; drafts and archived entries are never shared.
  const published = getPublishedJournalEntries();
  // Journal entries are Razeen's first-person reflections. They explain why and how he thinks about
  // something; the project sections above remain the source of truth for what a project is and does.
  out.push(
    `## Journal (Razeen's reflections, at ${SITE_URL}/journal)\nThese are opinions and reasoning in Razeen's own voice, not product facts. When a journal entry and a project section above differ on what a project does or contains, the project section is correct.\n${
      published.length
        ? published
            .map(
              (n) =>
                `### ${n.title} (${n.category}, published ${n.date}${n.relatedProject ? `, about the ${n.relatedProject} project` : ''})\n${n.description}\nPage: ${SITE_URL}/journal/${n.slug}\n${n.body
                  .map((b) => (b.kind === 'heading' ? `#### ${b.text}` : b.kind === 'text' ? b.body.join('\n') : b.kind === 'bullets' ? b.items.map((i) => `- ${i}`).join('\n') : ''))
                  .filter(Boolean)
                  .join('\n')}`,
            )
            .join('\n\n')
        : 'No journal entries are published yet.'
    }`,
  );

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
  achievements.forEach((a) => byIssuer.set(a.organization, [...(byIssuer.get(a.organization) ?? []), `${a.title} (${credentialTypeLabel[a.type].toLowerCase()}${a.issuedDate ? `, ${a.issuedDate}` : ''})`]));
  out.push(
    `## Credentials (${achievements.length}: certifications, accreditations, skill badges, courses, programmes and registrations; each line names its type)\n${[...byIssuer.entries()].map(([org, list]) => `- ${org}: ${list.join('; ')}`).join('\n')}`,
  );

  return out.join('\n\n');
}
