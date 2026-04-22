'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowUp, MoreHorizontal,
  VolumeX, Download, XCircle, Sparkles,
} from 'lucide-react';

const BRAND = 'NH International';
const AGENT_SHORT = 'NOVA';
const AGENT_FULL = 'Nova · Virtual Agent';
const AVATAR_URL = '/nova/nova.webp';
// Landscape portrait — face sits upper-center. Tuned so forehead → chin fit.
const AVATAR_BG_SIZE = '420%';
const AVATAR_BG_POSITION = '48% 28%';
const TRANSCRIPT_KEY = 'nh-nova-transcripts';

const GREETING = [
  'Hi there!',
  `I'm ${AGENT_SHORT}, ${BRAND}'s AI guide.`,
  'How can I help you today?',
];

const QUICK_REPLIES = [
  'See services',
  'Get a quote',
  'Book a call',
  'Talk to a human',
];

function Avatar({ size = 32 }) {
  // Using background-image gives exact pixel-free control over the crop.
  // background-size is a % of the container, so 560% of a 32px circle
  // renders the image at 179px wide — enough to isolate just her face.
  return (
    <span
      role="img"
      aria-label={AGENT_SHORT}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#1f2937',
        backgroundImage: `url(${AVATAR_URL})`,
        backgroundSize: AVATAR_BG_SIZE,
        backgroundPosition: AVATAR_BG_POSITION,
        backgroundRepeat: 'no-repeat',
        flexShrink: 0,
      }}
    />
  );
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const GREETING_TIP_KEY = 'nh-nova-tip-dismissed';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [messages, setMessages] = useState(() =>
    GREETING.map((content) => ({ role: 'assistant', content, ts: nowLabel() }))
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bodyEndRef = useRef(null);

  useEffect(() => {
    bodyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Actually retain transcripts — the disclaimer needs to be truthful.
  // Stored locally per-browser so a returning visitor can pick up where they left off.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(TRANSCRIPT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
          setHasInteracted(parsed.some((m) => m.role === 'user'));
        }
      }
    } catch {}
  }, []);

  // Show a greeting tooltip once per visitor after a short delay.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(GREETING_TIP_KEY)) return;
    } catch {}
    const showTimer = setTimeout(() => setTipVisible(true), 1800);
    const hideTimer = setTimeout(() => setTipVisible(false), 12000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const dismissTip = () => {
    setTipVisible(false);
    try { localStorage.setItem(GREETING_TIP_KEY, '1'); } catch {}
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TRANSCRIPT_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Close the overflow menu on outside click / escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onClick = (e) => {
      if (!e.target.closest?.('.agent-menu') && !e.target.closest?.('.menu-trigger')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [menuOpen]);

  const send = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || isLoading) return;

    setHasInteracted(true);
    const userMessage = { role: 'user', content: text, ts: nowLabel() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 30s client-side timeout so the composer never locks up forever
    // if the upstream model stalls or the connection drops.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, ts: nowLabel() }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'I didn\'t catch that. Could you rephrase? If this keeps happening, email info@nhdigitalservices.com.',
          ts: nowLabel(),
        }]);
      }
    } catch (err) {
      const isAbort = err?.name === 'AbortError';
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: isAbort
          ? 'That took too long. Can you try again? If it happens twice in a row, email info@nhdigitalservices.com.'
          : 'Network hiccup. Try again or email info@nhdigitalservices.com.',
        ts: nowLabel(),
      }]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const downloadTranscript = () => {
    const lines = messages.map((m) => `[${m.ts}] ${m.role === 'assistant' ? AGENT_SHORT : 'You'}: ${m.content}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const endChat = () => {
    const fresh = GREETING.map((content) => ({ role: 'assistant', content, ts: nowLabel() }));
    setMessages(fresh);
    setHasInteracted(false);
    setMenuOpen(false);
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(TRANSCRIPT_KEY); } catch {}
    }
  };

  // Group consecutive assistant messages to share one header row like Zoom's ZVA layout
  const groupedMessages = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prev = messages[i - 1];
    const startsAssistantCluster =
      msg.role === 'assistant' && (!prev || prev.role !== 'assistant');
    groupedMessages.push({ ...msg, startsCluster: startsAssistantCluster });
  }

  return (
    <div className="chat-anchor">
      {/* Chat popup — anchored directly above the launcher */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="chat-window"
            role="dialog"
            aria-label={AGENT_FULL}
            style={{
              // Hard-pin tower dimensions inline so no cached/scoped CSS can fight us.
              position: 'absolute',
              right: 0,
              bottom: 'calc(100% + 14px)',
              width: 'min(340px, calc(100vw - 28px))',
              height: 'min(540px, calc(100vh - 120px))',
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              transformOrigin: 'bottom right',
            }}
          >
            {/* Gradient header */}
            <header className="chat-header">
              <div className="header-title">
                <span className="brand-word">{BRAND}</span>
                <span className="agent-word">Virtual Agent</span>
              </div>

              <div className="header-actions">
                <div className="menu-wrap">
                  <button
                    className="menu-trigger"
                    aria-label="Chat options"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.14 }}
                        className="agent-menu"
                      >
                        <button onClick={() => { setMuted((v) => !v); setMenuOpen(false); }}>
                          <VolumeX size={16} />
                          <span>{muted ? 'Unmute sound' : 'Mute sound'}</span>
                        </button>
                        <button onClick={downloadTranscript}>
                          <Download size={16} />
                          <span>Download transcript</span>
                        </button>
                        <button onClick={endChat}>
                          <XCircle size={16} />
                          <span>End chat</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className="close-btn"
                  aria-label="Close chat"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="chat-body">
              {groupedMessages.map((msg, i) => {
                if (msg.role === 'user') {
                  return (
                    <div key={i} className="row user">
                      <div className="bubble user-bubble">{msg.content}</div>
                    </div>
                  );
                }

                // assistant
                return (
                  <div key={i} className="row assistant">
                    <div className="avatar-slot">
                      {msg.startsCluster && <Avatar size={34} />}
                    </div>
                    <div className="assistant-col">
                      {msg.startsCluster && (
                        <div className="meta-row">
                          <span className="sender">{AGENT_SHORT}</span>
                          <span className="agent-chip"><Sparkles size={10} /> VIRTUAL AGENT</span>
                          <span className="time">{msg.ts}</span>
                        </div>
                      )}
                      <div className="bubble assistant-bubble">{msg.content}</div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="row assistant">
                  <div className="avatar-slot"><Avatar size={34} /></div>
                  <div className="assistant-col">
                    <div className="meta-row">
                      <span className="sender">{AGENT_SHORT}</span>
                      <span className="agent-chip"><Sparkles size={10} /> VIRTUAL AGENT</span>
                    </div>
                    <div className="bubble assistant-bubble typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              {!hasInteracted && !isLoading && (
                <div className="row assistant">
                  <div className="avatar-slot" />
                  <div className="assistant-col">
                    <div className="quick-row">
                      {QUICK_REPLIES.map((q) => (
                        <button key={q} onClick={() => send(q)} className="quick-pill">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bodyEndRef} />
            </div>

            {/* Composer */}
            <div className="composer-wrap">
              <div className="composer">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Write a message"
                  aria-label="Write a message"
                />
                <button
                  className="send-circle"
                  onClick={() => send()}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <ArrowUp size={16} />
                </button>
              </div>
              <p className="disclaimer">
                {BRAND} may retain transcripts for training purposes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting bubble — proactive nudge shown once per visitor after ~2s. */}
      <AnimatePresence>
        {tipVisible && !isOpen && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="tip-bubble"
            role="status"
          >
            <button
              className="tip-body"
              onClick={() => { dismissTip(); setIsOpen(true); }}
              aria-label="Open chat with Nova"
            >
              <span className="tip-text">Hi there! Can I help you?</span>
            </button>
            <button
              className="tip-close"
              onClick={dismissTip}
              aria-label="Dismiss greeting"
            >
              <X size={12} strokeWidth={2.6} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher — pinned 42px via inline style so nothing can override. */}
      <motion.button
        onClick={() => { dismissTip(); setIsOpen((v) => !v); }}
        className="chat-launcher"
        aria-label={isOpen ? 'Close chat' : `Open chat with ${AGENT_SHORT}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 42,
          height: 42,
          minWidth: 42,
          minHeight: 42,
          borderRadius: '50%',
          background: '#ffffff',
          border: 'none',
          padding: 0,
          boxShadow: 'none',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="launcher-inner close-state"
            >
              <X size={26} strokeWidth={2.4} />
            </motion.span>
          ) : (
            <span key="char" className="launcher-inner char-state" aria-hidden="true">
              {/* Minimal portrait — only the shapes that actually read at 46px:
                  hair silhouette, face, eyes, smile. Blush / strands / highlight
                  turn to noise at this scale so they're removed. */}
              <svg viewBox="0 0 64 64" className="char-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lcharHead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fdf4ff" />
                    <stop offset="100%" stopColor="#c4b5fd" />
                  </linearGradient>
                  <linearGradient id="lcharHair" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b2370" />
                    <stop offset="100%" stopColor="#1f1340" />
                  </linearGradient>
                </defs>

                {/* Hair silhouette — asymmetric so it doesn't read as a cap */}
                <path
                  d="M14 30 Q12 12 32 10 Q52 12 50 30 L50 44 Q50 52 44 52 Q44 44 42 36 Q38 34 32 34 Q26 34 22 36 Q20 44 20 52 Q14 52 14 44 Z"
                  fill="url(#lcharHair)"
                />

                {/* Face */}
                <circle cx="32" cy="32" r="13" fill="url(#lcharHead)" />

                {/* Swept fringe on top of the face */}
                <path d="M20 26 Q24 16 33 17 Q42 18 43 26 Q38 22 32 23 Q25 24 20 26 Z" fill="url(#lcharHair)" />

                {/* Eyes */}
                <circle cx="27.5" cy="32" r="1.6" fill="#1f2937" />
                <circle cx="36.5" cy="32" r="1.6" fill="#1f2937" />

                {/* Smile */}
                <path d="M28.5 37 Q32 39.5 35.5 37" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          )}
        </AnimatePresence>
        {!isOpen && <span className="online-dot" aria-label="Nova is online" />}
      </motion.button>

      <style jsx>{`
        .chat-anchor {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 2700;
        }

        /* Proactive greeting — speech bubble to the left of the launcher. */
        .tip-bubble {
          position: absolute;
          right: calc(100% + 10px);
          bottom: 2px;
          display: flex;
          align-items: stretch;
          gap: 4px;
          white-space: nowrap;
          filter: drop-shadow(0 8px 20px rgba(15, 23, 42, 0.22));
        }

        .tip-body {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 10px 16px;
          font-size: 0.86rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          line-height: 1.3;
          transition: transform 0.18s ease, background 0.18s ease;
        }

        .tip-body:hover {
          background: #f8fafc;
          transform: translateY(-1px);
        }

        /* Arrow tail pointing at the launcher on the right. */
        .tip-body::after {
          content: '';
          position: absolute;
          right: -5px;
          bottom: 14px;
          width: 10px;
          height: 10px;
          background: white;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          transform: rotate(-45deg);
        }

        .tip-close {
          background: #fff;
          border: 1px solid #e5e7eb;
          color: #64748b;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          align-self: center;
          flex-shrink: 0;
          padding: 0;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .tip-close:hover {
          color: #1f2937;
          background: #f3f4f6;
        }

        @media (max-width: 480px) {
          .tip-bubble { display: none; }
        }

        /* Launcher — plain white circle, 42px (5% larger than the 40px
           navbar logo icon so it reads at the same visual weight). No
           shadow, no gradient, no border — just a clean disc. */
        .chat-launcher {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          box-shadow: none;
          transition: transform 0.2s ease;
        }

        .launcher-inner {
          position: relative;
          width: 100%;
          height: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .char-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .close-state {
          color: white;
        }

        /* Online-presence dot — tiny, off the very corner of the avatar */
        .online-dot {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          border: 1.5px solid #151b2e;
          z-index: 2;
        }

        /* Window */
        .chat-window {
          position: absolute;
          right: 0;
          bottom: calc(100% + 14px);
          /* Tower column — slight widening for readability */
          width: 340px;
          max-width: calc(100vw - 24px);
          height: min(560px, calc(100vh - 120px));
          display: flex;
          flex-direction: column;
          background: #ffffff;
          color: #1f2937;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(15, 23, 42, 0.45);
          transform-origin: bottom right;
        }

        /* Header */
        .chat-header {
          position: relative;
          padding: 16px 16px 18px;
          color: white;
          background: linear-gradient(120deg, #7c3aed 0%, #b879fb 55%, #60a5fa 100%);
          flex-shrink: 0;
        }

        .header-title {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-right: 84px; /* reserve space for menu + close icons */
        }

        .brand-word {
          font-weight: 900;
          letter-spacing: 0.01em;
          font-size: 0.92rem;
          text-transform: uppercase;
        }

        .agent-word {
          font-weight: 400;
          font-size: 1.05rem;
          letter-spacing: -0.005em;
        }

        .header-actions {
          position: absolute;
          top: 14px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .menu-trigger,
        .close-btn {
          background: transparent;
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.85;
          transition: opacity 0.2s ease, background 0.2s ease;
        }

        .menu-trigger:hover,
        .close-btn:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.14);
        }

        .menu-wrap {
          position: relative;
        }

        /* Drop down from the 3-dots button itself so the position is
           predictable regardless of header width. A small caret pins the
           menu visually to the button so it reads as an anchored popover
           rather than a floating panel. */
        .agent-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: -4px;
          background: white;
          color: #1f2937;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28),
                      0 2px 6px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(15, 23, 42, 0.08);
          padding: 6px;
          min-width: 220px;
          z-index: 100;
        }

        .agent-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          right: 16px;
          width: 12px;
          height: 12px;
          background: white;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          border-left: 1px solid rgba(15, 23, 42, 0.08);
          transform: rotate(45deg);
        }

        .agent-menu button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          color: #1f2937;
          font-size: 0.9rem;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          position: relative;
          z-index: 1;
        }

        .agent-menu button:hover {
          background: #f3f4f6;
        }

        .agent-menu button + button {
          margin-top: 2px;
        }

        /* Body */
        .chat-body {
          flex: 1;
          padding: 16px 18px 24px;
          overflow-y: auto;
          background: white;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .chat-body::-webkit-scrollbar { width: 6px; }
        .chat-body::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 8px;
        }

        .row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .row.assistant { justify-content: flex-start; }
        .row.user { justify-content: flex-end; }

        .avatar-slot {
          width: 34px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
        }

        .assistant-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 0;
          max-width: 85%;
        }

        .meta-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          color: #64748b;
          margin-top: 2px;
        }

        .sender {
          font-weight: 800;
          color: #1f2937;
          letter-spacing: 0.03em;
        }

        .agent-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #f3e8ff;
          color: #7c3aed;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .time { color: #9ca3af; font-size: 0.75rem; }

        .bubble {
          padding: 10px 14px;
          font-size: 0.93rem;
          line-height: 1.5;
          border-radius: 18px;
          word-wrap: break-word;
          max-width: 100%;
          width: fit-content;
        }

        .assistant-bubble {
          background: #f1f5f9;
          color: #1f2937;
          border-bottom-left-radius: 6px;
        }

        .user-bubble {
          background: linear-gradient(135deg, #b879fb, #60a5fa);
          color: white;
          border-bottom-right-radius: 6px;
          max-width: 80%;
        }

        .typing {
          display: inline-flex;
          gap: 4px;
          align-items: center;
          padding: 12px 14px;
        }
        .typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94a3b8;
          animation: typingBounce 1.2s infinite ease-in-out;
        }
        .typing span:nth-child(2) { animation-delay: 0.15s; }
        .typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .quick-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }

        .quick-pill {
          background: white;
          color: #7c3aed;
          border: 1.5px solid #ddd6fe;
          border-radius: 9999px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .quick-pill:hover {
          background: #f5f3ff;
          border-color: #b879fb;
          color: #6d28d9;
        }

        /* Composer */
        .composer-wrap {
          padding: 12px 16px 12px;
          border-top: 1px solid #eef2f7;
          background: white;
          flex-shrink: 0;
        }

        .composer {
          position: relative;
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 8px 8px 8px 16px;
          transition: border-color 0.2s ease;
        }

        .composer:focus-within { border-color: #c4b5fd; }

        .composer input {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          color: #1f2937;
          font-size: 0.92rem;
          font-family: inherit;
          padding: 4px 0;
          outline: none;
        }

        .composer input::placeholder { color: #94a3b8; }

        .composer-icons {
          display: inline-flex;
          gap: 2px;
          margin-right: 4px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #64748b;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .icon-btn:hover:not(:disabled) { color: #1f2937; }
        .icon-btn:disabled { opacity: 0.5; cursor: default; }

        .send-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #b879fb, #60a5fa);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-circle:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 14px rgba(184, 121, 251, 0.45);
        }

        .send-circle:disabled {
          background: #cbd5e1;
          cursor: default;
        }

        .disclaimer {
          text-align: center;
          font-size: 0.73rem;
          color: #94a3b8;
          margin: 10px 0 2px;
          padding: 0 10px;
        }

        @media (max-width: 480px) {
          .chat-anchor { right: 14px; bottom: 14px; }
          .chat-window {
            /* Keep the tower shape on mobile — don't take the full screen. */
            width: min(340px, calc(100vw - 28px));
            height: min(520px, calc(100vh - 110px));
            right: 0;
          }
        }
      `}</style>
    </div>
  );
}
