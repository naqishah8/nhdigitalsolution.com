'use client';
import { useEffect, useRef } from 'react';

// Single purple→blue gradient family so the whole page feels like one palette
const SECTION_COLORS = [
  { r: 184, g: 121, b: 251 },  // purple
  { r: 167, g: 139, b: 250 },  // violet
  { r: 129, g: 140, b: 248 },  // indigo
  { r: 96, g: 165, b: 250 },   // blue
  { r: 129, g: 140, b: 248 },  // indigo
  { r: 167, g: 139, b: 250 },  // violet
  { r: 184, g: 121, b: 251 },  // purple
];

function lerpColor(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

export default function ScrollBackground() {
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on reduced-motion or low-powered touch devices to save CPU/battery
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      if (prefersReducedMotion || isCoarsePointer) return;
    }

    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 24000), 60);
    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 180;

    function initParticles() {
      particlesRef.current = [];
      const count = Math.min(Math.floor((width * height) / 24000), 60);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2,
        });
      }
    }

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = docHeight > 0 ? window.scrollY / docHeight : 0;
    };

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    function getCurrentColor(scroll) {
      const idx = scroll * (SECTION_COLORS.length - 1);
      const lower = Math.floor(idx);
      const upper = Math.min(lower + 1, SECTION_COLORS.length - 1);
      const t = idx - lower;
      return lerpColor(SECTION_COLORS[lower], SECTION_COLORS[upper], t);
    }

    function animate() {
      timeRef.current += 0.008;
      const t = timeRef.current;
      const scroll = scrollRef.current;
      const color = getCurrentColor(scroll);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle wave motion based on scroll
        const waveX = Math.sin(t + p.phase + scroll * 8) * 40;
        const waveY = Math.cos(t * 0.7 + p.phase + scroll * 6) * 30;

        // Scroll shifts the wave pattern vertically
        const scrollShift = scroll * height * 0.3;

        p.x = p.baseX + waveX + p.vx * t * 20;
        p.y = p.baseY + waveY + p.vy * t * 20 - scrollShift;

        // Wrap around edges
        if (p.x < -50) p.x += width + 100;
        if (p.x > width + 50) p.x -= width + 100;
        if (p.y < -50) p.y += height + 100;
        if (p.y > height + 50) p.y -= height + 100;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * 30;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
        glow.addColorStop(0, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.1)`);
        glow.addColorStop(1, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - p.size * 8, p.y - p.size * 8, p.size * 16, p.size * 16);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.4)`;
        ctx.fill();
      }

      // Draw mouse glow when cursor is on screen
      if (mx > 0 && my > 0) {
        const mouseGlow = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
        mouseGlow.addColorStop(0, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.06)`);
        mouseGlow.addColorStop(0.5, `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.02)`);
        mouseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(mx - MOUSE_RADIUS, my - MOUSE_RADIUS, MOUSE_RADIUS * 2, MOUSE_RADIUS * 2);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    handleScroll();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
