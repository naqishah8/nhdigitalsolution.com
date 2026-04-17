'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import HeadingAnchor from '../HeadingAnchor';

export default function ServiceValue({ service }) {
  if (!service.outcomes && !service.idealFor) return null;

  return (
    <section className="value-section">
      <div className="container">
        <div className="value-grid">
          {/* LEFT: Audience image (aligned with "Who we work with") */}
          <div className="value-left">
            {service.audienceImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="audience-image"
                style={{ position: 'relative', aspectRatio: '4 / 3', width: '100%' }}
              >
                <Image
                  src={service.audienceImage}
                  alt="Our typical clients"
                  fill
                  sizes="(max-width: 900px) 100vw, 500px"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
                <div
                  className="detail-tint"
                  style={{ background: `linear-gradient(135deg, transparent 55%, ${service.color}30)` }}
                />
              </motion.div>
            )}
          </div>

          {/* RIGHT: Ideal-for + outcomes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="value-content"
          >
            {service.idealFor && (
              <div className="ideal-block">
                <HeadingAnchor as="h2" id="who-we-work-with" className="ideal-label" style={{ color: service.color }}>
                  Who we work with
                </HeadingAnchor>
                <p className="ideal-text">{service.idealFor}</p>
              </div>
            )}

            {service.outcomes && (
              <div className="outcomes-block">
                <HeadingAnchor as="h3" id="what-you-get">What you walk away with</HeadingAnchor>
                <ul className="outcomes-list">
                  {service.outcomes.map((outcome, i) => (
                    <motion.li
                      key={outcome}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      viewport={{ once: true }}
                    >
                      <span
                        className="check"
                        style={{ background: `${service.color}1f`, color: service.color }}
                      >
                        <Check size={14} />
                      </span>
                      <span>{outcome}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .value-section {
          padding: 80px 20px 80px;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .value-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 60px;
          align-items: stretch;
        }

        .value-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .audience-image {
          aspect-ratio: 4 / 3;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid var(--card-border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        }

        .detail-tint {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .value-content {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .ideal-block {
          padding-bottom: 32px;
          border-bottom: 1px solid var(--card-border);
        }

        .ideal-label {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 14px;
        }

        .ideal-text {
          font-size: 1.2rem;
          line-height: 1.55;
          color: var(--foreground);
          margin: 0;
        }

        .outcomes-block h3 {
          font-size: 1.35rem;
          color: white;
          margin: 0 0 20px;
        }

        .outcomes-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .outcomes-list li {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.5;
        }

        .check {
          flex-shrink: 0;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }

        @media (max-width: 900px) {
          .value-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .audience-image {
            aspect-ratio: 16 / 10;
            max-width: 600px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
