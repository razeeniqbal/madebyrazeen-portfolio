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
      Site: ['profile', 'home', 'story', 'contact', 'assistant', 'life'],
      Work: ['experience', 'trainer', 'projects', 'caseStudies', 'capabilities', 'achievements'],
      Writing: ['notes'],
    },
  },

  singletons: {
    profile: singleton({
      label: 'Profile & identity',
      path: 'content/data/profile',
      format: json,
      schema: {
        name: fields.text({ label: 'Name' }),
        legalName: fields.text({ label: 'Full legal name (resume header)' }),
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
        resumeDomains: textList('Resume: professional domains', 'Domain'),
        resumeProfile: paragraphList('Resume: profile'),
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
        bio: fields.object({ short: fields.text({ label: 'Short bio', multiline: true }) }, { label: 'Bio' }),
      },
    }),

    home: singleton({
      label: 'Homepage copy',
      path: 'content/data/home',
      format: json,
      schema: {
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
        hero: fields.object({ title: textList('Title lines', 'Line'), lede: paragraphList('Supporting copy') }, { label: 'Hero' }),
        stages: fields.array(fields.object({ label: fields.text({ label: 'Stage' }), detail: fields.text({ label: 'Detail' }) }), {
          label: 'The path (Engineering → Data → AI → Build)',
          itemLabel: (p) => p.fields.label.value,
        }),
        moments: fields.array(
          fields.object({
            id: fields.text({ label: 'Anchor id' }),
            eyebrow: fields.text({ label: 'Label' }),
            title: textList('Heading lines', 'Line'),
            body: paragraphList('Paragraphs before the questions'),
            questions: textList('Questions (shown with emphasis)', 'Question'),
            after: paragraphList('Paragraphs after the questions'),
            linkLabel: fields.text({ label: 'Link label (optional)' }),
            linkHref: fields.text({ label: 'Link target, e.g. /experience#gnp-geotechnic' }),
          }),
          { label: 'Narrative moments', itemLabel: (p) => p.fields.eyebrow.value },
        ),
        whyBuild: fields.object(
          {
            eyebrow: fields.text({ label: 'Label' }),
            title: textList('Heading lines', 'Line'),
            origins: fields.array(
              fields.object({
                lead: fields.text({ label: 'Lead line' }),
                text: fields.text({ label: 'What happened', multiline: true }),
                projectSlug: fields.text({ label: 'Project slug (title and status come from Projects)' }),
                label: fields.text({ label: 'Relation, e.g. Work problem → Engineering tool' }),
              }),
              { label: 'Project origins', itemLabel: (p) => p.fields.projectSlug.value },
            ),
            after: paragraphList('Closing paragraphs'),
          },
          { label: 'Why I build' },
        ),
        howIWork: fields.object(
          { eyebrow: fields.text({ label: 'Label' }), title: textList('Heading lines', 'Line'), body: paragraphList('Paragraphs') },
          { label: 'How I work' },
        ),
        principles: fields.array(fields.object({ title: fields.text({ label: 'Step' }), detail: fields.text({ label: 'Detail', multiline: true }) }), {
          label: 'How I work: the loop',
          itemLabel: (p) => p.fields.title.value,
        }),
        learning: fields.object(
          { eyebrow: fields.text({ label: 'Label' }), title: textList('Heading lines', 'Line'), body: paragraphList('Paragraphs') },
          { label: 'Learning and sharing (the loop itself is Profile › Loops › System)' },
        ),
        currently: fields.object(
          {
            working: textList('Working on', 'Item'),
            building: textList('Building (project slugs)', 'Slug'),
            exploring: textList('Exploring', 'Item'),
            sharing: textList('Sharing', 'Item'),
          },
          { label: 'Currently' },
        ),
        beyond: fields.object(
          { eyebrow: fields.text({ label: 'Label' }), title: textList('Heading lines', 'Line'), body: paragraphList('Paragraphs') },
          { label: 'Away from the screen' },
        ),
        closing: fields.object({ title: textList('Heading lines', 'Line') }, { label: 'Closing' }),
        path: fields.array(fields.object({ label: fields.text({ label: 'Stage' }), year: fields.text({ label: 'Year' }) }), {
          label: 'Path steps (Home teaser)',
          itemLabel: (p) => `${p.fields.year.value} · ${p.fields.label.value}`,
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
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Under construction', value: 'under-construction' },
                { label: 'Proof of concept', value: 'proof-of-concept' },
                { label: 'Completed', value: 'completed' },
                { label: 'Archived', value: 'archived' },
              ],
              defaultValue: 'active',
            }),
            kind: fields.select({
              label: 'Kind (portfolio hierarchy)',
              options: [
                { label: 'Primary build', value: 'primary-build' },
                { label: 'Professional system', value: 'professional-system' },
                { label: 'Experiment', value: 'experiment' },
                { label: 'Research', value: 'research' },
                { label: 'Small build', value: 'small-build' },
              ],
              defaultValue: 'experiment',
            }),
            tagline: fields.text({ label: 'Tagline' }),
            fullName: fields.text({ label: 'Full name (e.g. Volleyball SDN BHD)' }),
            origin: fields.text({ label: 'Origin (e.g. Personal interest → Real product)' }),
            loop: textList('Core loop (step by step)', 'Step'),
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
            resume: fields.checkbox({ label: 'List under Selected projects on the resume' }),
            order: fields.integer({ label: 'Order within tier (lower first)', defaultValue: 1 }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            role: fields.text({ label: 'Role' }),
            problem: fields.text({ label: 'Problem', multiline: true }),
            outcome: fields.text({ label: 'Outcome', multiline: true }),
            learning: fields.text({ label: 'Learning', multiline: true }),
            highlights: textList('What I built (bullets)', 'Point'),
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
            visibility: fields.select({ label: 'Visibility', options: [{ label: 'Public', value: 'public' }, { label: 'Private (never shown)', value: 'private' }], defaultValue: 'public' }),
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
            id: fields.text({ label: 'ID (stable, kebab-case)' }),
            company: fields.text({ label: 'Company' }),
            role: fields.text({ label: 'Role' }),
            employmentType: fields.select({
              label: 'Employment type',
              options: [{ label: 'Not set', value: '' }, { label: 'Permanent', value: 'permanent' }, { label: 'Contract', value: 'contract' }, { label: 'Full-time', value: 'full-time' }, { label: 'Part-time', value: 'part-time' }, { label: 'Internship', value: 'internship' }],
              defaultValue: '',
            }),
            workMode: fields.select({
              label: 'Work mode',
              options: [{ label: 'Not set', value: '' }, { label: 'Hybrid', value: 'Hybrid' }, { label: 'Onsite', value: 'Onsite' }, { label: 'Remote', value: 'Remote' }],
              defaultValue: '',
            }),
            startDate: fields.date({ label: 'Start date' }),
            endDate: fields.date({ label: 'End date (empty while current)' }),
            isCurrent: fields.checkbox({ label: 'Current role' }),
            datesConfirmed: fields.checkbox({ label: 'Dates confirmed (unchecked: dates are never shown)', defaultValue: true }),
            relationship: fields.select({
              label: 'Relationship',
              options: [{ label: 'Primary career', value: 'primary' }, { label: 'Parallel (alongside the primary role)', value: 'parallel' }],
              defaultValue: 'primary',
            }),
            stage: fields.text({ label: 'Career-map stage (Site, Model, Data, Pipelines, AI systems; empty for parallel roles)' }),
            discipline: fields.text({ label: 'Discipline at that stage (e.g. BIM, AI data engineering)' }),
            location: fields.text({ label: 'Location' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            headline: fields.text({ label: 'Experience page: editorial heading (optional)' }),
            narrative: paragraphList('Experience page: the story of the role'),
            responsibilities: textList('Resume: factual responsibilities', 'Responsibility'),
            technologies: textList('Technologies', 'Technology'),
            careerSignificance: fields.text({ label: 'Career significance', multiline: true }),
            progression: textList('Conceptual progression (step by step)', 'Step'),
            selectedWork: fields.array(
              fields.object({
                id: fields.text({ label: 'ID' }),
                name: fields.text({ label: 'Name' }),
                tier: fields.select({
                  label: 'Weight on the Experience page',
                  options: [
                    { label: 'Featured system', value: 'featured' },
                    { label: 'Supporting work', value: 'supporting' },
                    { label: 'Small build', value: 'small' },
                  ],
                  defaultValue: 'supporting',
                }),
                headline: fields.text({ label: 'Editorial heading (optional)' }),
                context: fields.text({ label: 'Context (e.g. client or product)' }),
                type: fields.text({ label: 'Type' }),
                status: fields.select({ label: 'Status', options: [{ label: 'Not set', value: '' }, { label: 'Active', value: 'active' }, { label: 'Under construction', value: 'under-construction' }, { label: 'Proof of concept', value: 'proof-of-concept' }, { label: 'Completed', value: 'completed' }, { label: 'Archived', value: 'archived' }], defaultValue: '' }),
                scale: fields.text({ label: 'Scale (e.g. Approximately 700,000 records)' }),
                description: fields.text({ label: 'Description (blank line between paragraphs; first sentence is the resume line)', multiline: true }),
                facets: textList('Facets (e.g. quality dimensions)', 'Facet'),
                significance: fields.text({ label: 'Significance (optional)', multiline: true }),
                technologies: textList('Technologies', 'Technology'),
                aiUsed: fields.checkbox({ label: 'AI used' }),
                flow: fields.array(
                  fields.object({
                    label: fields.text({ label: 'Step' }),
                    type: fields.select({ label: 'Node type', options: ['SOURCE', 'PROCESS', 'DATABASE', 'API', 'MODEL', 'AGENT', 'USER', 'OUTPUT', 'MONITOR'].map((v) => ({ label: v, value: v })), defaultValue: 'PROCESS' }),
                  }),
                  { label: 'Flow (step by step)', itemLabel: (p) => `${p.fields.type.value} · ${p.fields.label.value}` },
                ),
                recognition: fields.text({ label: 'Recognition' }),
                projectSlug: fields.text({ label: 'Project slug (links to /projects/<slug>)' }),
                visibility: fields.select({ label: 'Visibility', options: [{ label: 'Public', value: 'public' }, { label: 'Private (never shown)', value: 'private' }], defaultValue: 'public' }),
              }),
              { label: 'Selected work', itemLabel: (p) => p.fields.name.value },
            ),
            confidential: fields.checkbox({ label: 'Confidential (high-level only)' }),
            visibility: fields.select({ label: 'Visibility', options: [{ label: 'Public', value: 'public' }, { label: 'Private (never shown)', value: 'private' }], defaultValue: 'public' }),
          }),
          { label: 'Roles', itemLabel: (p) => `${p.fields.role.value} · ${p.fields.company.value}` },
        ),
      },
    }),

    trainer: singleton({
      label: 'Trainer',
      path: 'content/data/trainer',
      format: json,
      schema: {
        engagements: fields.array(
          fields.object({
            slug: fields.text({ label: 'Slug' }),
            title: fields.text({ label: 'Title' }),
            role: fields.text({ label: 'Role' }),
            organization: fields.text({ label: 'Organization' }),
            partners: textList('Partners', 'Partner'),
            dateStart: fields.date({ label: 'Start date (leave empty if unknown)' }),
            dateEnd: fields.date({ label: 'End date' }),
            year: fields.integer({ label: 'Year (only when no exact date is known)' }),
            format: fields.text({ label: 'Format' }),
            audience: fields.text({ label: 'Audience', multiline: true }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            topics: textList('Topics', 'Topic'),
            evidence: textList('Evidence (asset keys or URLs of real photos / screenshots)', 'Item'),
            featured: fields.checkbox({ label: 'Featured' }),
            visibility: fields.select({ label: 'Visibility', options: [{ label: 'Public', value: 'public' }, { label: 'Private (never shown)', value: 'private' }], defaultValue: 'public' }),
          }),
          { label: 'Engagements', itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),

    life: singleton({
      label: 'Life',
      path: 'content/data/life',
      format: json,
      schema: {
        interests: fields.array(
          fields.object({
            slug: fields.text({ label: 'Slug' }),
            name: fields.text({ label: 'Name' }),
            type: fields.select({ label: 'Type', options: [{ label: 'Sport', value: 'sport' }, { label: 'Interest', value: 'interest' }], defaultValue: 'interest' }),
            body: paragraphList('Text on the Life page'),
            href: fields.text({ label: 'Links to (e.g. /running, /projects/vsb)' }),
            relatedProject: fields.text({ label: 'Related project slug' }),
            dataSource: fields.select({ label: 'Data source', options: [{ label: 'None', value: '' }, { label: 'Running pipeline (Garmin / Strava)', value: 'running' }], defaultValue: '' }),
            visibility: fields.select({ label: 'Visibility', options: [{ label: 'Public', value: 'public' }, { label: 'Private (never shown)', value: 'private' }], defaultValue: 'public' }),
          }),
          { label: 'Interests', itemLabel: (p) => p.fields.name.value },
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
              options: ['overview', 'problem', 'idea', 'rules', 'architecture', 'data', 'build', 'balance', 'interface', 'outcome', 'learned'].map((v) => ({
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
          label: 'Status (only Published is ever public)',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Building', value: 'building' },
            { label: 'Learning', value: 'learning' },
            { label: 'Notes', value: 'notes' },
          ],
          defaultValue: 'notes',
        }),
        date: fields.date({ label: 'Published date (the real one; never filled automatically)' }),
        readingMinutes: fields.integer({ label: 'Reading minutes' }),
        photo: imageSelect('Photo (list thumbnail + top of the entry)'),
        photoCaption: fields.text({ label: 'Photo caption' }),
        body: contentBlocks('Body'),
      },
    }),
  },
});
