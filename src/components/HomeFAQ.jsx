'use client';
// Homepage FAQ — common pre-contact questions. Two wins:
//  1. Reduces friction: answers pricing/timeline/scope concerns before the
//     user has to fill the Contact form.
//  2. SEO: emits FAQPage JSON-LD so Google can surface these as rich
//     results, and the answers use service keywords naturally.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import HeadingAnchor from './HeadingAnchor';

const FAQS = [
  {
    q: 'How much does a project typically cost?',
    a: 'It depends on scope. Most websites run between $3K–$15K, brand identities $1.5K–$6K, and apps $12K–$40K+. Every project gets a fixed quote after the free 30-minute call — no hidden extras.',
  },
  {
    q: 'How long until my project goes live?',
    a: 'A simple landing site ships in 2–3 weeks. A full website or rebrand is 5–8 weeks. Apps take 8–16 weeks. We share weekly demos the whole way so you see progress, not status emails.',
  },
  {
    q: 'Do you work with small businesses and startups?',
    a: 'Yes. A lot of our work is with bootstrapped founders and small teams. We scope projects to your budget and prioritize what moves the needle first.',
  },
  {
    q: 'What happens after launch?',
    a: 'You own everything — code, design files, domain, analytics. We offer optional monthly care plans (updates, monitoring, content changes, small improvements) but you\'re never locked in.',
  },
  {
    q: 'Can you handle design and development together?',
    a: 'Yes — that\'s our default. The designer and engineer on your project sit together and ship weekly. No agency-style handoffs, no translation loss, no waiting on another vendor.',
  },
  {
    q: 'How do I get started?',
    a: 'Book the free 30-minute intro call from the contact section below (or email info@nhdigitalsolution.com). We\'ll review your goals, point out quick wins, and send a proposal within 24 hours.',
  },
];

function FAQItem({ q, a, isOpen, onToggle, index }) {
  const anchorId = `home-faq-${index}`;
  return (
    <div className="home-faq-item" id={anchorId}>
      <button
        className="home-faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${anchorId}-panel`}
      >
        <span className="home-faq-q">{q}</span>
        <span className="home-faq-chev" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          <ChevronDown size={18} />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${anchorId}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="home-faq-panel"
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .home-faq-item {
          border: 1px solid var(--card-border);
          border-radius: 18px;
          background: var(--card-bg);
          overflow: hidden;
          transition: border-color 0.2s ease, background 0.2s ease;
          scroll-margin-top: 110px;
        }
        .home-faq-item:hover {
          border-color: color-mix(in srgb, var(--primary) 35%, var(--card-border));
        }
        .home-faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 20px 22px;
          background: transparent;
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }
        .home-faq-q {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.45;
        }
        .home-faq-chev {
          color: var(--text-dim);
          flex-shrink: 0;
          transition: transform 0.2s ease;
          display: inline-flex;
        }
        .home-faq-panel {
          overflow: hidden;
        }
        .home-faq-panel p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.65;
          margin: 0;
          padding: 0 22px 22px;
        }
      `}</style>
    </div>
  );
}

function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HomeFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="home-faq" id="faq">
      <FAQSchema />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="home-faq-header"
        >
          <span className="badge">
            <MessageCircleQuestion size={14} /> Questions we hear a lot
          </span>
          <HeadingAnchor as="h2" id="faq">
            Still deciding? Start here.
          </HeadingAnchor>
          <p>
            The answers below cover what most founders ask us first. Anything else,
            ping <a href="#contact">the contact form</a> — we reply within 24 hours.
          </p>
        </motion.div>

        <div className="home-faq-grid">
          {FAQS.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <FAQItem
                index={i}
                q={item.q}
                a={item.a}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            </motion.div>
          ))}
        </div>

        <div className="home-faq-footer">
          <p>Can't find your answer?</p>
          <Link href="#contact" className="btn-primary">Ask us directly</Link>
        </div>
      </div>

      <style jsx>{`
        .home-faq {
          padding: 90px 20px 70px;
          position: relative;
        }

        .container {
          max-width: 860px;
          margin: 0 auto;
        }

        .home-faq-header {
          text-align: center;
          margin-bottom: 42px;
        }

        .home-faq-header .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .home-faq-header p {
          color: var(--text-muted);
          margin-top: 10px;
          font-size: 1rem;
          line-height: 1.6;
        }

        .home-faq-header p :global(a) {
          color: var(--primary);
          font-weight: 600;
        }

        .home-faq-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .home-faq-footer {
          margin-top: 36px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .home-faq-footer p {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.95rem;
        }
      `}</style>
    </section>
  );
}
