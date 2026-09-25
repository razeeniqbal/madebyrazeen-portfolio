/**
 * Lab: experiments, prototypes and unfinished ideas (PRD §31). Every entry states its status (PRD §56).
 * Edit: admin → Lab, or content/data/lab.json.
 */
import data from './data/lab.json';

export interface Experiment {
  slug: string;
  title: string;
  summary: string;
  status: 'live' | 'prototype' | 'planned';
  href?: string;
  external?: boolean;
}

export const experiments: Experiment[] = data.experiments.map((e) => ({
  ...e,
  status: e.status as Experiment['status'],
  href: e.href || undefined,
}));

/** "Currently exploring" on the homepage. */
export const exploring = data.exploring;
