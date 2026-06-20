"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

/**
 * Pure-CSS synthwave background elements.
 * Renders retro sun, animated grid road, horizon glow,
 * twinkling stars, and distant cityscape silhouette.
 * Only visible when theme === "synthwave".
 * Skipped entirely when user prefers reduced motion.
 */
export function SynthwaveBackground() {
  const { theme } = useTheme();
  const reducedMotion = useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  if (theme !== "synthwave" || reducedMotion) return null;

  return (
    <>
      {/* Animated perspective grid road */}
      <div className="synthwave-grid" aria-hidden="true" />

      {/* Retro sunset horizon glow */}
      <div className="synthwave-horizon" aria-hidden="true" />

      {/* Retro setting sun with horizontal stripe cutout */}
      <div className="synthwave-sun" aria-hidden="true" />

      {/* Distant cityscape silhouette with neon windows */}
      <div className="synthwave-city" aria-hidden="true" />

      {/* Retro car driving toward viewer */}
      <div className="synthwave-car" aria-hidden="true">
        <div className="synthwave-car-tail-left" />
        <div className="synthwave-car-tail-right" />
      </div>

      {/* Twinkling star field */}
      <div className="synthwave-stars" aria-hidden="true" />
    </>
  );
}
