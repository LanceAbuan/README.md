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

/** Thematic symbol floating in the background. */
type BackgroundSymbol = {
  x: number;
  y: number;
  char: string;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  driftPhase: number;
  driftSpeed: number;
  rotationSpeed: number;
  rotation: number;
};

/** Shape drawn for theme-specific particles. */
type ParticleShape = "circle" | "diamond" | "hex" | "square" | "star" | "chip";

const CONNECTION_DIST = 160;
const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 0.8;
const MAX_SYMBOLS = 15;

/** Theme-specific floating symbols. */
const THEME_SYMBOLS: Record<string, string[]> = {
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
    symbolColor: string;
    connection: string;
    connectionAlpha: number;
    particleColor: string;
    particleCore: string;
    glowRadius: number;
    particleShape: ParticleShape;
  }
> = {
  terminal: {
    symbolColor: "80,255,80",
    connection: "80,255,80",
    connectionAlpha: 0.2,
    particleColor: "80,255,80",
    particleCore: "160,255,160",
    glowRadius: 5,
    particleShape: "square",
  },
  newspaper: {
    symbolColor: "122,107,90",
    connection: "122,107,90",
    connectionAlpha: 0.06,
    particleColor: "122,107,90",
    particleCore: "92,46,14",
    glowRadius: 4,
    particleShape: "hex",
  },
  synthwave: {
    symbolColor: "255,0,255",
    connection: "0,255,255",
    connectionAlpha: 0.12,
    particleColor: "255,0,255",
    particleCore: "0,255,255",
    glowRadius: 6,
    particleShape: "diamond",
  },
  casino: {
    symbolColor: "212,168,67",
    connection: "196,30,30",
    connectionAlpha: 0.08,
    particleColor: "212,168,67",
    particleCore: "255,215,0",
    glowRadius: 5,
    particleShape: "star",
  },
  dark: {
    symbolColor: "200,200,220",
    connection: "120,120,130",
    connectionAlpha: 0.18,
    particleColor: "120,120,130",
    particleCore: "180,180,200",
    glowRadius: 5,
    particleShape: "circle",
  },
  light: {
    symbolColor: "40,40,60",
    connection: "60,60,70",
    connectionAlpha: 0.1,
    particleColor: "60,60,70",
    particleCore: "40,40,60",
    glowRadius: 4,
    particleShape: "circle",
  },
};

/** Draw a thematic background symbol (character-based). */
function drawBackgroundSymbol(
  ctx: CanvasRenderingContext2D,
  symbol: BackgroundSymbol,
  colorRGB: string,
) {
  ctx.save();
  ctx.translate(symbol.x, symbol.y);
  ctx.rotate(symbol.rotation);
  ctx.font = `${symbol.size}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgba(${colorRGB},${symbol.alpha})`;
  ctx.fillText(symbol.char, 0, 0);
  ctx.restore();
}

/** Draw a star shape (for casino particles). */
function drawStarShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.45;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Draw a diamond shape (for synthwave particles). */
function drawDiamondParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.6, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r * 0.6, y);
  ctx.closePath();
  ctx.fill();
}

/** Draw a hex shape (for newspaper particles). */
function drawHexParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Draw a square shape (for terminal particles). */
function drawSquareParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/** Draw the theme-appropriate particle shape. */
function drawParticleShape(
  ctx: CanvasRenderingContext2D,
  shape: ParticleShape,
  x: number,
  y: number,
  r: number,
) {
  switch (shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "diamond":
      drawDiamondParticle(ctx, x, y, r);
      break;
    case "hex":
      drawHexParticle(ctx, x, y, r);
      break;
    case "star":
      drawStarShape(ctx, x, y, r);
      break;
    case "square":
      drawSquareParticle(ctx, x, y, r);
      break;
    default:
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
  }
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
  const symbolsRef = useRef<BackgroundSymbol[]>([]);
  const animRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Stable ref accessible from both draw() and useEffect
  const BACKGROUND_SYMBOLS_REF = symbolsRef;

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

      /* ── Layer 1: Thematic floating symbols ── */
      BACKGROUND_SYMBOLS_REF.current.forEach((s) => {
        s.driftPhase += s.driftSpeed;
        const driftX = Math.sin(s.driftPhase) * 0.3;
        const driftY = Math.cos(s.driftPhase * 0.7) * 0.2;
        s.x += s.vx + driftX;
        s.y += s.vy + driftY;
        s.rotation += s.rotationSpeed;

        // Wrap
        if (s.x < -50) s.x = w + 50;
        if (s.x > w + 50) s.x = -50;
        if (s.y < -50) s.y = h + 50;
        if (s.y > h + 50) s.y = -50;

        drawBackgroundSymbol(ctx, s, tc.symbolColor);
      });

      /* ── Layer 2: Particles + connections ── */
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

      // Spatial hash grid for O(n) connection lookups
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

      // Draw particles with theme-specific shapes and glow
      for (const p of particles) {
        const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.12;
        const glowRadius = p.r * tc.glowRadius;

        // Glow halo
        const grad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, glowRadius,
        );
        grad.addColorStop(0, `rgba(${tc.particleColor},${pulseAlpha})`);
        grad.addColorStop(0.4, `rgba(${tc.particleColor},${pulseAlpha * 0.4})`);
        grad.addColorStop(1, `rgba(${tc.particleColor},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Solid core with theme shape
        ctx.fillStyle = `rgba(${tc.particleCore},${pulseAlpha * 0.8})`;
        drawParticleShape(ctx, tc.particleShape, p.x, p.y, p.r * 0.6);
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

    // Init particles
    const count = getParticleCount();
    const pw = window.innerWidth;
    const ph = window.innerHeight;
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

    // Init thematic background symbols
    const initSymbols = () => {
      const currentTheme = detectTheme();
      const chars = THEME_SYMBOLS[currentTheme] ?? THEME_SYMBOLS.dark;
      if (chars.length === 0) return;
      for (let i = 0; i < MAX_SYMBOLS; i++) {
        symbolsRef.current.push({
          x: Math.random() * pw,
          y: Math.random() * ph,
          char: chars[Math.floor(Math.random() * chars.length)],
          size: Math.random() * 14 + 10,
          alpha: 0.06 + Math.random() * 0.06,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.005 + Math.random() * 0.01,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    };
    initSymbols();

    // Reinit symbols on theme change
    let lastTheme = detectTheme();
    const handleThemeChange = () => {
      const newTheme = detectTheme();
      if (newTheme !== lastTheme) {
        lastTheme = newTheme;
        const chars = THEME_SYMBOLS[newTheme] ?? THEME_SYMBOLS.dark;
        symbolsRef.current = [];
        if (chars.length === 0) return;
        const cw = window.innerWidth;
        const ch = window.innerHeight;
        for (let i = 0; i < MAX_SYMBOLS; i++) {
          symbolsRef.current.push({
            x: Math.random() * cw,
            y: Math.random() * ch,
            char: chars[Math.floor(Math.random() * chars.length)],
            size: Math.random() * 14 + 10,
            alpha: 0.06 + Math.random() * 0.06,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.1,
            driftPhase: Math.random() * Math.PI * 2,
            driftSpeed: 0.005 + Math.random() * 0.01,
            rotationSpeed: (Math.random() - 0.5) * 0.003,
            rotation: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    const themeInterval = setInterval(handleThemeChange, 1000);

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
      symbolsRef.current = [];
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
