'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import HeadingAnchor from '../HeadingAnchor';

export default function ServiceProcess({ service }) {
  const [active, setActive] = useState(0);
  const steps = service.process;

  return (
    <section className="process-section" id="process">
      <div className="container">
        <div className="section-header">
          <span className="badge">How it works</span>
          <HeadingAnchor as="h2" id="our-process">A clear path from kickoff to launch</HeadingAnchor>
          <p>No surprises. Here's exactly what happens after you reach out.</p>
        </div>

        <div className="process-layout">
          <div className="step-rail" role="tablist" aria-label="Process steps">
            {steps.map((step, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <button
                  key={step.title}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`rail-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                >
                  <span className="rail-dot" style={isActive ? { background: service.gradient, borderColor: 'transparent' } : {}}>
                    {isDone ? <Check size={14} /> : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="rail-label">
                    <span className="rail-title">{step.title}</span>
                    <span className="rail-duration">Phase {i + 1} of {steps.length}</span>
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      className={`rail-connector ${isDone ? 'done' : ''}`}
                      style={isDone ? { background: service.color } : {}}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="step-detail"
            >
              <div className="detail-head">
                <span className="detail-num" style={{ background: service.gradient }}>
                  {String(active + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="detail-label" style={{ color: service.color }}>Step {active + 1}</span>
                  <h3>{steps[active].title}</h3>
                </div>
              </div>
              <p className="detail-body">{steps[active].desc}</p>

              <div className="detail-footer">
                <button
                  className="nav-btn"
                  onClick={() => setActive(Math.max(0, active - 1))}
                  disabled={active === 0}
                >
                  ← Previous
                </button>
                <div className="progress-bar" aria-hidden>
                  <span style={{ width: `${((active + 1) / steps.length) * 100}%`, background: service.gradient }} />
                </div>
                <button
                  className="nav-btn primary"
                  onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
                  disabled={active === steps.length - 1}
                  style={active === steps.length - 1 ? {} : { background: service.gradient, color: 'white', borderColor: 'transparent' }}
                >
                  Next step →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .process-section {
          padding: 80px 20px;
          position: relative;
          background: rgba(184, 121, 251, 0.03);
        }

        .process-section::before,
        .process-section::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 800px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-border), transparent);
        }
        .process-section::before { top: 0; }
        .process-section::after { bottom: 0; }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          margin: 12px 0 14px;
        }

        .section-header p {
          color: var(--text-muted);
        }

        .process-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          align-items: start;
        }

        .step-rail {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 10px 0;
          border-left: 0;
        }

        .rail-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 14px;
          text-align: left;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .rail-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .rail-item.active {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--card-border);
        }

        .rail-item.active .rail-title { color: white; }
        .rail-item.done { color: var(--foreground); }

        .rail-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          font-weight: 800;
          font-size: 0.72rem;
          color: var(--text-muted);
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }

        .rail-item.active .rail-dot { color: white; }
        .rail-item.done .rail-dot { color: white; background: rgba(255,255,255,0.1); }

        .rail-label {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .rail-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .rail-duration {
          font-size: 0.72rem;
          color: var(--text-dim);
          letter-spacing: 0.04em;
          margin-top: 2px;
        }

        .rail-connector {
          position: absolute;
          left: 32px;
          top: 58px;
          width: 2px;
          height: 18px;
          background: var(--card-border);
          pointer-events: none;
        }

        .step-detail {
          background: rgba(28, 35, 64, 0.55);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(8px);
          min-height: 340px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-head {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .detail-num {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          color: white;
          font-size: 1.1rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
        }

        .detail-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .detail-head h3 {
          font-size: 1.5rem;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .detail-body {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
          flex: 1;
        }

        .detail-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid var(--card-border);
        }

        .nav-btn {
          padding: 9px 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          color: var(--foreground);
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar span {
          display: block;
          height: 100%;
          border-radius: 9999px;
          transition: width 0.35s ease;
        }

        @media (max-width: 900px) {
          .process-layout {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .step-rail {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 8px;
          }
          .rail-connector { display: none; }
          .step-detail {
            padding: 28px 22px;
            min-height: 260px;
          }
        }

        @media (max-width: 500px) {
          .detail-footer {
            flex-wrap: wrap;
          }
          .progress-bar {
            order: -1;
            width: 100%;
            flex-basis: 100%;
          }
        }
      `}</style>
    </section>
  );
}
