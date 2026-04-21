import { COMPANY } from '@/data/company';
import { serviceSlugs } from '@/data/services';
import { getPublishedJobs } from '@/lib/jobs';

// Regenerate on each request so freshly-posted jobs appear in the sitemap
// immediately without waiting for the next deploy.
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function sitemap() {
  const base = COMPANY.url;
  const now = new Date();

  const staticRoutes = [
    { url: `${base}/`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/#services`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/#portfolio`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/#about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/#testimonials`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${base}/#faq`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${base}/#contact`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/careers`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
  ];

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    priority: 0.85,
    changeFrequency: 'monthly',
  }));

  const jobRoutes = getPublishedJobs().map((job) => ({
    url: `${base}/careers/${job.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  return [...staticRoutes, ...serviceRoutes, ...jobRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
