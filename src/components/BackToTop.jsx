'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />

          <style jsx>{`
            .back-to-top {
              position: fixed;
              bottom: 30px;
              left: 30px;
              width: 44px;
              height: 44px;
              background: rgba(30, 41, 59, 0.8);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 1500;
              transition: all 0.2s ease;
            }

            .back-to-top:hover {
              background: var(--primary);
              border-color: var(--primary);
              transform: translateY(-2px);
            }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
