import { services, serviceSlugs } from '@/data/services';
import { COMPANY } from '@/data/company';
import ServicePageClient from './ServicePageClient';

export async function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    return { title: 'Service Not Found' };
  }

  const title = `${service.title}: ${service.tagline}`;
  const canonical = `/services/${service.slug}`;
  const ogImage = service.heroImage || COMPANY.ogImage;

  return {
    title,
    description: service.description,
    alternates: { canonical },
    keywords: [
      service.title,
      service.tagline,
      ...(service.features || []).map((f) => f.title),
      COMPANY.brand,
    ],
    openGraph: {
      type: 'website',
      url: `${COMPANY.url}${canonical}`,
      title: `${title} | ${COMPANY.brand}`,
      description: service.description,
      siteName: COMPANY.brand,
      images: [{ url: ogImage, alt: service.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${COMPANY.brand}`,
      description: service.description,
      images: [ogImage],
    },
  };
}

function buildServiceSchema(service) {
  const canonical = `${COMPANY.url}/services/${service.slug}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: service.title,
    alternateName: service.tagline,
    description: service.description,
    serviceType: service.title,
    url: canonical,
    provider: { '@id': `${COMPANY.url}#organization` },
    areaServed: { '@type': 'Country', name: 'United States' },
    audience: service.idealFor
      ? { '@type': 'BusinessAudience', audienceType: service.idealFor }
      : undefined,
    hasOfferCatalog: service.features?.length
      ? {
          '@type': 'OfferCatalog',
          name: `${service.title} capabilities`,
          itemListElement: service.features.map((f) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: f.title,
              description: f.desc,
            },
          })),
        }
      : undefined,
  };

  const faqSchema = service.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: service.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: COMPANY.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${COMPANY.url}/#services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: canonical,
      },
    ],
  };

  return [serviceSchema, faqSchema, breadcrumbSchema].filter(Boolean);
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center' }}>
        <h1>Service Not Found</h1>
        <p>The service you're looking for doesn't exist.</p>
      </div>
    );
  }

  const schemas = buildServiceSchema(service);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ServicePageClient slug={slug} />
    </>
  );
}
