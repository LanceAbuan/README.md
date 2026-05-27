"use client";

import { useEffect, useRef, useCallback } from "react";

/** Particle for the constellation animation. */
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

/** Fractal shape floating in the background. */
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

/**
 * Determine optimal particle count based on screen size and DPR.
 * Lower-end devices get fewer particles to preserve battery and frame rate.
 */
function getParticleCount(): number {
  if (typeof window === "undefined") return 70;
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  if (width < 640 || dpr < 2) return 25;
  if (width < 1024) return 45;
  return 70;
}

/**
 * Check if the user prefers reduced motion.
 * When true, we skip the animation entirely and render a static gradient fallback.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Draw a Sierpinski triangle fractal (recursive, depth-limited).
 */
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

/** Draw nested hexagon fractal. */
function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  for (let layer = 3; layer >= 1; layer--) {
    const r = size * (layer / 3);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

/** Draw diamond fractal. */
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

/**
 * Animated background with particles, connections, and fractal shapes.
 *
 * Optimizations vs original:
 * - Respects `prefers-reduced-motion` (static gradient fallback)
 * - Adapts particle count for mobile / low-DPR devices
 * - Pauses animation when tab is hidden (saves battery)
 * - Uses spatial hash grid for O(n) connection lookups instead of O(n²)
 * - CSS containment for better browser compositing
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const fractalsRef = useRef<Fractal[]>([]);
  const animRef = useRef<number>(0);
  const isRunningRef = useRef(true);

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains("dark");
      const baseAlpha = isDark ? 0.12 : 0.06;

      // Layer 1: Fractals
      ctx.save();
      ctx.globalAlpha = 1;
      fractalsRef.current.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        f.rotation += 0.001;
        if (f.x < -100) f.x = w + 100;
        if (f.x > w + 100) f.x = -100;
        if (f.y < -100) f.y = h + 100;
        if (f.y > h + 100) f.y = -100;

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

      // Update particle positions
      for (const p of particles) {
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

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Spatial hash for O(n) connection lookups
      const cellSize = CONNECTION_DIST;
      const grid = new Map<string, number[]>();
      for (let i = 0; i < particles.length; i++) {
        const cx = Math.floor(particles[i].x / cellSize);
        const cy = Math.floor(particles[i].y / cellSize);
        const key = `${cx},${cy}`;
        const cell = grid.get(key);
        if (cell) cell.push(i);
        else grid.set(key, [i]);
      }

      // Draw connections using spatial grid
      const checked = new Set<string>();
      for (const [key, indices] of grid) {
        const [cx, cy] = key.split(",").map(Number);
        // Check this cell and 8 neighbors
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nKey = `${cx + dx},${cy + dy}`;
            const neighborCell = grid.get(nKey);
            if (!neighborCell) continue;

            for (const i of indices) {
              for (const j of neighborCell) {
                if (i >= j) continue; // avoid duplicates
                const pairKey = `${i}-${j}`;
                if (checked.has(pairKey)) continue;
                checked.add(pairKey);

                const p = particles[i];
                const p2 = particles[j];
                const ddx = p.x - p2.x;
                const ddy = p.y - p2.y;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);
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

      if (isRunningRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    },
    [],
  );

  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

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

    // Init particles with adaptive count
    const count = getParticleCount();
    const pw = window.innerWidth;
    const ph = window.innerHeight;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * pw,
        y: Math.random() * ph,
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
        x: Math.random() * pw,
        y: Math.random() * ph,
        size: Math.random() * 40 + 25,
        rotation: Math.random() * Math.PI * 2,
        type: Math.floor(Math.random() * 3),
        alpha: 0.04 + Math.random() * 0.03,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    // Pause/resume animation when tab visibility changes
    const handleVisibility = () => {
      if (document.hidden) {
        isRunningRef.current = false;
        cancelAnimationFrame(animRef.current);
      } else {
        isRunningRef.current = true;
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Start animation loop
    isRunningRef.current = true;
    animRef.current = requestAnimationFrame(draw);

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [draw]);

  // Render static gradient fallback when reduced-motion is preferred
  if (typeof window !== "undefined" && prefersReducedMotion()) {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        contain: "strict",
      }}
      aria-hidden="true"
    />
  );
}
