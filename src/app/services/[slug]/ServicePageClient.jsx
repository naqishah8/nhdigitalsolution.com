'use client';
import { services } from '@/data/services';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceValue from '@/components/services/ServiceValue';
import ServiceFeatures from '@/components/services/ServiceFeatures';
import ServiceProcess from '@/components/services/ServiceProcess';
import ServiceFAQ from '@/components/services/ServiceFAQ';
import ServiceCTA from '@/components/services/ServiceCTA';
import RelatedServices from '@/components/services/RelatedServices';
import Footer from '@/components/Footer';

export default function ServicePageClient({ slug }) {
  const service = services[slug];

  if (!service) return null;

  return (
    <>
      <ServiceHero service={service} />
      <ServiceValue service={service} />
      <ServiceFeatures service={service} />
      <ServiceProcess service={service} />
      <ServiceFAQ service={service} />
      <ServiceCTA service={service} />
      <RelatedServices service={service} />
      <Footer />
    </>
  );
}
