'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, StarHalf, Quote } from 'lucide-react';
import HeadingAnchor from './HeadingAnchor';

const testimonials = [
  {
    name: 'Sarah Ahmed',
    role: 'CEO',
    company: 'Bloom Boutique',
    content: 'Our new site went live in 6 weeks. Load time dropped from 4.2s to under 1s and Q1 online sales are up 42%. I can edit landing pages myself now — huge win.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    accent: '#b879fb',
    posted: '3 weeks ago',
  },
  {
    name: 'David Chen',
    role: 'Founder',
    company: 'TechPulse',
    content: 'They nailed the brand on the second round of concepts. Logo and type system works everywhere — pitch decks, product UI, conference booth.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    accent: '#60a5fa',
    posted: '1 month ago',
  },
  {
    name: 'Maria Lopez',
    role: 'Marketing Director',
    company: 'FreshBite',
    content: 'Went from page 4 to top 3 for "healthy meal delivery" in our city in under 4 months. The free audit flagged a redirect loop nobody else caught.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    accent: '#34d399',
    posted: '2 months ago',
  },
  {
    name: 'James Wilson',
    role: 'Owner',
    company: 'Peak Fitness',
    content: 'Members use the app daily — workout streaks, class bookings. IG went from 1.2k to 14k in 8 months. Real ROI, not vanity metrics.',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    accent: '#fbbf24',
    posted: '2 weeks ago',
  },
  {
    name: 'Priya Natarajan',
    role: 'COO',
    company: 'ShipWise Logistics',
    content: 'Routing dashboard shaved 35% off average delivery window and cut fuel spend by ~18%. Weekly builds, attentive team, painless rollout.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    accent: '#f472b6',
    posted: '5 weeks ago',
  },
  {
    name: 'Omar Haddad',
    role: 'Co-founder',
    company: 'Lumen Studio',
    content: 'Replaced our agency after a disappointing year. NH rebuilt the marketing site in 5 weeks — Lighthouse 52 → 98 and qualified leads doubled in Q2.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    accent: '#818cf8',
    posted: '6 weeks ago',
  },
  {
    name: 'Elena Rossi',
    role: 'Head of Marketing',
    company: 'Verde Skincare',
    content: 'Rebrand plus Shopify rebuild delivered on time. AOV is up 28% and our return rate dropped — the new PDPs actually explain the product.',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    accent: '#10b981',
    posted: '1 month ago',
  },
  {
    name: 'Marcus Thornton',
    role: 'Managing Partner',
    company: 'Ironbridge Capital',
    content: 'Professional, fast, and didn\'t over-promise. Took two quarters to land where we wanted on rankings but the reporting was transparent the whole way.',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    accent: '#a78bfa',
    posted: '3 months ago',
  },
  {
    name: 'Aisha Rahman',
    role: 'Product Lead',
    company: 'NovaHealth',
    content: 'React Native app shipped to TestFlight in week 6. 4.8 rating at launch and the clinic onboarding flow converts 62% of invites. Rare result.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    accent: '#60a5fa',
    posted: '4 weeks ago',
  },
  {
    name: 'Daniel Okafor',
    role: 'CEO',
    company: 'Lagos Logistics Hub',
    content: 'Integrated with three carriers and our WMS without breaking a sweat. A few deadline slips early on but they caught us up and launched on schedule.',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    accent: '#f472b6',
    posted: '2 months ago',
  },
  {
    name: 'Sophie Müller',
    role: 'Creative Director',
    company: 'Kaleido Press',
    content: 'The logo exploration was thoughtful — they pushed back when I wanted something trendy and were right. Brand guidelines are genuinely usable by my team.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    accent: '#b879fb',
    posted: '6 weeks ago',
  },
  {
    name: 'Raj Patel',
    role: 'Founder',
    company: 'Chaiwala & Co',
    content: 'Google Maps listings went from invisible to top 3 in two districts. The monthly report is short, clear, and tells me what to do next.',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    accent: '#fbbf24',
    posted: '5 weeks ago',
  },
  {
    name: 'Isabella Romero',
    role: 'Owner',
    company: 'Casa Mia Restaurants',
    content: 'Three-location website with a reservation system. Booking conversions up 2.4x and the Instagram content plan brings in ~30 walk-ins a week.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    accent: '#34d399',
    posted: '7 weeks ago',
  },
  {
    name: 'Kenji Watanabe',
    role: 'CTO',
    company: 'Hinode SaaS',
    content: 'Dashboard redesign shipped in 4 sprints. Our users stopped complaining about the old UI and we closed two enterprise deals the month after launch.',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    accent: '#818cf8',
    posted: '2 months ago',
  },
];

// Render stars for an arbitrary decimal rating (supports .5 half-stars).
function Stars({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <span className="star-row" aria-label={`${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} fill="#fbbf24" color="#fbbf24" />
      ))}
      {hasHalf && <StarHalf size={size} fill="#fbbf24" color="#fbbf24" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} color="#475569" />
      ))}
    </span>
  );
}

function TCard({ t }) {
  return (
    <article className="t-card">
      <div className="t-top">
        <div className="avatar-ring" style={{ background: `linear-gradient(135deg, ${t.accent}, transparent)` }}>
          <div className="avatar" style={{ position: 'relative' }}>
            <Image src={t.avatar} alt={t.name} fill sizes="56px" style={{ objectFit: 'cover' }} loading="lazy" />
          </div>
        </div>
        <div className="person">
          <strong>{t.name}</strong>
          <span>{t.role} · {t.company}</span>
        </div>
        <Quote size={22} className="quote-mark" style={{ color: t.accent }} />
      </div>
      <p className="t-body">{t.content}</p>
      <div className="stars">
        <Stars rating={t.rating} />
        <span className="rating-text">
          {t.rating.toFixed(1)} · Verified client{t.posted ? ` · ${t.posted}` : ''}
        </span>
      </div>

      <style jsx>{`
        .t-card {
          width: 340px;
          flex-shrink: 0;
          padding: 24px;
          background: rgba(30, 41, 70, 0.55);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .t-card:hover {
          transform: translateY(-4px);
          border-color: rgba(184, 121, 251, 0.35);
        }

        .t-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-ring {
          width: 54px;
          height: 54px;
          padding: 2px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          background: #1c2340;
        }

        .person {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .person strong {
          color: white;
          font-size: 0.98rem;
          font-weight: 700;
        }

        .person span {
          color: var(--text-dim);
          font-size: 0.78rem;
        }

        .quote-mark {
          opacity: 0.7;
        }

        .t-body {
          color: var(--foreground);
          font-size: 0.93rem;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          flex-wrap: wrap;
        }

        .star-row {
          display: inline-flex;
          gap: 2px;
          align-items: center;
        }

        .rating-text {
          color: var(--text-dim);
          font-size: 0.74rem;
          font-weight: 500;
        }
      `}</style>
    </article>
  );
}

// Two continuous marquee rows moving in opposite directions.
// The trick: duplicate the children so the translate animation can loop by
// -50% seamlessly (because the second copy takes over exactly where the first
// ends). Direction flips via `reverse` which runs the same animation backwards.
function MarqueeRow({ items, reverse, speed = 55 }) {
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''}`} aria-hidden="false">
      <div className="track" style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items].map((t, i) => (
          <TCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>

      <style jsx>{`
        .marquee {
          position: relative;
          overflow: hidden;
          padding: 14px 0;
          mask-image: linear-gradient(
            to right,
            transparent 0,
            black 8%,
            black 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .track {
          display: flex;
          gap: 22px;
          width: max-content;
          animation-name: scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .marquee.reverse .track {
          animation-direction: reverse;
        }

        .marquee:hover .track,
        .marquee:focus-within .track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 11px)); } /* 11px = half of 22px gap */
        }

        @media (prefers-reduced-motion: reduce) {
          .track { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function Testimonials() {
  // Split into two roughly equal rows for the two opposing marquees.
  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 = testimonials.slice(mid);

  const avg = (
    testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
  ).toFixed(1);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="badge">Reviews</span>
          <HeadingAnchor as="h2" id="client-reviews">Loved by founders <br /> who ship ambitious work</HeadingAnchor>
          <div className="header-meta">
            <Stars rating={Number(avg)} size={16} />
            <span>{avg} average · {testimonials.length}+ verified reviews</span>
          </div>
        </motion.div>
      </div>

      <div className="marquee-wrap">
        <MarqueeRow items={row1} speed={60} />
        <MarqueeRow items={row2} reverse speed={70} />
      </div>

      <style jsx>{`
        .testimonials {
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .header-meta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          color: var(--text-muted);
          font-size: 0.92rem;
        }

        .marquee-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </section>
  );
}
