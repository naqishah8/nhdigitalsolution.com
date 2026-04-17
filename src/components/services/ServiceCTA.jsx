'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Clock } from 'lucide-react';
import HeadingAnchor from '../HeadingAnchor';

export default function ServiceCTA({ service }) {
  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-wrap"
        >
          <div className="accent-ring" style={{ background: `radial-gradient(circle, ${service.color}40, transparent 60%)` }} />

          <div className="cta-inner">
            <span className="mini-tag" style={{ color: service.color, background: `${service.color}18`, borderColor: `${service.color}35` }}>
              Free consultation · No commitment
            </span>
            <HeadingAnchor as="h2" id="start-your-project">
              Let's build your <span style={{ color: service.color }}>{service.title.toLowerCase()}</span> together.
            </HeadingAnchor>
            <p className="cta-lede">
              Tell us what you're trying to do. We'll review your goals, suggest the fastest path,
              and give you a no-pressure quote within 24 hours.
            </p>

            <div className="cta-actions">
              <a href="mailto:info@nhdigitalsolution.com" className="btn-primary">
                Start the conversation <ArrowRight size={18} />
              </a>
              <a href="#faq" className="btn-ghost">
                Read FAQs
              </a>
            </div>

            <div className="cta-meta">
              <div className="meta-item">
                <Mail size={16} />
                <span>info@nhdigitalsolution.com</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>Replies in under 24h</span>
              </div>
              <div className="meta-item">
                <Phone size={16} />
                <span>30-min intro call</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .cta-section {
          padding: 60px 20px 80px;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .cta-wrap {
          position: relative;
          padding: 64px 56px;
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(28, 35, 64, 0.55), rgba(21, 27, 46, 0.75));
          border: 1px solid var(--card-border);
          overflow: hidden;
        }

        .accent-ring {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(20px);
        }

        .cta-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
        }

        .mini-tag {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border: 1px solid;
          margin-bottom: 20px;
        }

        h2 {
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          color: white;
          line-height: 1.15;
          margin-bottom: 16px;
        }

        .cta-lede {
          color: var(--text-muted);
          font-size: 1.08rem;
          line-height: 1.65;
          margin-bottom: 32px;
        }

        .cta-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 32px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 11px 22px;
          border-radius: 9999px;
          font-weight: 600;
          color: var(--foreground);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .cta-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid var(--card-border);
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .cta-wrap {
            padding: 44px 28px;
          }
          .cta-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-primary, .btn-ghost {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
