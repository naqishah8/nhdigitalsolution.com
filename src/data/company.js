// Single source of truth for business NAP + brand — used by metadata,
// JSON-LD schemas, sitemap, footer, and the AI chat prompt.
//
// TODO: replace address/geo/phone/hours with the real values before launch.
// Leave any field empty string if unknown — schemas skip empty fields.

export const COMPANY = {
  legalName: 'NH International LLC',
  brand: 'NH Digital Solution',
  shortName: 'NH International',
  tagline: 'Premium Web, Design, SEO & App Development',
  description:
    'NH Digital Solution (NH International LLC) is a senior studio building fast, high-converting websites, brand systems, mobile apps, SEO, social media, and logistics platforms.',
  url: 'https://nhdigitalsolution.com',
  email: 'info@nhdigitalsolution.com',
  phone: '+1-201-534-1505',
  foundingDate: '2022',

  address: {
    streetAddress: '', // add the exact street address when ready
    addressLocality: 'Austin',
    addressRegion: 'TX',
    postalCode: '78701',
    addressCountry: 'US',
  },
  geo: {
    latitude: '',   // optional — fill in exact lat/long once street address is known
    longitude: '',
  },
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  serviceArea: {
    type: 'Country',
    name: 'United States',
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/nh-international-llc',
    instagram: 'https://www.instagram.com/nhinternational.llc/',
    facebook: 'https://www.facebook.com/share/1JEjG8Ja6B/',
  },

  // Primary brand + OG assets
  logo: '/logo/full-logo.png',
  icon: '/logo/icon.png',
  ogImage: '/logo/full-logo.png',
};

export const SAME_AS = Object.values(COMPANY.social).filter(Boolean);

// Build the JSON-LD graph that goes in the root layout. Google treats this
// graph as the canonical "who is this site" signal, including sameAs links
// which associate the domain with the three social profiles for off-page SEO.
export function buildOrganizationSchema() {
  const hasAddress =
    COMPANY.address.streetAddress ||
    COMPANY.address.addressLocality ||
    COMPANY.address.postalCode;

  const hasGeo = COMPANY.geo.latitude && COMPANY.geo.longitude;

  const org = {
    '@type': 'Organization',
    '@id': `${COMPANY.url}#organization`,
    name: COMPANY.legalName,
    alternateName: [COMPANY.brand, COMPANY.shortName],
    url: COMPANY.url,
    logo: {
      '@type': 'ImageObject',
      url: `${COMPANY.url}${COMPANY.logo}`,
    },
    email: COMPANY.email,
    foundingDate: COMPANY.foundingDate,
    sameAs: SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      email: COMPANY.email,
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
  };

  if (COMPANY.phone) org.telephone = COMPANY.phone;

  if (hasAddress) {
    org.address = {
      '@type': 'PostalAddress',
      ...(COMPANY.address.streetAddress && { streetAddress: COMPANY.address.streetAddress }),
      ...(COMPANY.address.addressLocality && { addressLocality: COMPANY.address.addressLocality }),
      ...(COMPANY.address.addressRegion && { addressRegion: COMPANY.address.addressRegion }),
      ...(COMPANY.address.postalCode && { postalCode: COMPANY.address.postalCode }),
      addressCountry: COMPANY.address.addressCountry,
    };
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${COMPANY.url}#website`,
    url: COMPANY.url,
    name: COMPANY.brand,
    description: COMPANY.description,
    publisher: { '@id': `${COMPANY.url}#organization` },
    inLanguage: 'en-US',
  };

  // LocalBusiness variant — upgraded version of Organization that Google
  // uses to power local pack / map results once address/geo are filled in.
  const localBusiness = hasAddress
    ? {
        '@type': 'ProfessionalService',
        '@id': `${COMPANY.url}#localbusiness`,
        name: COMPANY.legalName,
        url: COMPANY.url,
        image: `${COMPANY.url}${COMPANY.logo}`,
        email: COMPANY.email,
        ...(COMPANY.phone && { telephone: COMPANY.phone }),
        priceRange: '$$',
        sameAs: SAME_AS,
        address: org.address,
        ...(hasGeo && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: COMPANY.geo.latitude,
            longitude: COMPANY.geo.longitude,
          },
        }),
        ...(COMPANY.openingHours.length && {
          openingHoursSpecification: COMPANY.openingHours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }),
        areaServed: {
          '@type': COMPANY.serviceArea.type,
          name: COMPANY.serviceArea.name,
        },
      }
    : null;

  return {
    '@context': 'https://schema.org',
    '@graph': [org, website, ...(localBusiness ? [localBusiness] : [])],
  };
}
