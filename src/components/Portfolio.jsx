'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HeadingAnchor from './HeadingAnchor';
const projects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    desc: 'A high-performance online store built with Next.js, featuring real-time inventory and seamless checkout.',
    color: '#a855f7',
    tags: ['Next.js', 'Stripe', 'SEO'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=70',
  },
  {
    title: 'Restaurant Brand Identity',
    category: 'Graphic Design',
    desc: 'Complete rebrand for a fine dining chain — logo, menu design, signage, and social media kit.',
    color: '#3b82f6',
    tags: ['Logo', 'Branding', 'Print'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=70',
  },
  {
    title: 'SaaS Dashboard',
    category: 'Web Development',
    desc: 'Analytics dashboard for a B2B SaaS product with real-time data visualization and role-based access.',
    color: '#10b981',
    tags: ['React', 'Charts', 'Auth'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=70',
  },
  {
    title: 'Local SEO Campaign',
    category: 'SEO Optimization',
    desc: 'Took a local business from page 5 to the top 3 results in 4 months with technical SEO and content strategy.',
    color: '#f59e0b',
    tags: ['Technical SEO', 'Content', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=700&q=70',
  },
  {
    title: 'Fitness App',
    category: 'App Development',
    desc: 'Cross-platform mobile app with workout tracking, social features, and integration with wearable devices.',
    color: '#ef4444',
    tags: ['React Native', 'iOS', 'Android'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=70',
  },
  {
    title: 'Social Media Growth',
    category: 'SMM',
    desc: 'Grew an e-commerce brand from 2K to 50K followers in 6 months with targeted content and ad campaigns.',
    color: '#8b5cf6',
    tags: ['Instagram', 'TikTok', 'Ads'],
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=70',
  },
];

export default function Portfolio() {
  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <div className="section-header">
          <span className="badge">Our Work</span>
          <HeadingAnchor as="h2" id="case-studies">Projects That Speak <br /> for Themselves</HeadingAnchor>
          <p>Real results for real businesses. Here's a sample of what we deliver.</p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="project-card"
            >
              <div className="project-preview" style={{ position: 'relative' }}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
                <div className="preview-scrim" style={{ background: `linear-gradient(180deg, transparent 40%, ${project.color}30 100%)` }} />
                <div className="preview-bar">
                  <div className="dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>

              <div className="project-info">
                <span className="project-category" style={{ color: project.color }}>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="cta-row">
          <a href="#contact" className="btn-primary">Start Your Project</a>
        </div>
      </div>

      <style jsx>{`
        .portfolio {
          padding: 100px 20px;
          background: var(--background-translucent);
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 30px;
        }

        .project-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          border-color: var(--card-border-hover);
          transform: translateY(-5px);
        }

        .project-preview {
          height: 220px;
          position: relative;
          overflow: hidden;
        }

        .preview-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .preview-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 12px 16px;
          background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%);
        }

        .dots {
          display: flex;
          gap: 6px;
        }

        .dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
        }

        .dots span:nth-child(1) { background: #ff5f57; }
        .dots span:nth-child(2) { background: #febc2e; }
        .dots span:nth-child(3) { background: #28c840; }

        .project-info {
          padding: 25px;
        }

        .project-category {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        h3 {
          font-size: 1.3rem;
          margin: 8px 0 12px;
          color: white;
        }

        p {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .cta-row {
          text-align: center;
          margin-top: 60px;
        }

        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
