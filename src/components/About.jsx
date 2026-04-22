'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Zap, Users, Clock, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import HeadingAnchor from './HeadingAnchor';

const stats = [
  { icon: <Zap size={20} />, number: '50+', label: 'Projects delivered' },
  { icon: <Users size={20} />, number: '40+', label: 'Happy clients' },
  { icon: <Clock size={20} />, number: '24/7', label: 'Support' },
  { icon: <Award size={20} />, number: '99%', label: 'Satisfaction' },
];

const pillars = [
  {
    title: 'Senior team, no handoffs',
    desc: 'The designer and developer you talk to are the ones doing the work. No juniors learning on your dime.',
  },
  {
    title: 'Ship weekly, not "soon"',
    desc: 'Every Friday you get a working build to click through, not a status email. Momentum stays visible.',
  },
  {
    title: 'Results you can measure',
    desc: 'Every project gets tracked goals like speed, rankings, and conversions, so you know exactly what you got.',
  },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="about-header"
        >
          <span className="badge">About us</span>
          <HeadingAnchor as="h2" id="why-nh-international">A small studio that <span className="highlight">ships real results</span></HeadingAnchor>
          <p className="lede">
            NH Digital Services is a tight crew of designers and engineers who treat your project like
            our own. We build websites, apps, and growth systems, and we stick around after launch.
          </p>
        </motion.div>

        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="about-visual"
          >
            <div className="main-image" style={{ position: 'relative' }}>
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=70"
                alt="Our team collaborating"
                fill
                sizes="(max-width: 900px) 100vw, 500px"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </div>

            <div className="floating-card stat-pop">
              <div className="pop-icon"><Sparkles size={18} /></div>
              <div>
                <strong>180% traffic growth</strong>
                <span>avg. client in year 1</span>
              </div>
            </div>

            <div className="floating-card team-pop">
              <div className="avatars">
                <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="" width={32} height={32} />
                <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="" width={32} height={32} />
                <Image src="https://randomuser.me/api/portraits/women/68.jpg" alt="" width={32} height={32} />
              </div>
              <div>
                <strong>40+ clients</strong>
                <span>trust us in 2026</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="about-content"
          >
            <ul className="pillars">
              {pillars.map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="pillar-num">0{i + 1}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="stats-row">
              {stats.map((s) => (
                <div key={s.label} className="stat-item">
                  <div className="stat-icon">{s.icon}</div>
                  <div>
                    <strong>{s.number}</strong>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cta-row">
              <a href="#contact" className="btn-primary">
                Work with us <ArrowUpRight size={16} />
              </a>
              <a href="#portfolio" className="btn-text">See our work →</a>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .about {
          padding: 100px 20px;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-header {
          max-width: 720px;
          margin: 0 auto 70px;
          text-align: center;
        }

        .about-header h2 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin: 15px 0 20px;
          line-height: 1.15;
        }

        .highlight {
          background: linear-gradient(135deg, #b879fb, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lede {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.65;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 70px;
          align-items: center;
        }

        .about-visual {
          position: relative;
        }

        .main-image {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .floating-card {
          position: absolute;
          background: rgba(28, 35, 64, 0.92);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 12px 16px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
          animation: floatUp 4s ease-in-out infinite;
        }

        .floating-card strong {
          display: block;
          color: white;
          font-size: 0.95rem;
        }

        .floating-card span {
          color: var(--text-dim);
          font-size: 0.78rem;
        }

        .stat-pop {
          top: 8%;
          right: -12px;
        }

        .pop-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #b879fb, #60a5fa);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .team-pop {
          bottom: 8%;
          left: -16px;
          animation-delay: 1.5s;
        }

        .avatars {
          display: flex;
        }

        .avatars :global(img) {
          border-radius: 50%;
          border: 2px solid #1c2340;
          margin-left: -10px;
          object-fit: cover;
        }

        .avatars :global(img:first-child) { margin-left: 0; }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .pillars {
          list-style: none;
          padding: 0;
          margin: 0 0 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pillars li {
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }

        .pillar-num {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--primary);
          background: var(--primary-subtle);
          padding: 6px 10px;
          border-radius: 8px;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }

        .pillars strong {
          display: block;
          color: white;
          font-size: 1.08rem;
          margin-bottom: 4px;
          font-weight: 700;
        }

        .pillars p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.55;
          margin: 0;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          padding: 24px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          border-radius: 18px;
          margin-bottom: 32px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--primary-subtle);
          color: var(--primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-item strong {
          display: block;
          color: white;
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .stat-item span {
          color: var(--text-dim);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cta-row {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-text {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }

        .btn-text:hover {
          color: var(--primary);
        }

        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .main-image {
            aspect-ratio: 16 / 10;
            max-width: 600px;
            margin: 0 auto;
          }
        }

        @media (max-width: 600px) {
          .stats-row {
            grid-template-columns: 1fr 1fr;
          }
          .stat-pop, .team-pop {
            position: static;
            margin: 12px auto 0;
            animation: none;
            max-width: 260px;
          }
        }
      `}</style>
    </section>
  );
}
