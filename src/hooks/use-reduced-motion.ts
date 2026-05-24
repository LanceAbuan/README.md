/**
 * Hook to detect the user's prefers-reduced-motion setting.
 *
 * Returns true when the user has enabled reduced motion in their OS/browser.
 * Components should disable or simplify animations when this is true.
 */
import { useLayoutEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}
