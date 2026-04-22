'use client';
import { useState, useRef, useMemo } from 'react';
import { Send, CheckCircle, Loader2, Shield } from 'lucide-react';
import HeadingAnchor from './HeadingAnchor';

// Generate a fresh math challenge. Kept simple (small addition) so real
// humans don't get annoyed but automated form-fill bots still fail.
function makeChallenge() {
  const a = Math.floor(Math.random() * 8) + 2; // 2..9
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b, answer: a + b };
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web Development',
    message: '',
    captcha: '',
    // Honeypot field — real users never see or touch this; most spam bots
    // blindly fill every field they find, so a non-empty value is our
    // signal to silently drop the submission.
    website: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  // Regenerating the challenge per-mount (and on failed submit) makes it
  // hard to hard-code a bot around a single answer.
  const [challenge, setChallenge] = useState(() => makeChallenge());

  // Track how long the user spent on the form. Real humans take at least a
  // couple of seconds; scripted submissions tend to fire within ms.
  const mountedAt = useRef(Date.now());

  const minDwellMs = 2500; // 2.5s minimum

  const challengeLabel = useMemo(
    () => `What is ${challenge.a} + ${challenge.b}?`,
    [challenge]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    const parsed = Number(formData.captcha.trim());
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'Please solve the challenge';
    } else if (!Number.isFinite(parsed) || parsed !== challenge.answer) {
      newErrors.captcha = 'That doesn\'t look right. Try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot triggered — almost certainly a bot. Pretend success so the
    // bot thinks it worked and moves on.
    if (formData.website) {
      setStatus('sent');
      return;
    }

    // Too-fast submission — likely automated.
    if (Date.now() - mountedAt.current < minDwellMs) {
      setErrors({ captcha: 'Please take a moment before submitting.' });
      return;
    }

    if (!validate()) {
      // Refresh the challenge on any failure so a retry uses a new number.
      setChallenge(makeChallenge());
      setFormData((p) => ({ ...p, captcha: '' }));
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          message: formData.message,
          website: formData.website,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrors({ captcha: data.error || 'Could not send. Please try again.' });
        setChallenge(makeChallenge());
        setFormData((p) => ({ ...p, captcha: '' }));
        return;
      }

      setStatus('sent');
      setFormData({ name: '', email: '', service: 'Web Development', message: '', captcha: '', website: '' });
      setChallenge(makeChallenge());
    } catch (err) {
      setStatus('error');
      setErrors({ captcha: 'Network error. Please try again.' });
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-card glass">
          <div className="contact-info">
            <HeadingAnchor as="h2" id="get-in-touch">Ready to Lead Your <br /> Industry?</HeadingAnchor>
            <p>Let's build something extraordinary together.</p>

            <div className="offer-list">
              <div className="offer-item">
                <CheckCircle className="text-purple" size={20} />
                <span>20% Discount for New Clients</span>
              </div>
              <div className="offer-item">
                <CheckCircle className="text-purple" size={20} />
                <span>Free SEO Performance Audit</span>
              </div>
              <div className="offer-item">
                <CheckCircle className="text-purple" size={20} />
                <span>Free Custom Website Demo</span>
              </div>
            </div>

            <div className="direct-contact">
              <p>Email us directly:</p>
              <a href="mailto:info@nhdigitalservices.com">info@nhdigitalservices.com</a>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {status === 'sent' ? (
              <div className="success-msg">
                <CheckCircle size={48} color="#10b981" />
                <h3>Message sent!</h3>
                <p>Thanks! We received your message and will get back to you within 24 hours.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStatus('idle')}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Work Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="service">Project Interest</label>
                  <div className="select-wrap">
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="SEO & Marketing">SEO & Marketing</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="App Development">App Development</option>
                      <option value="Logistics Solutions">Logistics Solutions</option>
                      <option value="Other">Other</option>
                    </select>
                    <svg className="select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your goals..."
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'input-error' : ''}
                  />
                  {errors.message && <span className="error">{errors.message}</span>}
                </div>

                {/* Honeypot — visually + screen-reader hidden. Bots that
                    blind-fill every input will trip it. */}
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website">Website (leave blank)</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                {/* Human-check challenge */}
                <div className="form-group captcha-group">
                  <label htmlFor="captcha">
                    <Shield size={14} aria-hidden="true" /> {challengeLabel}
                  </label>
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Type the number"
                    value={formData.captcha}
                    onChange={handleChange}
                    className={errors.captcha ? 'input-error' : ''}
                  />
                  {errors.captcha && <span className="error">{errors.captcha}</span>}
                </div>

                <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>Sending... <Loader2 size={18} className="spin" /></>
                  ) : (
                    <>Get Started <Send size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact {
          padding: 80px 20px 60px;
          background: radial-gradient(circle at top right, rgba(168, 85, 247, 0.1), transparent 40%);
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .contact-card {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          padding: 60px;
          border-radius: 40px;
          gap: 60px;
          align-items: center;
        }

        h2 {
          font-size: 2.8rem;
          margin-bottom: 20px;
        }

        .offer-list {
          margin: 40px 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .offer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e2e8f0;
          font-weight: 500;
        }

        .text-purple {
          color: #a855f7;
        }

        .direct-contact {
          margin-top: 40px;
        }

        .direct-contact a {
          font-size: 1.2rem;
          font-weight: 700;
          color: #a855f7;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #94a3b8;
        }

        input, select, textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 15px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #a855f7;
        }

        .select-wrap {
          position: relative;
        }

        .select-wrap select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 42px;
          cursor: pointer;
          background-image: none;
        }

        /* Dropdown panel (rendered by the browser). Most engines honor these
           on <option>, giving the open list a dark background instead of the
           default white-on-white that looked broken. */
        .select-wrap select option {
          background-color: #1c2340;
          color: #e2e8f0;
          padding: 8px;
        }

        .select-caret {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .input-error {
          border-color: #ef4444 !important;
        }

        .error {
          color: #ef4444;
          font-size: 0.8rem;
        }

        textarea {
          height: 120px;
          resize: none;
        }

        .btn-primary.w-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
          padding: 15px;
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
        }

        .captcha-group label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #a855f7;
        }

        .success-msg {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px 20px;
        }

        .success-msg h3 {
          color: white;
          font-size: 1.5rem;
        }

        .success-msg p {
          color: #94a3b8;
          font-size: 0.95rem;
          max-width: 300px;
        }

        @media (max-width: 900px) {
          .contact-card {
            grid-template-columns: 1fr;
            padding: 40px 30px;
            gap: 40px;
          }
          h2 {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </section>
  );
}
