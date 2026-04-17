'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import ServiceBackground from './ServiceBackground';

export default function ServiceHero({ service }) {
  return (
    <section className="service-hero">
      <ServiceBackground slug={service.slug} />
      <div className="container">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-content"
          >
            <Link href="/#services" className="back-link">
              <span>&larr;</span> All Services
            </Link>

            <span className="service-eyebrow" style={{ color: service.color }}>
              <service.icon size={16} />
              <span>{service.title}</span>
            </span>

            <h1>{service.tagline}</h1>
            <p className="description">{service.description}</p>

            {service.outcomes && (
              <ul className="quick-wins">
                {service.outcomes.slice(0, 3).map((outcome) => (
                  <li key={outcome}>
                    <Check size={18} style={{ color: service.color }} />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="hero-actions">
              <a href="#contact" className="btn-primary">Get a Free Consultation</a>
              <a href="#faq" className="btn-outline" style={{ borderColor: `${service.color}40`, color: service.color }}>
                View FAQs
              </a>
            </div>

            <div className="hero-stats">
              {service.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="stat"
                >
                  <span className="stat-value" style={{ color: service.color }}>{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {service.heroImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-image-wrap"
            >
              <div
                className="hero-image"
                style={{ position: 'relative', aspectRatio: '4 / 5', width: '100%' }}
              >
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="image-glow" style={{ background: `radial-gradient(circle at 30% 20%, ${service.color}33, transparent 60%)` }} />
              </div>
              <div className="image-border" style={{ borderColor: `${service.color}40` }} />
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        .service-hero {
          position: relative;
          padding: 130px 20px 70px;
          overflow: hidden;
          isolation: isolate;
        }

        .service-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(21, 27, 46, 0.85) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 3;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 28px;
        }

        .back-link:hover {
          color: white;
        }

        .service-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        h1 {
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          color: white;
        }

        .description {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 28px;
        }

        .quick-wins {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
          padding: 0;
        }

        .quick-wins li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--foreground);
          font-size: 0.98rem;
          line-height: 1.5;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .btn-outline {
          padding: 0.8rem 1.5rem;
          border-radius: 9999px;
          border: 1px solid;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--card-border);
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .hero-image-wrap {
          position: relative;
        }

        .hero-image {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
        }

        .image-glow {
          position: absolute;
          inset: 0;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .image-border {
          position: absolute;
          inset: -2px;
          border: 1px solid;
          border-radius: 30px;
          pointer-events: none;
          opacity: 0.5;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 50px;
          }
          .hero-image {
            aspect-ratio: 16 / 10;
            max-width: 600px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .service-hero {
            padding: 120px 20px 60px;
          }
          .hero-stats {
            gap: 24px;
            flex-wrap: wrap;
          }
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-outline {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
