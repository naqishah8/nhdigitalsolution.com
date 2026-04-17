import { COMPANY } from '@/data/company';
import { serviceSlugs } from '@/data/services';

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
  ];

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    priority: 0.85,
    changeFrequency: 'monthly',
  }));

  return [...staticRoutes, ...serviceRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}
