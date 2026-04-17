'use client';
import { useEffect, useRef } from 'react';

/**
 * Service-specific background visual systems.
 * Design rules:
 *   - Slow motion  (low velocity, slow rotation)
 *   - Low opacity  (0.06 – 0.14 max)
 *   - Mouse parallax — elements drift with pointer, never aggressively repel
 *   - Never distract from foreground content
 */
const CONFIG = {
  'web-development': {
    tokens: ['</>', '{}', '( )', '[]', '//', '0', '1', '0', '1', 'const', '=>'],
    tint: [184, 121, 251],
    kind: 'code',
  },
  'graphic-design': {
    shapes: ['curve', 'circle', 'cursor', 'grid', 'dot', 'square'],
    tint: [96, 165, 250],
    kind: 'design',
  },
  'seo-optimization': {
    shapes: ['chart', 'search', 'hash', 'arrow', 'target'],
    tokens: ['#1', '↑', '+42%'],
    tint: [129, 140, 248],
    kind: 'seo',
  },
  'social-media-marketing': {
    shapes: ['heart', 'chat', 'repost', 'at', 'notif'],
    tint: [244, 114, 182],
    kind: 'social',
  },
  'app-development': {
    shapes: ['phone', 'card', 'ripple', 'dot'],
    tint: [96, 165, 250],
    kind: 'app',
  },
  'logistics': {
    shapes: ['box', 'route', 'pin', 'arrow'],
    tint: [192, 132, 252],
    kind: 'logistics',
  },
};

export default function ServiceBackground({ slug }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  // Smoothed mouse position (follows cursor with easing for parallax)
  const mouseRef = useRef({ tx: 0, ty: 0, x: 0, y: 0 });

  const config = CONFIG[slug] || CONFIG['web-development'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    // ~25% denser than previous pass while still staying low-key
    const particleCount = isCoarse ? 20 : Math.min(Math.floor((width * height) / 22000), 38);

    function pickShape() {
      if (config.shapes) return config.shapes[Math.floor(Math.random() * config.shapes.length)];
      return null;
    }

    function pickToken() {
      if (config.tokens) return config.tokens[Math.floor(Math.random() * config.tokens.length)];
      return null;
    }

    function initParticles() {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const useToken = config.tokens && (!config.shapes || Math.random() < 0.5);
        particlesRef.current.push({
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          x: 0,
          y: 0,
          // very slow drift
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          size: Math.random() * 10 + 14,
          // parallax depth — deeper particles move less with cursor
          depth: Math.random() * 0.7 + 0.15,
          glyph: useToken ? pickToken() : pickShape(),
          isToken: !!useToken,
          // slightly brighter than last pass so the motif reads more clearly
          alpha: Math.random() * 0.08 + 0.08,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Normalized cursor offset from center, range roughly [-1, 1]
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.tx = nx;
      mouseRef.current.ty = ny;
    };
    const handleMouseLeave = () => {
      mouseRef.current.tx = 0;
      mouseRef.current.ty = 0;
    };

    const tint = config.tint;
    const MAX_PARALLAX = 32; // px at full deflection

    function drawToken(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * 0.15);
      ctx.font = `500 ${p.size}px "JetBrains Mono", "Fira Code", ui-monospace, monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${p.alpha})`;
      ctx.fillText(p.glyph, 0, 0);
      ctx.restore();
    }

    function drawShape(p) {
      const [r, g, b] = tint;
      const a = p.alpha;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * 0.2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a * 1.4})`;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.lineWidth = 1.2;
      const s = p.size * 0.5;

      switch (p.glyph) {
        // Design
        case 'curve': {
          ctx.beginPath();
          ctx.moveTo(-s, s);
          ctx.bezierCurveTo(-s * 0.3, -s, s * 0.3, s, s, -s);
          ctx.stroke();
          break;
        }
        case 'circle': {
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case 'cursor': {
          ctx.beginPath();
          ctx.moveTo(-s * 0.5, -s * 0.6);
          ctx.lineTo(-s * 0.5, s * 0.6);
          ctx.lineTo(-s * 0.1, s * 0.25);
          ctx.lineTo(s * 0.4, s * 0.5);
          ctx.closePath();
          ctx.stroke();
          break;
        }
        case 'grid': {
          for (let gx = -s; gx <= s; gx += s / 2) {
            ctx.beginPath();
            ctx.moveTo(gx, -s); ctx.lineTo(gx, s);
            ctx.stroke();
          }
          for (let gy = -s; gy <= s; gy += s / 2) {
            ctx.beginPath();
            ctx.moveTo(-s, gy); ctx.lineTo(s, gy);
            ctx.stroke();
          }
          break;
        }
        case 'dot': {
          ctx.beginPath();
          ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'square': {
          ctx.strokeRect(-s * 0.8, -s * 0.8, s * 1.6, s * 1.6);
          break;
        }

        // SEO
        case 'chart': {
          ctx.beginPath();
          ctx.moveTo(-s, s * 0.6);
          ctx.lineTo(-s * 0.3, 0);
          ctx.lineTo(s * 0.2, s * 0.3);
          ctx.lineTo(s, -s * 0.6);
          ctx.stroke();
          // arrowhead
          ctx.beginPath();
          ctx.moveTo(s, -s * 0.6);
          ctx.lineTo(s * 0.7, -s * 0.35);
          ctx.moveTo(s, -s * 0.6);
          ctx.lineTo(s * 0.65, -s * 0.75);
          ctx.stroke();
          break;
        }
        case 'search': {
          ctx.beginPath();
          ctx.arc(-s * 0.2, -s * 0.2, s * 0.55, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s * 0.2, s * 0.2);
          ctx.lineTo(s * 0.8, s * 0.8);
          ctx.stroke();
          break;
        }
        case 'hash': {
          ctx.font = `600 ${p.size * 1.1}px "JetBrains Mono", ui-monospace, monospace`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText('#', 0, 0);
          break;
        }
        case 'arrow': {
          ctx.beginPath();
          ctx.moveTo(-s, s * 0.4);
          ctx.lineTo(s * 0.2, -s * 0.4);
          ctx.moveTo(s * 0.2, -s * 0.4);
          ctx.lineTo(-s * 0.1, -s * 0.4);
          ctx.moveTo(s * 0.2, -s * 0.4);
          ctx.lineTo(s * 0.2, -s * 0.1);
          ctx.stroke();
          break;
        }
        case 'target': {
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, (s * 0.3) * i, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        }

        // Social
        case 'heart': {
          const h = s * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, h * 0.6);
          ctx.bezierCurveTo(-h * 1.3, -h * 0.2, -h * 0.5, -h * 1, 0, -h * 0.3);
          ctx.bezierCurveTo(h * 0.5, -h * 1, h * 1.3, -h * 0.2, 0, h * 0.6);
          ctx.stroke();
          break;
        }
        case 'chat': {
          const w = s * 1.2, h = s * 0.8;
          ctx.beginPath();
          ctx.moveTo(-w * 0.5 + 4, -h * 0.5);
          ctx.lineTo(w * 0.5 - 4, -h * 0.5);
          ctx.quadraticCurveTo(w * 0.5, -h * 0.5, w * 0.5, -h * 0.5 + 4);
          ctx.lineTo(w * 0.5, h * 0.5 - 4);
          ctx.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.5 - 4, h * 0.5);
          ctx.lineTo(-w * 0.2, h * 0.5);
          ctx.lineTo(-w * 0.35, h * 0.5 + 6);
          ctx.lineTo(-w * 0.3, h * 0.5);
          ctx.lineTo(-w * 0.5 + 4, h * 0.5);
          ctx.quadraticCurveTo(-w * 0.5, h * 0.5, -w * 0.5, h * 0.5 - 4);
          ctx.lineTo(-w * 0.5, -h * 0.5 + 4);
          ctx.quadraticCurveTo(-w * 0.5, -h * 0.5, -w * 0.5 + 4, -h * 0.5);
          ctx.closePath();
          ctx.stroke();
          break;
        }
        case 'repost': {
          // two curved arrows
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.55, Math.PI * 0.2, Math.PI * 0.8);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.55, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
          break;
        }
        case 'at': {
          ctx.font = `400 ${p.size * 1.3}px "Inter", system-ui`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText('@', 0, 0);
          break;
        }
        case 'notif': {
          ctx.beginPath();
          ctx.arc(-s * 0.4, -s * 0.4, s * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeRect(-s * 0.7, -s * 0.1, s * 1.4, s * 0.7);
          break;
        }

        // App dev
        case 'phone': {
          const w = s * 0.75, h = s * 1.25;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
          ctx.beginPath();
          ctx.moveTo(-w * 0.25, -h * 0.42);
          ctx.lineTo(w * 0.25, -h * 0.42);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, h * 0.42, 2, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case 'card': {
          ctx.strokeRect(-s, -s * 0.6, s * 2, s * 1.2);
          ctx.beginPath();
          ctx.moveTo(-s * 0.7, -s * 0.2);
          ctx.lineTo(s * 0.3, -s * 0.2);
          ctx.moveTo(-s * 0.7, s * 0.1);
          ctx.lineTo(s * 0.1, s * 0.1);
          ctx.stroke();
          break;
        }
        case 'ripple': {
          for (let i = 1; i <= 3; i++) {
            ctx.globalAlpha = a * (1 - i * 0.25);
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.3 * i, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          break;
        }

        // Logistics
        case 'box': {
          const bs = s * 0.9;
          ctx.strokeRect(-bs * 0.5, -bs * 0.5, bs, bs);
          // flaps
          ctx.beginPath();
          ctx.moveTo(-bs * 0.5, 0);
          ctx.lineTo(bs * 0.5, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -bs * 0.5);
          ctx.lineTo(0, 0);
          ctx.stroke();
          break;
        }
        case 'route': {
          ctx.beginPath();
          ctx.moveTo(-s, s * 0.4);
          ctx.bezierCurveTo(-s * 0.3, -s, s * 0.3, s, s, -s * 0.4);
          ctx.stroke();
          // endpoints
          ctx.beginPath();
          ctx.arc(-s, s * 0.4, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(s, -s * 0.4, 2.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'pin': {
          ctx.beginPath();
          ctx.arc(0, -s * 0.2, s * 0.4, Math.PI, 0);
          ctx.lineTo(0, s * 0.5);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -s * 0.2, s * 0.15, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        default:
          break;
      }
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        // slow drift away from base position
        p.baseX += p.vx;
        p.baseY += p.vy;

        // wrap
        if (p.baseX < -40) p.baseX = width + 40;
        if (p.baseX > width + 40) p.baseX = -40;
        if (p.baseY < -40) p.baseY = height + 40;
        if (p.baseY > height + 40) p.baseY = -40;

        // parallax offset
        p.x = p.baseX + mx * MAX_PARALLAX * p.depth;
        p.y = p.baseY + my * MAX_PARALLAX * p.depth;

        p.rot += p.rotSpeed;

        if (p.isToken) drawToken(p);
        else drawShape(p);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [slug, config]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
