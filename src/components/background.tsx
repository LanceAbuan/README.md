"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  alpha: number;
  pulse: number;
};

type Fractal = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: number;
  alpha: number;
  vx: number;
  vy: number;
};

const CONNECTION_DIST = 160;
const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 0.8;

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const fractalsRef = useRef<Fractal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMove);

    // Init particles
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 70; i++) {
      particlesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.5,
        hue: Math.random() > 0.5 ? 25 + Math.random() * 20 : 200 + Math.random() * 30,
        alpha: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Init fractals
    for (let i = 0; i < 5; i++) {
      fractalsRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 40 + 25,
        rotation: Math.random() * Math.PI * 2,
        type: Math.floor(Math.random() * 3),
        alpha: 0.04 + Math.random() * 0.03,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    // Draw a Sierpinski triangle
    function drawSierpinski(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      depth: number,
    ) {
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.closePath();
        ctx.fill();
        return;
      }
      const half = size / 2;
      drawSierpinski(ctx, x, y - half / 2, half, depth - 1);
      drawSierpinski(ctx, x - half / 2, y + half / 2, half, depth - 1);
      drawSierpinski(ctx, x + half / 2, y + half / 2, half, depth - 1);
    }

    // Draw nested hexagon
    function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      for (let layer = 3; layer >= 1; layer--) {
        const r = size * (layer / 3);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + r * Math.cos(angle);
          const py = y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Draw diamond
    function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.save();
      ctx.translate(x, y);
      for (let layer = 3; layer >= 1; layer--) {
        const s = size * (layer / 3);
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      const cw = w;
      const ch = h;
      ctx.clearRect(0, 0, cw, ch);

      const isDark = document.documentElement.classList.contains("dark");
      const baseAlpha = isDark ? 0.12 : 0.06;

      // Layer 1: Fractals
      ctx.save();
      ctx.globalAlpha = 1;
      fractalsRef.current.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        f.rotation += 0.001;
        if (f.x < -100) f.x = cw + 100;
        if (f.x > cw + 100) f.x = -100;
        if (f.y < -100) f.y = ch + 100;
        if (f.y > ch + 100) f.y = -100;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.strokeStyle = isDark
          ? `rgba(200,200,220,${f.alpha})`
          : `rgba(40,40,60,${f.alpha})`;
        ctx.fillStyle = isDark
          ? `rgba(180,180,200,${f.alpha * 0.3})`
          : `rgba(30,30,50,${f.alpha * 0.3})`;
        ctx.lineWidth = 0.5;

        if (f.type === 0) drawSierpinski(ctx, 0, 0, f.size, 3);
        else if (f.type === 1) drawHexagon(ctx, 0, 0, f.size);
        else drawDiamond(ctx, 0, 0, f.size);

        ctx.restore();
      });
      ctx.restore();

      // Layer 2: Particles + connections
      const particles = particlesRef.current;
      for (const p of particles) {
        // Pulse
        p.pulse += 0.02;

        // Mouse repulsion
        const mdx = p.x - mouseRef.current.x;
        const mdy = p.y - mouseRef.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - mDist) / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap
        if (p.x < -20) p.x = cw + 20;
        if (p.x > cw + 20) p.x = -20;
        if (p.y < -20) p.y = ch + 20;
        if (p.y > ch + 20) p.y = -20;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.hue},${p.hue},${p.hue + 10},${baseAlpha * (1 - dist / CONNECTION_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.08;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `rgba(${p.hue},${p.hue},${p.hue + 10},${pulseAlpha})`);
        grad.addColorStop(1, `rgba(${p.hue},${p.hue},${p.hue + 10},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
