'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Link2 } from 'lucide-react';
import HeadingAnchor from '../HeadingAnchor';

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70);
}

function FAQItem({ question, answer, isOpen, onToggle, color, anchorId }) {
  return (
    <div className="faq-item" id={anchorId}>
      <button className="faq-trigger" onClick={onToggle} aria-expanded={isOpen} aria-controls={`${anchorId}-panel`}>
        <span className="faq-question">{question}</span>
        <a
          href={`#${anchorId}`}
          className="faq-link"
          aria-label="Direct link to this question"
          onClick={(e) => e.stopPropagation()}
        >
          <Link2 size={14} aria-hidden="true" />
        </a>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="faq-chevron"
          style={{ color: isOpen ? color : undefined }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${anchorId}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="faq-answer-wrapper"
          >
            <p className="faq-answer">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .faq-item {
          border-bottom: 1px solid var(--card-border);
          scroll-margin-top: 110px;
        }

        .faq-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 24px 0;
          background: none;
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
        }

        .faq-question {
          flex: 1;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .faq-link {
          opacity: 0;
          color: var(--text-dim);
          display: inline-flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: opacity 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
        }

        .faq-item:hover .faq-link,
        .faq-item:focus-within .faq-link,
        .faq-link:focus-visible {
          opacity: 0.7;
        }

        .faq-link:hover,
        .faq-link:focus-visible {
          opacity: 1 !important;
          color: var(--primary);
        }

        .faq-chevron {
          flex-shrink: 0;
          color: var(--text-dim);
        }

        .faq-answer-wrapper {
          overflow: hidden;
        }

        .faq-answer {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          padding-bottom: 24px;
        }
      `}</style>
    </div>
  );
}

export default function ServiceFAQ({ service }) {
  const [openIndex, setOpenIndex] = useState(0);

  // Per-service anchor ids — prefixed so identical questions across services
  // still get unique anchors. Stable for SEO + deep-linking.
  const anchorIds = service.faqs.map(
    (f, i) => `faq-${service.slug}-${slugify(f.q) || i + 1}`
  );

  // If someone arrives at #faq-xyz, open that question automatically.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const idx = anchorIds.indexOf(hash);
    if (idx >= 0) setOpenIndex(idx);
  }, [anchorIds]);

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-layout">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="faq-header"
          >
            <span className="badge">FAQ</span>
            <HeadingAnchor as="h2" id="common-questions">Common Questions</HeadingAnchor>
            <p>Everything you need to know about our {service.title.toLowerCase()} service. Can't find your answer? Reach out to us.</p>
            <a href="#contact" className="btn-primary" style={{ marginTop: '24px' }}>Ask Us Anything</a>
          </motion.div>

          <div className="faq-list">
            {service.faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <FAQItem
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                  color={service.color}
                  anchorId={anchorIds[i]}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 80px 20px;
          background: var(--background);
        }

        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 80px;
          align-items: start;
        }

        .faq-header h2 {
          font-size: clamp(2rem, 4vw, 2.8rem);
          margin: 15px 0 20px;
        }

        .faq-header p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .faq-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  );
}
