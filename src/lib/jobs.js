import fs from 'node:fs';
import path from 'node:path';

// Persist jobs to a JSON file OUTSIDE the deployed code directory so
// git-pull deploys (reset --hard) don't wipe it. Default path is in the
// repo for local dev; override with JOBS_FILE on the VPS.
const JOBS_FILE =
  process.env.JOBS_FILE || path.join(process.cwd(), 'data', 'jobs.json');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function loadJobs() {
  try {
    const raw = fs.readFileSync(JOBS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveJobs(jobs) {
  fs.mkdirSync(path.dirname(JOBS_FILE), { recursive: true });
  const tmp = JOBS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(jobs, null, 2));
  fs.renameSync(tmp, JOBS_FILE);
}

export function getPublishedJobs() {
  return loadJobs().filter((j) => j.published !== false);
}

export function getJobBySlug(slug) {
  return loadJobs().find((j) => j.slug === slug) || null;
}

function normalize(job) {
  const title = String(job.title || '').trim();
  const base = {
    slug: job.slug ? slugify(job.slug) : slugify(title),
    title,
    description: String(job.description || '').trim(),
    location: String(job.location || 'Remote').trim(),
    employmentType: String(job.employmentType || 'FULL_TIME'),
    remote: !!job.remote,
    salaryMin: job.salaryMin === '' || job.salaryMin == null ? null : Number(job.salaryMin),
    salaryMax: job.salaryMax === '' || job.salaryMax == null ? null : Number(job.salaryMax),
    salaryCurrency: String(job.salaryCurrency || 'USD'),
    salaryUnit: String(job.salaryUnit || 'YEAR'),
    applyUrl: String(job.applyUrl || '').trim(),
    datePosted: String(job.datePosted || new Date().toISOString().slice(0, 10)),
    validThrough: job.validThrough ? String(job.validThrough) : '',
    published: job.published !== false,
  };
  return base;
}

export function upsertJob(input) {
  const job = normalize(input);
  if (!job.title) throw new Error('Title is required');
  if (!job.description) throw new Error('Description is required');
  if (!job.slug) throw new Error('Slug could not be generated');

  const jobs = loadJobs();
  const idx = jobs.findIndex((j) => j.slug === job.slug);
  if (idx >= 0) {
    jobs[idx] = { ...jobs[idx], ...job };
  } else {
    jobs.push(job);
  }
  saveJobs(jobs);
  return job;
}

export function deleteJob(slug) {
  const jobs = loadJobs();
  const next = jobs.filter((j) => j.slug !== slug);
  saveJobs(next);
  return next.length !== jobs.length;
}
