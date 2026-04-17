'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Monitor, Camera, Search, Share2, Smartphone, Truck, ArrowRight, Sparkles } from 'lucide-react';

const options = [
  { id: 'web', icon: <Monitor />, label: 'Standard Website', desc: 'Need a fast, high-converting site.', recommendation: 'Web Development', slug: 'web-development' },
  { id: 'design', icon: <Camera />, label: 'New Brand Identity', desc: 'Lacking a unique logo or design.', recommendation: 'Graphic Design', slug: 'graphic-design' },
  { id: 'seo', icon: <Search />, label: 'More Leads', desc: "People can't find me on Google.", recommendation: 'SEO Optimization', slug: 'seo-optimization' },
  { id: 'social', icon: <Share2 />, label: 'Social Presence', desc: 'Need to grow on Instagram/TikTok.', recommendation: 'Social Media Marketing', slug: 'social-media-marketing' },
  { id: 'app', icon: <Smartphone />, label: 'Mobile App', desc: 'Ready for the App Store.', recommendation: 'App Development', slug: 'app-development' },
  { id: 'logistics', icon: <Truck />, label: 'Supply Chain', desc: 'Need logistics optimization.', recommendation: 'Logistics Solutions', slug: 'logistics' },
];

export default function ServiceSelector() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="service-selector" id="quiz">
      <div className="container">
        <div className="text-center">
          <span className="badge">Project Finder</span>
          <h2>Not sure what you need?</h2>
          <p>Tell us your goal and we'll point you to the right solution.</p>
        </div>

        <div className="selector-grid">
          {options.map((opt) => (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setSelected(opt)}
              className={`selector-card ${selected?.id === opt.id ? 'active' : ''}`}
            >
              <Link href={`/services/${opt.slug}`} className="selector-link">
                <div className="icon-wrapper">{opt.icon}</div>
                <h3>{opt.label}</h3>
                <p>{opt.desc}</p>
                <span className="go-arrow"><ArrowRight size={16} /></span>
              </Link>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="recommendation"
            >
              <div className="rec-tag">
                <Sparkles size={14} />
                <span>Perfect match</span>
              </div>
              <h4>{selected.recommendation}</h4>
              <p>Great pick. We'll turn your {selected.label.toLowerCase()} goals into reality — starting with a free 30-minute consultation.</p>
              <div className="rec-actions">
                <Link href={`/services/${selected.slug}`} className="btn-primary">
                  Explore {selected.recommendation} <ArrowRight size={16} />
                </Link>
                <a href="#contact" className="btn-ghost">
                  Book a Call
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .service-selector {
          padding: 100px 20px;
          background: rgba(168, 85, 247, 0.02);
        }

        .service-selector .container {
          max-width: 1000px;
        }

        .text-center {
          text-align: center;
          margin-bottom: 50px;
        }

        h2 {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          margin-bottom: 15px;
        }
        
        .selector-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .selector-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .selector-card.active {
          background: rgba(184, 121, 251, 0.1);
          border-color: var(--primary);
          box-shadow: 0 14px 30px rgba(184, 121, 251, 0.2);
        }

        .selector-link {
          position: relative;
          display: block;
          padding: 28px 22px 26px;
          text-align: center;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .icon-wrapper {
          width: 52px;
          height: 52px;
          background: var(--primary-subtle);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--primary);
          transition: transform 0.3s ease;
        }

        .selector-card:hover .icon-wrapper {
          transform: scale(1.1);
        }

        .go-arrow {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary-subtle);
          color: var(--primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.25s ease;
        }

        .selector-card:hover .go-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        
        h3 {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        
        .selector-card p {
          font-size: 0.85rem;
          color: #94a3b8;
        }
        
        .recommendation {
          position: relative;
          padding: 36px 40px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(184, 121, 251, 0.12), rgba(96, 165, 250, 0.08));
          border: 1px solid rgba(184, 121, 251, 0.35);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .recommendation::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(184, 121, 251, 0.25), transparent 70%);
          pointer-events: none;
        }

        .rec-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(184, 121, 251, 0.2);
          color: var(--primary);
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        }

        h4 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: white;
          margin: 0 0 10px;
          line-height: 1.2;
        }

        .recommendation p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 600px;
        }

        .rec-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          border-radius: 9999px;
          font-weight: 600;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.2s ease;
        }

        .btn-ghost:hover {
          border-color: white;
          background: rgba(255, 255, 255, 0.08);
        }
        
        @media (max-width: 900px) {
          .selector-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 600px) {
          .selector-grid {
            grid-template-columns: 1fr;
          }
          .recommendation {
            padding: 28px 22px;
          }
          .rec-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-ghost {
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
