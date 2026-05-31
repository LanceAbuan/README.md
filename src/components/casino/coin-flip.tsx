"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * ============================================================
 * COIN FLIP NAVIGATION
 * ============================================================
 *
 * Casino theme gimmick: wrapping a nav link in this component
 * triggers a coin-flip animation before navigation.
 *
 *   Heads (50%) → Navigate normally
 *   Tails (50%) → Show "Better luck next time" overlay
 *
 * Usage:
 *   <CoinFlipNav href="/about" sectionId="about">
 *     <NavLink>About</NavLink>
 *   </CoinFlipNav>
 *
 * For smooth-scroll anchors, use `sectionId`.
 * For regular links, use `href`.
 * ============================================================
 */

interface CoinFlipNavProps {
  /** Regular URL for anchor-based nav */
  href?: string;
  /** Section ID to smooth-scroll to */
  sectionId?: string;
  /** Children (the actual nav link element) */
  children: React.ReactNode;
}

export function CoinFlipNav({ href, sectionId, children }: CoinFlipNavProps) {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimer = useRef<number | undefined>(undefined);

  const triggerFlip = useCallback(
    (e: React.MouseEvent) => {
      if (flipping) return;
      e.preventDefault();
      e.stopPropagation();

      setFlipping(true);
      setResult(null);
      setShowOverlay(false);

      // Coin flip duration
      const duration = 1500;
      const isHeads = Math.random() < 0.5;

      // Determine result mid-animation
      setTimeout(() => {
        setResult(isHeads ? "heads" : "tails");
      }, duration * 0.7);

      // Resolve after animation
      setTimeout(() => {
        setFlipping(false);

        if (isHeads) {
          // Heads — navigate
          if (sectionId) {
            document.getElementById(sectionId)?.scrollIntoView({
              behavior: "smooth",
            });
          } else if (href) {
            window.location.hash = href;
          }
        } else {
          // Tails — show overlay
          setShowOverlay(true);
          if (overlayTimer.current) clearTimeout(overlayTimer.current);
          overlayTimer.current = setTimeout(() => {
            setShowOverlay(false);
            setResult(null);
          }, 2500);
        }
      }, duration);
    },
    [flipping, href, sectionId],
  );

  useEffect(() => {
    return () => {
      if (overlayTimer.current) clearTimeout(overlayTimer.current);
    };
  }, []);

  return (
    <>
      {/* Click target wraps the child */}
      <div onClick={triggerFlip} className="cursor-pointer">
        {children}
      </div>

      {/* Coin flip animation overlay */}
      {flipping && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            {/* Spinning coin */}
            <div
              className="w-24 h-24 rounded-full border-4 border-[#d4a843] flex items-center justify-center text-4xl font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #c41e1e 0%, #d4a843 50%, #c41e1e 100%)",
                animation: "casino-coin-flip 1.5s ease-out",
                boxShadow: "0 0 30px rgba(212, 168, 67, 0.4)",
              }}
            >
              <span className="text-[#1a0a0a]">?</span>
            </div>
            <p className="text-[#d4a843] font-serif text-lg tracking-wider animate-pulse">
              Flipping...
            </p>
          </div>
        </div>
      )}

      {/* Result display */}
      {!flipping && result && !showOverlay && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-24 h-24 rounded-full border-4 border-[#d4a843] flex items-center justify-center text-4xl font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #d4a843 0%, #ffd700 50%, #d4a843 100%)",
                boxShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
              }}
            >
              <span className="text-[#1a0a0a]">👑</span>
            </div>
            <p className="text-[#ffd700] font-serif text-2xl tracking-wider">
              Heads!
            </p>
          </div>
        </div>
      )}

      {/* Tails overlay */}
      {showOverlay && result === "tails" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div
              className="w-24 h-24 rounded-full border-4 border-[#c41e1e] flex items-center justify-center text-4xl"
              style={{
                background:
                  "linear-gradient(135deg, #1a0a0a 0%, #c41e1e 100%)",
                boxShadow: "0 0 30px rgba(196, 30, 30, 0.4)",
              }}
            >
              🔻
            </div>
            <p className="text-[#c41e1e] font-serif text-2xl tracking-wider">
              Tails
            </p>
            <p className="text-[#8b7355] font-serif text-sm italic">
              Better luck next time...
            </p>
          </div>
        </div>
      )}

      {/* Inline coin flip keyframes — injected once */}
      <style>{`
        @keyframes casino-coin-flip {
          0% { transform: rotateY(0deg) scale(0.5); opacity: 0; }
          20% { transform: rotateY(360deg) scale(1.2); opacity: 1; }
          40% { transform: rotateY(720deg) scale(0.9); }
          60% { transform: rotateY(1080deg) scale(1.1); }
          80% { transform: rotateY(1440deg) scale(1.0); }
          100% { transform: rotateY(1800deg) scale(1.0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
