/**
 * Keystatic admin (/keystatic). Edits the JSON files in content/data.
 * - Development: saves straight to the local files.
 * - Production: signs in with GitHub and commits edits to the repo (Vercel then redeploys).
 *   Needs the Keystatic GitHub App env vars; see docs/v2/ADMIN.md.
 * Every key in the JSON files must exist in these schemas: Keystatic drops unknown keys on save.
 */
import { config, collection, singleton, fields } from '@keystatic/core';
import { assets, type ImageAsset } from '@/lib/assets';

// ── Shared options ──────────────────────────────────────────────────────────
const assetOptions = [
  { label: 'None', value: 'none' },
  ...Object.entries(assets).flatMap(([group, items]) =>
    Object.entries(items as Record<string, ImageAsset>).map(([key, a]) => ({ label: `${group} / ${key} (${a.alt.slice(0, 40)})`, value: `${group}.${key}` })),
  ),
];
const poseOptions = [
  { label: 'None', value: 'none' },
  ...Object.keys(assets.miniRazeen).map((k) => ({ label: k, value: k })),
];

const imageSelect = (label: string) => fields.select({ label, options: assetOptions, defaultValue: 'none' });

const textList = (label: string, itemLabel = 'Item') =>
  fields.array(fields.text({ label: itemLabel }), { label, itemLabel: (p) => p.value || itemLabel });

const paragraphList = (label: string) =>
  fields.array(fields.text({ label: 'Paragraph', multiline: true }), { label, itemLabel: (p) => p.value.slice(0, 70) || 'Paragraph' });

const NODE_TYPES = ['SOURCE', 'PROCESS', 'DATABASE', 'API', 'MODEL', 'AGENT', 'USER', 'OUTPUT', 'MONITOR'].map((v) => ({ label: v, value: v }));

// Content blocks shared by case studies and notes (mirrors content/case-studies/types.ts).
const contentBlocks = (label: string) =>
  fields.blocks(
    {
      text: {
        label: 'Text',
        schema: fields.object({
          lead: fields.checkbox({ label: 'Lead (larger text)' }),
          body: paragraphList('Paragraphs'),
        }),
      },
      list: {
        label: 'List',
        schema: fields.object({
          numbered: fields.checkbox({ label: 'Numbered' }),
          items: fields.array(
            fields.object({ title: fields.text({ label: 'Title' }), detail: fields.text({ label: 'Detail', multiline: true }) }),
            { label: 'Items', itemLabel: (p) => p.fields.title.value || 'Item' },
          ),
        }),
      },
      steps: {
        label: 'Steps (A → B → C)',
        schema: fields.object({ label: fields.text({ label: 'Accessible label' }), steps: textList('Steps', 'Step') }),
      },
      flow: {
        label: 'Architecture flow diagram',
        schema: fields.object({
          label: fields.text({ label: 'Accessible label' }),
          caption: fields.text({ label: 'Caption' }),
          nodes: fields.array(
            fields.object({
              type: fields.select({ label: 'Node type', options: NODE_TYPES, defaultValue: 'PROCESS' }),
              title: fields.text({ label: 'Title' }),
              detail: fields.text({ label: 'Detail', multiline: true }),
              active: fields.checkbox({ label: 'Highlight (active node)' }),
            }),
            { label: 'Nodes', itemLabel: (p) => `${p.fields.type.value} · ${p.fields.title.value}` },
          ),
        }),
      },
      metrics: {
        label: 'Metrics',
        schema: fields.object({
          items: fields.array(
            fields.object({
              label: fields.text({ label: 'Label' }),
              value: fields.text({ label: 'Value' }),
              note: fields.text({ label: 'Note' }),
              illustrative: fields.checkbox({ label: 'Illustrative (not a real measurement)' }),
            }),
            { label: 'Metrics', itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}` },
          ),
        }),
      },
      table: {
        label: 'Table',
        schema: fields.object({
          caption: fields.text({ label: 'Caption' }),
          columns: fields.text({ label: 'Columns (separate with |)' }),
          rows: fields.array(fields.text({ label: 'Row (cells separated with |)' }), { label: 'Rows', itemLabel: (p) => p.value || 'Row' }),
          note: fields.text({ label: 'Note' }),
          highlightRow: fields.integer({ label: 'Highlight row (0 = first, empty = none)' }),
        }),
      },
      image: {
        label: 'Image',
        schema: fields.object({ image: imageSelect('Image'), caption: fields.text({ label: 'Caption' }) }),
      },
    },
    { label },
  );

const json = { data: 'json' } as const;

export default config({
  // Production always uses GitHub (never write to the server's disk). Locally, set
  // NEXT_PUBLIC_KEYSTATIC_STORAGE=github to run the one-time GitHub App setup.
  storage:
    process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: { owner: 'razeeniqbal', name: process.env.NEXT_PUBLIC_KEYSTATIC_REPO || 'portfolio-v1.0' } }
      : { kind: 'local' },
  ui: {
    brand: { name: 'razeeniqbal. admin' },
    navigation: {
      Site: ['profile', 'home', 'story', 'contact', 'assistant'],
      Work: ['projects', 'caseStudies', 'experience', 'capabilities', 'achievements'],
      Writing: ['notes', 'lab'],
    },
  },

  singletons: {
    profile: singleton({
      label: 'Profile & identity',
      path: 'content/data/profile',
      format: json,
      schema: {
        name: fields.text({ label: 'Name' }),
        wordmark: fields.text({ label: 'Wordmark' }),
        umbrella: fields.text({ label: 'Umbrella brand' }),
        statement: textList('Hero statement lines', 'Line'),
        supporting: fields.text({ label: 'Supporting line', multiline: true }),
        role: fields.text({ label: 'Role' }),
        disciplines: textList('Disciplines', 'Discipline'),
        loops: fields.object(
          {
            philosophy: textList('Philosophy loop'),
            system: textList('System loop'),
            journey: textList('Journey loop'),
          },
          { label: 'Loops' },
        ),
        location: fields.text({ label: 'Location' }),
        coordinates: fields.object(
          { lat: fields.text({ label: 'Latitude' }), lng: fields.text({ label: 'Longitude' }), label: fields.text({ label: 'Short label' }) },
          { label: 'Coordinates' },
        ),
        status: fields.text({ label: 'Status line' }),
        languages: textList('Languages', 'Language'),
        resume: fields.text({ label: 'Resume PDF path', defaultValue: '/Razeen_Iqbal_Resume.pdf' }),
        domains: fields.object(
          { umbrella: fields.text({ label: 'Umbrella domain' }), portfolio: fields.text({ label: 'Portfolio domain' }) },
          { label: 'Domains' },
        ),
        contact: fields.object(
          {
            email: fields.text({ label: 'Email' }),
            github: fields.url({ label: 'GitHub URL' }),
            linkedin: fields.url({ label: 'LinkedIn URL' }),
            phone: fields.text({ label: 'Phone (not shown on V2)' }),
          },
          { label: 'Contact' },
        ),
        education: fields.array(
          fields.object({
            institution: fields.text({ label: 'Institution' }),
            short: fields.text({ label: 'Short name' }),
            degree: fields.text({ label: 'Degree' }),
            field: fields.text({ label: 'Field' }),
            period: fields.text({ label: 'Period' }),
            location: fields.text({ label: 'Location' }),
            cgpa: fields.text({ label: 'CGPA' }),
          }),
          { label: 'Education', itemLabel: (p) => `${p.fields.degree.value} · ${p.fields.short.value}` },
        ),
        recognition: fields.array(
          fields.object({ year: fields.text({ label: 'Year' }), title: fields.text({ label: 'Title' }), detail: fields.text({ label: 'Detail' }) }),
          { label: 'Recognition', itemLabel: (p) => p.fields.title.value },
        ),
        bio: fields.object({ short: fields.text({ label: 'Short bio', multiline: true }), story: paragraphList('Long bio (V1 & assistant)') }, { label: 'Bio' }),
      },
    }),

    home: singleton({
      label: 'Homepage copy',
      path: 'content/data/home',
      format: json,
      schema: {
        intro: fields.object(
          {
            title: textList('Title lines', 'Line'),
            pillars: textList('Pillars', 'Pillar'),
            lead: fields.text({ label: 'Lead', multiline: true }),
            body: fields.text({ label: 'Body', multiline: true }),
          },
          { label: '01 · Intro' },
        ),
        featured: fields.object(
          {
            project: fields.text({ label: 'Project slug (for the case-study link)' }),
            eyebrow: fields.text({ label: 'Eyebrow' }),
            title: textList('Title lines', 'Line'),
            lead: fields.text({ label: 'Lead', multiline: true }),
            body: fields.text({ label: 'Body', multiline: true }),
          },
          { label: '03 · Featured system' },
        ),
        aboutTeaser: fields.object(
          { title: textList('Title lines', 'Line'), body: fields.text({ label: 'Body', multiline: true }) },
          { label: '10 · About teaser' },
        ),
      },
    }),

    story: singleton({
      label: 'About · story',
      path: 'content/data/story',
      format: json,
      schema: {
        intro: fields.object(
          {
            file: fields.text({ label: 'File label (e.g. story.log)' }),
            path: fields.text({ label: 'Path label' }),
            title: textList('Title lines', 'Line'),
            lede: fields.text({ label: 'Lede', multiline: true }),
            body: paragraphList('Intro paragraphs (1–2)'),
            note: fields.text({ label: 'Note', multiline: true }),
          },
          { label: 'Intro' },
        ),
        beyond: fields.object(
          { title: textList('Title lines', 'Line'), body: paragraphList('Paragraphs') },
          { label: 'Beyond the screen' },
        ),
        chapters: fields.array(
          fields.object({
            stage: fields.text({ label: 'Stage (e.g. Civil engineering)' }),
            period: fields.text({ label: 'Period (include “now” for the current chapter)' }),
            title: fields.text({ label: 'Title' }),
            body: paragraphList('Paragraphs'),
            photo: imageSelect('Photo'),
            photoCaption: fields.text({ label: 'Photo caption' }),
            pose: fields.select({ label: 'Mini Razeen (use sparingly)', options: poseOptions, defaultValue: 'none' }),
            credentialTitle: fields.text({ label: 'Credential title (optional)' }),
            credentialIssuer: fields.text({ label: 'Credential issuer' }),
            credentialDate: fields.text({ label: 'Credential date' }),
            credentialUrl: fields.text({ label: 'Credential verify URL' }),
          }),
          { label: 'Path chapters (About)', itemLabel: (p) => `${p.fields.stage.value} · ${p.fields.period.value}` },
        ),
        outro: fields.text({ label: 'Closing line' }),
        path: fields.array(fields.object({ label: fields.text({ label: 'Stage' }), year: fields.text({ label: 'Year' }) }), {
          label: 'Path steps (Home teaser)',
          itemLabel: (p) => `${p.fields.year.value} · ${p.fields.label.value}`,
        }),
        principles: fields.array(fields.object({ title: fields.text({ label: 'Step' }), detail: fields.text({ label: 'Detail', multiline: true }) }), {
          label: 'How I work',
          itemLabel: (p) => p.fields.title.value,
        }),
      },
    }),

    contact: singleton({
      label: 'Contact page',
      path: 'content/data/contact',
      format: json,
      schema: {
        availability: fields.object(
          {
            open: fields.checkbox({ label: 'Open to opportunities', defaultValue: true }),
            headline: fields.text({ label: 'Headline' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          },
          { label: 'Availability' },
        ),
        helpWith: fields.array(
          fields.object({ title: fields.text({ label: 'Title' }), detail: fields.text({ label: 'Detail', multiline: true }) }),
          { label: 'Where I can help', itemLabel: (p) => p.fields.title.value },
        ),
        quickAnswers: fields.array(
          fields.object({ q: fields.text({ label: 'Question' }), a: fields.text({ label: 'Answer', multiline: true }) }),
          { label: 'Quick answers', itemLabel: (p) => p.fields.q.value },
        ),
      },
    }),

    assistant: singleton({
      label: 'Chat assistant',
      path: 'content/data/assistant',
      format: json,
      schema: {
        name: fields.text({ label: 'Name' }),
        greeting: fields.text({ label: 'Greeting', multiline: true }),
        suggestions: textList('Suggested questions', 'Question'),
        offline: fields.text({ label: 'Offline message', multiline: true }),
        disclaimer: fields.text({ label: 'Disclaimer' }),
      },
    }),

    projects: singleton({
      label: 'Projects',
      path: 'content/data/projects',
      format: json,
      schema: {
        items: fields.array(
          fields.object({
            slug: fields.text({ label: 'Slug (URL: /projects/<slug>)' }),
            number: fields.text({ label: 'Number (e.g. 001)' }),
            title: fields.text({ label: 'Title' }),
            year: fields.integer({ label: 'Year' }),
            category: fields.select({
              label: 'Category',
              options: [
                { label: 'AI Systems', value: 'ai' },
                { label: 'Data Engineering', value: 'data' },
                { label: 'Product', value: 'product' },
                { label: 'Analytics', value: 'analytics' },
                { label: 'Research', value: 'research' },
              ],
              defaultValue: 'data',
            }),
            status: fields.select({
              label: 'Status',
              options: ['live', 'in-progress', 'shipped', 'prototype', 'archived'].map((v) => ({ label: v, value: v })),
              defaultValue: 'shipped',
            }),
            tier: fields.select({
              label: 'Tier (where it shows)',
              options: [
                { label: 'Flagship (homepage hero, keep to 1)', value: 'flagship' },
                { label: 'Featured (large tile)', value: 'featured' },
                { label: 'Standard (listed)', value: 'standard' },
                { label: 'Archive (earlier work)', value: 'archive' },
              ],
              defaultValue: 'standard',
            }),
            order: fields.integer({ label: 'Order within tier (lower first)', defaultValue: 1 }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            role: fields.text({ label: 'Role' }),
            problem: fields.text({ label: 'Problem', multiline: true }),
            outcome: fields.text({ label: 'Outcome', multiline: true }),
            learning: fields.text({ label: 'Learning', multiline: true }),
            stack: textList('Stack', 'Technology'),
            tags: textList('Tags', 'Tag'),
            links: fields.object({ live: fields.text({ label: 'Live URL' }), source: fields.text({ label: 'Source URL' }) }, { label: 'Links' }),
            confidential: fields.checkbox({ label: 'Private repo / confidential' }),
            cover: imageSelect('Cover image'),
            metrics: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                value: fields.text({ label: 'Value' }),
                illustrative: fields.checkbox({ label: 'Illustrative (not real)' }),
              }),
              { label: 'Metrics', itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}` },
            ),
            caseStudy: fields.checkbox({ label: 'Has a case study' }),
            draft: fields.checkbox({ label: 'Draft (hidden everywhere)' }),
            placeholder: fields.checkbox({ label: 'Placeholder (shows “details coming”)' }),
          }),
          { label: 'Projects', itemLabel: (p) => `${p.fields.number.value} · ${p.fields.title.value} · ${p.fields.tier.value}` },
        ),
      },
    }),

    experience: singleton({
      label: 'Experience',
      path: 'content/data/experience',
      format: json,
      schema: {
        roles: fields.array(
          fields.object({
            company: fields.text({ label: 'Company' }),
            role: fields.text({ label: 'Role' }),
            period: fields.text({ label: 'Period' }),
            start: fields.integer({ label: 'Start year' }),
            location: fields.text({ label: 'Location' }),
            type: fields.select({
              label: 'Work mode',
              options: ['Hybrid', 'Onsite', 'Remote', 'Full-time', 'Part-time', 'Internship'].map((v) => ({ label: v, value: v })),
              defaultValue: 'Onsite',
            }),
            highlights: textList('Highlights', 'Highlight'),
            worked: fields.text({ label: 'What I worked on (optional)', multiline: true }),
            changed: fields.text({ label: 'What changed (optional)', multiline: true }),
            learned: fields.text({ label: 'What I learned (optional)', multiline: true }),
          }),
          { label: 'Roles', itemLabel: (p) => `${p.fields.role.value} · ${p.fields.company.value}` },
        ),
      },
    }),

    capabilities: singleton({
      label: 'Capabilities',
      path: 'content/data/capabilities',
      format: json,
      schema: {
        groups: fields.array(fields.object({ group: fields.text({ label: 'Group' }), items: textList('Items') }), {
          label: 'Groups',
          itemLabel: (p) => p.fields.group.value,
        }),
      },
    }),

    achievements: singleton({
      label: 'Credentials',
      path: 'content/data/achievements',
      format: json,
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            title: fields.text({ label: 'Title' }),
            organization: fields.text({ label: 'Issuer' }),
            issuedDate: fields.text({ label: 'Issued (e.g. April 2025)' }),
            description: fields.text({ label: 'Description', multiline: true }),
            category: fields.select({
              label: 'Category',
              options: ['certification', 'award', 'course', 'achievement'].map((v) => ({ label: v, value: v })),
              defaultValue: 'certification',
            }),
            image: fields.text({ label: 'Image path (V1 only)' }),
            credentialUrl: fields.text({ label: 'Verify URL' }),
            credentialId: fields.text({ label: 'Credential ID' }),
            featured: fields.checkbox({ label: 'Featured (Home hero + Resume, pick 3–4)', defaultValue: false }),
          }),
          { label: 'Credentials', itemLabel: (p) => `${p.fields.title.value} · ${p.fields.organization.value}` },
        ),
      },
    }),

    lab: singleton({
      label: 'Lab',
      path: 'content/data/lab',
      format: json,
      schema: {
        experiments: fields.array(
          fields.object({
            slug: fields.text({ label: 'Slug' }),
            title: fields.text({ label: 'Title' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            status: fields.select({
              label: 'Status',
              options: ['live', 'prototype', 'planned'].map((v) => ({ label: v, value: v })),
              defaultValue: 'prototype',
            }),
            href: fields.text({ label: 'Link' }),
            external: fields.checkbox({ label: 'External link' }),
          }),
          { label: 'Experiments', itemLabel: (p) => `${p.fields.title.value} · ${p.fields.status.value}` },
        ),
        exploring: fields.array(fields.object({ label: fields.text({ label: 'Label' }), detail: fields.text({ label: 'Detail' }) }), {
          label: 'Currently exploring (homepage)',
          itemLabel: (p) => p.fields.label.value,
        }),
      },
    }),
  },

  collections: {
    caseStudies: collection({
      label: 'Case studies',
      slugField: 'project',
      path: 'content/data/case-studies/*',
      format: json,
      schema: {
        project: fields.slug({ name: { label: 'Project title (the slug must match the project slug)' } }),
        review: fields.select({
          label: 'Review status',
          options: [
            { label: 'Draft (shows “under review” label)', value: 'draft' },
            { label: 'Approved', value: 'approved' },
          ],
          defaultValue: 'draft',
        }),
        lede: fields.text({ label: 'Lede', multiline: true }),
        facts: fields.array(fields.object({ label: fields.text({ label: 'Label' }), value: fields.text({ label: 'Value' }) }), {
          label: 'Facts',
          itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}`,
        }),
        disclaimer: fields.text({ label: 'Disclaimer (optional)', multiline: true }),
        sections: fields.array(
          fields.object({
            id: fields.select({
              label: 'Section',
              options: ['overview', 'problem', 'idea', 'architecture', 'data', 'build', 'interface', 'outcome', 'learned'].map((v) => ({
                label: v,
                value: v,
              })),
              defaultValue: 'overview',
            }),
            headline: fields.text({ label: 'Headline' }),
            surface: fields.select({
              label: 'Surface',
              options: [
                { label: 'Default for this section', value: 'default' },
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
              ],
              defaultValue: 'default',
            }),
            blocks: contentBlocks('Content'),
          }),
          { label: 'Sections', itemLabel: (p) => `${p.fields.id.value} · ${p.fields.headline.value}` },
        ),
      },
    }),

    notes: collection({
      label: 'Journal',
      slugField: 'title',
      path: 'content/data/notes/*',
      format: json,
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        number: fields.text({ label: 'Number (e.g. 004)' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        topic: fields.select({
          label: 'Topic',
          options: ['Data Engineering', 'AI', 'Product', 'Architecture', 'Running', 'Retrospective'].map((v) => ({ label: v, value: v })),
          defaultValue: 'Data Engineering',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft (readable by link, not indexed)', value: 'draft' },
            { label: 'In writing (title only)', value: 'in-writing' },
          ],
          defaultValue: 'in-writing',
        }),
        date: fields.date({ label: 'Published date' }),
        readingMinutes: fields.integer({ label: 'Reading minutes' }),
        body: contentBlocks('Body'),
      },
    }),
  },
});
