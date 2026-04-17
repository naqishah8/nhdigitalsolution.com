'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ height: 0, opacity: 0, padding: 0 }}
          transition={{ duration: 0.35 }}
          className="promo-banner"
        >
          <div className="promo-inner">
            <div className="promo-left">
              <span className="gift-icon">
                <Gift size={16} />
              </span>
              <span className="promo-text">
                <strong>20% off your first project</strong>
                <span className="divider">•</span>
                <span className="extra">Free SEO audit + website demo</span>
              </span>
            </div>
            <a href="#contact" className="claim-btn">
              Claim offer <ArrowRight size={14} />
            </a>
          </div>
          <button className="close-btn" onClick={() => setIsVisible(false)} aria-label="Dismiss banner">
            <X size={14} />
          </button>

          <style jsx>{`
            .promo-banner {
              position: relative;
              background: linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%);
              color: white;
              font-size: 0.88rem;
              font-weight: 500;
              z-index: 1001;
              overflow: hidden;
            }

            .promo-inner {
              max-width: 1200px;
              margin: 0 auto;
              padding: 10px 60px 10px 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
              flex-wrap: wrap;
              position: relative;
              z-index: 1;
            }

            .promo-left {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }

            .gift-icon {
              width: 26px;
              height: 26px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              background: rgba(255, 255, 255, 0.18);
              border-radius: 8px;
              flex-shrink: 0;
            }

            .promo-text {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }

            .promo-text strong {
              font-weight: 700;
            }

            .divider {
              opacity: 0.5;
            }

            .extra {
              opacity: 0.92;
            }

            .claim-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: white;
              color: #1c2340;
              font-weight: 700;
              font-size: 0.82rem;
              padding: 6px 14px;
              border-radius: 9999px;
              white-space: nowrap;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .claim-btn:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            }

            .close-btn {
              position: absolute;
              right: 14px;
              top: 50%;
              transform: translateY(-50%);
              width: 26px;
              height: 26px;
              background: rgba(255, 255, 255, 0.12);
              border: none;
              color: white;
              border-radius: 50%;
              cursor: pointer;
              padding: 0;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transition: background 0.2s ease;
              z-index: 2;
            }

            .close-btn:hover {
              background: rgba(255, 255, 255, 0.25);
            }

            @media (max-width: 640px) {
              .promo-inner {
                padding: 9px 44px 9px 14px;
                gap: 10px;
                font-size: 0.78rem;
              }
              .extra, .divider {
                display: none;
              }
              .claim-btn {
                padding: 5px 12px;
                font-size: 0.75rem;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
