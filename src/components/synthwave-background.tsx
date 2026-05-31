"use client";

import { useTheme } from "next-themes";

/**
 * Pure-CSS synthwave background elements.
 * Renders retro sun, animated grid road, horizon glow,
 * twinkling stars, and distant cityscape silhouette.
 * Only visible when theme === "synthwave".
 */
export function SynthwaveBackground() {
  const { theme } = useTheme();

  if (theme !== "synthwave") return null;

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

      {/* Twinkling star field */}
      <div className="synthwave-stars" aria-hidden="true" />
    </>
  );
}
