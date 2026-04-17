'use client';
// Internal-SEO cross-linking: shows 3 related services at the bottom of
// every service page. Each card is a real <Link> with anchor text that uses
// the target service's title, which is strong on-page signal for query
// association and adds crawl depth between sibling routes.

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { servicesList } from '@/data/services';
import HeadingAnchor from '../HeadingAnchor';

// Hand-picked adjacency so the cross-links make thematic sense instead of
// being random: design pairs with web, SEO with SMM, apps with web, etc.
const RELATED = {
  'web-development': ['graphic-design', 'seo-optimization', 'app-development'],
  'graphic-design': ['web-development', 'social-media-marketing', 'seo-optimization'],
  'seo-optimization': ['social-media-marketing', 'web-development', 'graphic-design'],
  'social-media-marketing': ['seo-optimization', 'graphic-design', 'web-development'],
  'app-development': ['web-development', 'graphic-design', 'seo-optimization'],
  'logistics': ['app-development', 'web-development', 'seo-optimization'],
};

export default function RelatedServices({ service }) {
  const pickedSlugs = RELATED[service.slug] || [];
  const related = pickedSlugs
    .map((slug) => servicesList.find((s) => s.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="related-section" aria-labelledby="related-services">
      <div className="container">
        <div className="related-header">
          <span className="badge">Keep exploring</span>
          <HeadingAnchor as="h2" id="related-services">
            Other ways we can help
          </HeadingAnchor>
          <p>
            Most projects touch more than one of these. See how {service.title.toLowerCase()} connects to the rest of what we do.
          </p>
        </div>

        <div className="related-grid">
          {related.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/services/${r.slug}`}
                className="related-card"
                style={{ '--accent': r.color }}
              >
                <div className="card-icon" style={{ background: `${r.color}18`, color: r.color }}>
                  <r.icon size={22} />
                </div>
                <div className="card-body">
                  <span className="card-tag" style={{ color: r.color }}>
                    {r.title}
                  </span>
                  <h3>{r.tagline}</h3>
                  <p>{r.description}</p>
                </div>
                <span className="card-cta">
                  Explore {r.title} <ArrowUpRight size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .related-section {
          padding: 60px 20px 40px;
          background: var(--background);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .related-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .related-header p {
          color: var(--text-muted);
          max-width: 640px;
          margin: 10px auto 0;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .related-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 28px;
          border-radius: 22px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
          height: 100%;
        }

        .related-card:hover {
          transform: translateY(-4px);
          border-color: color-mix(in srgb, var(--accent) 45%, transparent);
          background: var(--card-bg-hover);
        }

        .card-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .card-tag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .card-body h3 {
          color: white;
          font-size: 1.18rem;
          line-height: 1.3;
          margin: 0;
        }

        .card-body p {
          color: var(--text-muted);
          font-size: 0.92rem;
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-cta {
          color: var(--accent);
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: auto;
        }
      `}</style>
    </section>
  );
}
