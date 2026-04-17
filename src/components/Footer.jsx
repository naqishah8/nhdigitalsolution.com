'use client';
import Link from 'next/link';
import { COMPANY } from '@/data/company';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo" aria-label="NH Digital Solution home">
              <img src="/logo/full-logo.webp" alt="NH Digital Solution" className="logo-full" width="288" height="58" />
            </Link>
            <p>Elevating brands through premium digital craftsmanship. Your partner for modern innovation.</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Solutions</h4>
              <Link href="/services/web-development">Web Development</Link>
              <Link href="/services/graphic-design">Graphic Design</Link>
              <Link href="/services/seo-optimization">SEO & Marketing</Link>
              <Link href="/services/app-development">App Development</Link>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
            {/* NAP block — duplicated here for consistency with structured data */}
            <address className="link-group contact-group">
              <h4>Visit or call</h4>
              <p>
                {COMPANY.address.addressLocality}, {COMPANY.address.addressRegion}{' '}
                {COMPANY.address.postalCode}
                <br />USA
              </p>
              <a href={`tel:${COMPANY.phone.replace(/[^+\d]/g, '')}`}>{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <p className="hours">Mon–Fri · 8 AM – 6 PM CT</p>
            </address>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p>
          <div className="social-links">
            <a
              href={COMPANY.social.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${COMPANY.brand} on LinkedIn`}
            >
              LinkedIn
            </a>
            <a
              href={COMPANY.social.instagram}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${COMPANY.brand} on Instagram`}
            >
              Instagram
            </a>
            <a
              href={COMPANY.social.facebook}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${COMPANY.brand} on Facebook`}
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          padding: 60px 20px 28px;
          background: rgba(17, 22, 40, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-top {
          display: flex;
          justify-content: space-between;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 28px;
          gap: 60px;
        }
        
        .footer-brand {
          max-width: 350px;
        }
        
        .logo {
          display: inline-block;
          margin-bottom: 20px;
        }

        .logo-full {
          display: block;
          height: 58px;
          width: auto;
          max-width: 288px;
          object-fit: contain;
        }
        
        .footer-brand p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .footer-links {
          display: flex;
          gap: 80px;
        }
        
        .link-group h4 {
          color: white;
          font-size: 1rem;
          margin-bottom: 20px;
        }
        
        .link-group a {
          display: block;
          color: #94a3b8;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }
        
        .link-group a:hover {
          color: #a855f7;
        }

        .contact-group {
          font-style: normal;
        }

        .contact-group p {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0 0 12px;
          line-height: 1.6;
        }

        .contact-group .hours {
          color: #64748b;
          font-size: 0.85rem;
          margin-top: 10px;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 0.85rem;
        }
        
        .social-links {
          display: flex;
          gap: 20px;
        }

        .social-links a {
          color: #64748b;
          transition: color 0.3s ease;
        }

        .social-links a:hover {
          color: #a855f7;
        }
        
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
            gap: 40px;
          }
          .footer-links {
            gap: 40px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
