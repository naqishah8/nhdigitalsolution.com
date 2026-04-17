'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('./Three/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  return (
    <section className="hero">
      <HeroCanvas />
      
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <span className="badge">Next Generation Digital Agency</span>
          <h1 className="text-gradient">
            We Build Digital <br />
            <span>Experiences</span> That <br />
            Drive Success.
          </h1>
          <p>
            Transform your brand with modern web development, creative design, 
            and data-driven SEO. Get the professional edge your business deserves.
          </p>
          
          <div className="hero-btns">
            <a href="#contact" className="btn-primary">Get Your Free SEO Audit</a>
            <a href="#services" className="btn-secondary">Explore Services</a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">50+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat">
              <span className="stat-num">99%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
            <div className="stat">
              <span className="stat-num">24/7</span>
              <span className="stat-label">AI Assisted Support</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 80px 20px;
          overflow: hidden;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        
        .hero-content {
          max-width: 650px;
        }
        
        .badge {
          display: inline-block;
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
          padding: 6px 16px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 20px;
          border: 1px solid rgba(168, 85, 247, 0.2);
        }
        
        h1 {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 25px;
        }
        
        h1 span {
          color: #a855f7;
          position: relative;
        }
        
        p {
          font-size: 1.15rem;
          color: #94a3b8;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        
        .hero-btns {
          display: flex;
          gap: 20px;
          margin-bottom: 50px;
        }
        
        .btn-secondary {
          padding: 0.8rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: white;
        }
        
        .hero-stats {
          display: flex;
          gap: 40px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
        }
        
        .stat-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        @media (max-width: 768px) {
          .hero {
            text-align: center;
            padding-top: 120px;
          }
          .hero-content {
            max-width: 100%;
          }
          .hero-btns {
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }
          .btn-secondary {
            text-align: center;
          }
          .hero-stats {
            justify-content: center;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding-top: 100px;
            min-height: auto;
            padding-bottom: 60px;
          }
          .hero-stats {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
