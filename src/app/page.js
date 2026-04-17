'use client';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import HomeFAQ from '@/components/HomeFAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ServiceSelector from '@/components/ServiceSelector';

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceSelector />
      <Services />
      <Portfolio />
      <About />
      <Testimonials />
      <HomeFAQ />
      <Contact />
      <Footer />
    </>
  );
}
