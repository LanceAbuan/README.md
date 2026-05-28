"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/** Particle (star) for the constellation animation. */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  pulse: number;
};

/** Thematic symbol that replaces particles for themed backgrounds. */
type ThemedParticle = {
  x: number;
  y: number;
  char: string;
  size: number;
  alpha: number;
  pulse: number;
  vx: number;
  vy: number;
  driftPhase: number;
  driftSpeed: number;
  rotationSpeed: number;
  rotation: number;
};

const CONNECTION_DIST = 160;
const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 0.8;

/** Theme-specific characters used as particles. */
const THEME_CHARS: Record<string, string[]> = {
  terminal: ["0", "1"],
  synthwave: ["★", "◆", "♪", "♫", "✦"],
  casino: ["♠", "♥", "♦", "♣", "$"],
  newspaper: ["§", "¶", "†", "‡", "—"],
  dark: [],
  light: [],
};

/**
 * Adaptive particle count based on screen width and DPR.
 */
function getParticleCount(): number {
  if (typeof window === "undefined") return 120;
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  if (width < 640 || dpr < 2) return 50;
  if (width < 1024) return 85;
  return 120;
}

/** Check if the user prefers reduced motion. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Determine which theme class is active on <html>.
 * Returns "terminal" | "newspaper" | "synthwave" | "casino" | "dark" | "light".
 */
function detectTheme(): string {
  if (typeof window === "undefined") return "dark";
  const html = document.documentElement;
  if (html.classList.contains("terminal")) return "terminal";
  if (html.classList.contains("newspaper")) return "newspaper";
  if (html.classList.contains("synthwave")) return "synthwave";
  if (html.classList.contains("casino")) return "casino";
  if (html.classList.contains("dark")) return "dark";
  return "light";
}

/** Theme-specific color palettes for canvas rendering. */
const THEME_COLORS: Record<
  string,
  {
    particleColor: string;
    particleGlow: string;
    connection: string;
    connectionAlpha: number;
    glowRadius: number;
  }
> = {
  terminal: {
    particleColor: "80,255,80",
    particleGlow: "160,255,160",
    connection: "80,255,80",
    connectionAlpha: 0.2,
    glowRadius: 12,
  },
  newspaper: {
    particleColor: "122,107,90",
    particleGlow: "92,46,14",
    connection: "122,107,90",
    connectionAlpha: 0.06,
    glowRadius: 10,
  },
  synthwave: {
    particleColor: "255,0,255",
    particleGlow: "0,255,255",
    connection: "0,255,255",
    connectionAlpha: 0.12,
    glowRadius: 16,
  },
  casino: {
    particleColor: "212,168,67",
    particleGlow: "255,215,0",
    connection: "196,30,30",
    connectionAlpha: 0.08,
    glowRadius: 12,
  },
  dark: {
    particleColor: "120,120,130",
    particleGlow: "180,180,200",
    connection: "120,120,130",
    connectionAlpha: 0.18,
    glowRadius: 5,
  },
  light: {
    particleColor: "60,60,70",
    particleGlow: "40,40,60",
    connection: "60,60,70",
    connectionAlpha: 0.1,
    glowRadius: 4,
  },
};

/** Draw a themed character particle with glow halo. */
function drawThemedParticle(
  ctx: CanvasRenderingContext2D,
  p: ThemedParticle,
  colorRGB: string,
  glowRGB: string,
  glowRadius: number,
) {
  const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.12;

  // Glow halo
  const grad = ctx.createRadialGradient(
    p.x, p.y, 0,
    p.x, p.y, glowRadius,
  );
  grad.addColorStop(0, `rgba(${glowRGB},${pulseAlpha})`);
  grad.addColorStop(0.4, `rgba(${glowRGB},${pulseAlpha * 0.4})`);
  grad.addColorStop(1, `rgba(${glowRGB},0)`);
  ctx.beginPath();
  ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Character
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.font = `bold ${p.size}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgba(${colorRGB},${Math.min(1, pulseAlpha * 1.2)})`;
  ctx.fillText(p.char, 0, 0);
  ctx.restore();
}

/** Draw a classic circle particle with glow (for dark/light themes). */
function drawCircleParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  colorRGB: string,
  glowRGB: string,
  glowRadius: number,
) {
  const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.12;

  // Glow halo
  const grad = ctx.createRadialGradient(
    p.x, p.y, 0,
    p.x, p.y, glowRadius,
  );
  grad.addColorStop(0, `rgba(${glowRGB},${pulseAlpha})`);
  grad.addColorStop(0.4, `rgba(${glowRGB},${pulseAlpha * 0.4})`);
  grad.addColorStop(1, `rgba(${glowRGB},0)`);
  ctx.beginPath();
  ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Solid core
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${colorRGB},${pulseAlpha * 0.8})`;
  ctx.fill();
}

/**
 * Animated background with particles, connections, and fractal shapes.
 *
 * Theme-aware: detects current theme via <html> class and adjusts:
 * - Particle colors and shapes
 * - Connection line colors and opacity
 * - Fractal colors
 * - Glow intensity
 *
 * Optimizations:
 * - Respects prefers-reduced-motion (static gradient fallback)
 * - Adaptive particle count for mobile / low-DPR
 * - Pauses animation when tab is hidden
 * - Spatial hash grid for O(n) connection lookups instead of O(n²)
 * - CSS containment for better compositing
 * - Lazy mount: canvas only mounts after hydration to avoid SSR mismatch
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const themedRef = useRef<ThemedParticle[]>([]);
  const animRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const THEME_CHARS_REF = THEME_CHARS;

  const draw = useCallback(
    (_timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const theme = detectTheme();
      const tc = THEME_COLORS[theme] ?? THEME_COLORS.dark;

      // Use themed characters when available, otherwise classic particles
      const hasTheme = (THEME_CHARS_REF[theme] ?? []).length > 0;

      if (hasTheme) {
        /* ── Themed character particles ── */
        const particles = themedRef.current;

        // Update positions
        for (const p of particles) {
          p.pulse += 0.02;
          p.driftPhase += p.driftSpeed;
          const driftX = Math.sin(p.driftPhase) * 0.3;
          const driftY = Math.cos(p.driftPhase * 0.7) * 0.2;

          // Mouse repulsion
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < MOUSE_RADIUS) {
            const force = ((MOUSE_RADIUS - mDist) / MOUSE_RADIUS) * MOUSE_FORCE;
            p.vx += (mdx / mDist) * force;
            p.vy += (mdy / mDist) * force;
          }

          p.x += p.vx + driftX;
          p.y += p.vy + driftY;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.rotation += p.rotationSpeed;

          // Wrap
          if (p.x < -30) p.x = w + 30;
          if (p.x > w + 30) p.x = -30;
          if (p.y < -30) p.y = h + 30;
          if (p.y > h + 30) p.y = -30;
        }

        // Draw connections (spatial hash)
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

        const checked = new Set<string>();
        for (const [key, indices] of grid) {
          const [cx, cy] = key.split(",").map(Number);
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const nKey = `${cx + dx},${cy + dy}`;
              const neighborCell = grid.get(nKey);
              if (!neighborCell) continue;
              for (const i of indices) {
                for (const j of neighborCell) {
                  if (i >= j) continue;
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
                    ctx.strokeStyle = `rgba(${tc.connection},${tc.connectionAlpha * (1 - dist / CONNECTION_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }

        // Draw themed character particles
        for (const p of particles) {
          drawThemedParticle(ctx, p, tc.particleColor, tc.particleGlow, tc.glowRadius);
        }
      } else {
        /* ── Classic circle particles ── */
        const particles = particlesRef.current;

        // Update positions
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

          // Wrap
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        // Draw connections (spatial hash)
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

        const checked = new Set<string>();
        for (const [key, indices] of grid) {
          const [cx, cy] = key.split(",").map(Number);
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const nKey = `${cx + dx},${cy + dy}`;
              const neighborCell = grid.get(nKey);
              if (!neighborCell) continue;
              for (const i of indices) {
                for (const j of neighborCell) {
                  if (i >= j) continue;
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
                    ctx.strokeStyle = `rgba(${tc.connection},${tc.connectionAlpha * (1 - dist / CONNECTION_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }

        // Draw classic circle particles
        for (const p of particles) {
          drawCircleParticle(ctx, p, tc.particleColor, tc.particleGlow, tc.glowRadius);
        }
      }

      if (isRunningRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    },
    [],
  );

  /* ── Mount canvas after hydration to avoid SSR mismatch ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
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

    // Init particles based on theme
    const count = getParticleCount();
    const pw = window.innerWidth;
    const ph = window.innerHeight;
    const currentTheme = detectTheme();
    const chars = THEME_CHARS_REF[currentTheme] ?? [];

    if (chars.length > 0) {
      // Themed character particles
      for (let i = 0; i < count; i++) {
        themedRef.current.push({
          x: Math.random() * pw,
          y: Math.random() * ph,
          char: chars[Math.floor(Math.random() * chars.length)],
          size: Math.random() * 8 + 20,
          alpha: Math.random() * 0.3 + 0.5,
          pulse: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.005 + Math.random() * 0.01,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    } else {
      // Classic circle particles
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * pw,
          y: Math.random() * ph,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.4 + 0.45,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    // Reinit on theme change
    let lastTheme = currentTheme;
    const rebuildParticles = () => {
      const newTheme = detectTheme();
      if (newTheme !== lastTheme) {
        lastTheme = newTheme;
        const newChars = THEME_CHARS_REF[newTheme] ?? [];
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        themedRef.current = [];
        particlesRef.current = [];

        if (newChars.length > 0) {
          for (let i = 0; i < count; i++) {
            themedRef.current.push({
              x: Math.random() * cw,
              y: Math.random() * ch,
              char: newChars[Math.floor(Math.random() * newChars.length)],
              size: Math.random() * 8 + 20,
              alpha: Math.random() * 0.3 + 0.5,
              pulse: Math.random() * Math.PI * 2,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              driftPhase: Math.random() * Math.PI * 2,
              driftSpeed: 0.005 + Math.random() * 0.01,
              rotationSpeed: (Math.random() - 0.5) * 0.003,
              rotation: Math.random() * Math.PI * 2,
            });
          }
        } else {
          for (let i = 0; i < count; i++) {
            particlesRef.current.push({
              x: Math.random() * cw,
              y: Math.random() * ch,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              r: Math.random() * 2.2 + 0.8,
              alpha: Math.random() * 0.4 + 0.45,
              pulse: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };
    const themeInterval = setInterval(rebuildParticles, 1000);

    // Pause/resume on tab visibility change
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
      clearInterval(themeInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      // Clear refs
      particlesRef.current = [];
      themedRef.current = [];
    };
  }, [mounted, draw]);

  /* ── SSR / pre-mount: render nothing to avoid hydration mismatch ── */
  if (!mounted) {
    return null;
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
