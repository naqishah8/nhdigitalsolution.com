'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Camera, Search, Share2, Smartphone, Truck, ArrowRight, Calendar } from 'lucide-react';
import HeadingAnchor from './HeadingAnchor';

const services = [
  { icon: <Monitor />, title: 'Web Development', slug: 'web-development', desc: 'Custom, high-performance Next.js websites built for speed and SEO. Premium UI/UX that converts.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=70' },
  { icon: <Camera />, title: 'Graphic Design', slug: 'graphic-design', desc: 'Stunning logos, branding, and creative visuals that make your business stand out from the crowd.', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=70' },
  { icon: <Search />, title: 'SEO Optimization', slug: 'seo-optimization', desc: 'Dominating search results. We help you get found by the right people at the right time.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=70' },
  { icon: <Share2 />, title: 'SMM', slug: 'social-media-marketing', desc: 'Social Media Management that engages your audience and builds a loyal community.', image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=70' },
  { icon: <Smartphone />, title: 'App Development', slug: 'app-development', desc: 'Crafting powerful mobile experiences for iOS and Android that users love.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=70' },
  { icon: <Truck />, title: 'Logistics', slug: 'logistics', desc: 'Optimized supply chain and logistics solutions to streamline your business operations.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=70' },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <span className="badge">Our Expertise</span>
          <HeadingAnchor as="h2" id="our-services">Premium Solutions for <br /> Modern Businesses</HeadingAnchor>
          <p>We combine creativity with technical excellence to deliver results that matter.</p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="service-card"
            >
              <Link
                href={`/services/${service.slug}`}
                className="card-image"
                aria-label={`View ${service.title}`}
                style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
                <div className="image-overlay" />
                <div className="icon-container">{service.icon}</div>
              </Link>
              <div className="card-body">
                <Link href={`/services/${service.slug}`} className="title-link">
                  <h3>{service.title}</h3>
                </Link>
                <p>{service.desc}</p>
                <div className="card-actions">
                  <Link href={`/services/${service.slug}`} className="learn-more">
                    Learn More <ArrowRight size={15} />
                  </Link>
                  <a href="#contact" className="book-call">
                    <Calendar size={14} /> Book a Call
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .services {
          padding: 100px 20px;
          background: var(--background-translucent);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .service-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .service-card:hover {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          transform: translateY(-10px);
        }

        .card-image {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          display: block;
        }

        .card-image :global(img) {
          transition: transform 0.5s ease;
        }

        .service-card:hover .card-image :global(img) {
          transform: scale(1.06);
        }

        .title-link {
          display: inline-block;
          color: inherit;
        }

        .title-link:hover h3 {
          color: var(--primary);
        }

        h3 {
          transition: color 0.2s ease;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(21, 27, 46, 0.1) 0%, rgba(21, 27, 46, 0.85) 100%);
        }

        .card-body {
          padding: 30px 32px 36px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .icon-container {
          position: absolute;
          bottom: 16px;
          left: 24px;
          width: 48px;
          height: 48px;
          color: white;
          background: var(--primary);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px var(--primary-glow);
          z-index: 2;
        }

        h3 {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: white;
        }

        p {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 25px;
          flex-grow: 1;
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: auto;
        }

        .learn-more {
          font-weight: 700;
          color: white;
          font-size: 0.9rem;
          padding: 10px 18px;
          border-radius: 9999px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 18px var(--primary-glow);
          transition: transform 0.2s ease;
        }

        .learn-more:hover {
          transform: translateY(-2px);
        }

        .book-call {
          font-weight: 600;
          color: var(--foreground);
          font-size: 0.85rem;
          padding: 9px 14px;
          border-radius: 9999px;
          border: 1px solid var(--card-border);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .book-call:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-subtle);
        }
      `}</style>
    </section>
  );
}
