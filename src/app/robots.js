import { COMPANY } from '@/data/company';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${COMPANY.url}/sitemap.xml`,
    host: COMPANY.url,
  };
}
