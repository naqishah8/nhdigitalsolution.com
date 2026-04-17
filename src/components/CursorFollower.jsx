'use client';
import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 20;
const SPRING = 0.45;
const FRICTION = 0.55;

export default function CursorFollower() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const pointsRef = useRef([]);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // Skip touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Initialize trail points
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      pointsRef.current.push({ x: -200, y: -200, vx: 0, vy: 0 });
    }

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      visibleRef.current = true;
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
    };

    // Track interactive element hover
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, input, textarea, select, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => { hoveringRef.current = true; });
        el.addEventListener('mouseleave', () => { hoveringRef.current = false; });
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hovering = hoveringRef.current;
      const points = pointsRef.current;

      // First point chases mouse with spring
      points[0].vx += (mx - points[0].x) * SPRING;
      points[0].vy += (my - points[0].y) * SPRING;
      points[0].vx *= FRICTION;
      points[0].vy *= FRICTION;
      points[0].x += points[0].vx;
      points[0].y += points[0].vy;

      // Each subsequent point chases the one before it
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const springForce = 0.35 - (i * 0.012);
        const frictionForce = 0.5 + (i * 0.015);

        curr.vx += (prev.x - curr.x) * springForce;
        curr.vy += (prev.y - curr.y) * springForce;
        curr.vx *= frictionForce;
        curr.vy *= frictionForce;
        curr.x += curr.vx;
        curr.y += curr.vy;
      }

      // Draw the trail as a tapered, fading line
      if (TRAIL_LENGTH > 1) {
        for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
          const a = points[i];
          const b = points[i + 1];
          const progress = i / TRAIL_LENGTH;
          const alpha = (1 - progress) * 0.4;
          const lineWidth = (1 - progress) * (hovering ? 4 : 2.5);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Draw trail dots with glow (fading)
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const p = points[i];
        const progress = i / TRAIL_LENGTH;
        const alpha = (1 - progress) * 0.6;
        const size = (1 - progress) * (hovering ? 5 : 3);

        if (size < 0.3) continue;

        // Soft glow
        const glowSize = size * 4;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glow.addColorStop(0, `rgba(168, 85, 247, ${alpha * 0.3})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - glowSize, p.y - glowSize, glowSize * 2, glowSize * 2);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fill();
      }

      // Head glow (larger, brighter when hovering)
      const headSize = hovering ? 30 : 18;
      const headGlow = ctx.createRadialGradient(points[0].x, points[0].y, 0, points[0].x, points[0].y, headSize);
      headGlow.addColorStop(0, `rgba(168, 85, 247, ${hovering ? 0.2 : 0.12})`);
      headGlow.addColorStop(0.5, `rgba(168, 85, 247, ${hovering ? 0.08 : 0.04})`);
      headGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, headSize, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
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
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
