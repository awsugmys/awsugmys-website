// Content collections. Editing guides for each live in README.md.
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, 'Use 24-hour HH:MM (IST)');

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    featuredpost: z.boolean().default(false),
    // Filename in src/assets/blog/ (a legacy "/img/" prefix is ignored).
    featuredimage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Gatsby-era field, kept so old posts validate unchanged.
    templateKey: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: isoDate,
    endDate: isoDate.optional(),
    startTime: hhmm.optional(),
    endTime: hhmm.optional(),
    format: z.enum(['in-person', 'online', 'hybrid']).default('in-person'),
    venue: z
      .object({ name: z.string(), city: z.string(), address: z.string().optional() })
      .optional(),
    speakers: z
      .array(z.object({ name: z.string(), title: z.string().optional(), url: z.url().optional() }))
      .default([]),
    description: z.string(),
    note: z.string().optional(),
    registrationUrl: z.url().optional(),
    // a second listing of the same event (e.g. on another platform)
    alternateUrl: z.url().optional(),
    slidesUrl: z.url().optional(),
    // workshop code, labs or instructions (e.g. a GitHub repository)
    materialsUrl: z.url().optional(),
    recordingUrl: z.url().optional(),
    // id of a related post in src/content/blog
    blogPost: z.string().optional(),
    // Marks illustrative entries so they are clearly labelled on the site.
    placeholder: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      linkedin: z.url().optional(),
      order: z.number().default(99),
      photo: image().optional(),
      bio: z.string().optional(),
    }),
});

const links = defineCollection({
  loader: file('src/content/links/links.json'),
  schema: z.object({
    label: z.string(),
    url: z.url(),
    icon: z.enum(['meetup', 'luma', 'linkedin', 'x', 'facebook', 'github', 'youtube']),
    blurb: z.string().optional(),
    order: z.number().default(99),
  }),
});

// AWS Student Builder Groups in the region (each links to its Meetup group).
const studentGroups = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/student-groups' }),
  schema: z.object({
    name: z.string(),
    institution: z.string(),
    shortName: z.string(),
    area: z.enum(['Mysuru', 'Mandya']),
    location: z.string(),
    leader: z.string().optional(),
    meetupUrl: z.url(),
    order: z.number().default(99),
  }),
});

// Organisations and events we have partnered or collaborated with.
const collaborations = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/collaborations' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      // event = a dated event we co-hosted or took part in; organization = an
      // institution or company; community = a peer user group or community.
      type: z.enum(['event', 'organization', 'community']).default('event'),
      // Full date (YYYY-MM-DD) for events; falls back to `year` when absent.
      date: isoDate.optional(),
      year: z.number().int().optional(),
      location: z.string().optional(),
      url: z.url().optional(),
      // Logo in src/assets/collaborations/ (processed at build time).
      logo: image().optional(),
      // One line on what we did together.
      blurb: z.string().optional(),
      order: z.number().default(99),
    }),
});

export const collections = { blog, events, team, links, studentGroups, collaborations };
