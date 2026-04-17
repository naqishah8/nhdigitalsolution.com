'use client';
import { motion } from 'framer-motion';
import HeadingAnchor from '../HeadingAnchor';

export default function ServiceFeatures({ service }) {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="badge">What's included</span>
          <HeadingAnchor as="h2" id="what-is-included">Everything you need, in one package</HeadingAnchor>
          <p>Each engagement covers these essentials so nothing gets missed.</p>
        </div>

        <div className="features-grid">
          {service.features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="feature-card"
            >
              <div className="feature-icon" style={{ background: `${service.color}12`, color: service.color }}>
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features-section {
          padding: 80px 20px;
          background: var(--background);
          position: relative;
        }

        .features-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 800px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-border), transparent);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 36px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          border-color: ${service.color}40;
          background: var(--card-bg-hover);
        }

        .feature-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 1.15rem;
          color: white;
          margin-bottom: 10px;
        }

        p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
