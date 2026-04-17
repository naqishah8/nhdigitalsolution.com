'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#portfolio' },
    { name: 'About', href: '/#about' },
    { name: 'Reviews', href: '/#testimonials' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="container">
        <Link href="/" className="logo" aria-label="NH Digital Solution home">
          <img src="/logo/icon.webp" alt="" className="logo-icon-img" width={40} height={40} />
          <span className="logo-text">
            <span className="logo-title">NH International</span>
            <span className="logo-sub">Digital Solution</span>
          </span>
        </Link>

        <div className="desktop-links">
          <div className="nav-pill">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
          </div>
          <a href="#contact" className="btn-nav">
            Get Started <ArrowUpRight size={16} />
          </a>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-menu"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" className="btn-nav" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started <ArrowUpRight size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 20px;
          transition: padding 0.3s ease, background 0.3s ease, border-color 0.3s ease;
          border-bottom: 1px solid transparent;
        }

        .navbar.scrolled {
          padding: 10px 20px;
          background: rgba(21, 27, 46, 0.75);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .logo-icon-img {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: contain;
          box-shadow: 0 6px 16px rgba(184, 121, 251, 0.35);
          display: block;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-title {
          font-weight: 800;
          font-size: 1.05rem;
          color: white;
        }

        .logo-sub {
          font-size: 0.7rem;
          color: var(--text-dim);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .desktop-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          padding: 5px;
          border-radius: 9999px;
          backdrop-filter: blur(10px);
        }

        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.92rem;
          padding: 7px 16px;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.07);
        }

        .btn-nav {
          background: linear-gradient(135deg, #b879fb 0%, #60a5fa 100%);
          color: white;
          padding: 9px 18px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.88rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 18px rgba(184, 121, 251, 0.35);
          transition: all 0.2s ease;
        }

        .btn-nav:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(184, 121, 251, 0.5);
        }

        .mobile-toggle {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 16px;
          right: 16px;
          background: rgba(21, 27, 46, 0.96);
          backdrop-filter: blur(14px);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .mobile-menu a {
          color: var(--text-muted);
          font-size: 1rem;
          font-weight: 500;
          padding: 12px 16px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .mobile-menu a:not(.btn-nav):hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .mobile-menu .btn-nav {
          margin-top: 8px;
          justify-content: center;
        }

        @media (max-width: 820px) {
          .desktop-links {
            display: none;
          }
          .mobile-toggle {
            display: inline-flex;
          }
          .logo-sub {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
