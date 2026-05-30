"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Game = "slots" | "coinflip" | "roulette";

const SLOT_SYMBOLS = ["♠", "♥", "♦", "♣"];
const COIN_SIDES = ["HEADS", "TAILS"];
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─── Slot Machine ─── */
function SlotMachine() {
  const [reels, setReels] = useState(["♠", "♥", "♦"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const finals = [pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS)];
    let tick = 0;
    const iv = setInterval(() => {
      tick++;
      setReels(prev => {
        const next = [...prev];
        for (let r = 0; r < 3; r++) {
          if (tick < 15 + r * 10) {
            next[r] = pick(SLOT_SYMBOLS);
          } else if (next[r] === prev[r] && tick === 15 + r * 10) {
            next[r] = finals[r];
          } else if (tick >= 15 + r * 10) {
            next[r] = finals[r];
          }
        }
        return next;
      });

      if (tick >= 35) {
        clearInterval(iv);
        setSpinning(false);
        const allSame = finals[0] === finals[1] && finals[1] === finals[2];
        const twoSame = finals[0] === finals[1] || finals[1] === finals[2] || finals[0] === finals[2];
        if (allSame) {
          setResult("JACKPOT — THREE OF A KIND!");
          setScore(s => ({ ...s, wins: s.wins + 1 }));
        } else if (twoSame) {
          setResult("Nice — two match!");
          setScore(s => ({ ...s, wins: s.wins + 1 }));
        } else {
          setResult("No luck. Try again.");
          setScore(s => ({ ...s, losses: s.losses + 1 }));
        }
      }
    }, 60);
  }, [spinning]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {reels.map((sym, i) => (
          <div
            key={i}
            className="w-16 h-16 flex items-center justify-center text-3xl
              border border-[#d4af3715] bg-[#1a0606] rounded-sm"
          >
            {sym}
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="casino-btn w-full py-2.5"
      >
        {spinning ? "SPINNING..." : "PULL LEVER"}
      </button>
      {result && (
        <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>
      )}
      <div className="flex justify-center gap-4 text-xs text-[#6b5e50] font-serif">
        <span>Wins: {score.wins}</span>
        <span>Losses: {score.losses}</span>
      </div>
    </div>
  );
}

/* ─── Coin Flip ─── */
function CoinFlip() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [display, setDisplay] = useState("HEADS");

  const flip = useCallback(() => {
    if (flipping || !prediction) return;
    setFlipping(true);
    setResult(null);

    const actual = pick(COIN_SIDES);
    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      setDisplay(ticks % 2 === 0 ? "HEADS" : "TAILS");
      if (ticks >= 12) {
        clearInterval(iv);
        setDisplay(actual);
        setFlipping(false);
        const won = prediction === actual;
        setResult(`${actual} — ${won ? "You called it!" : "Wrong call."}`);
        setScore(s => won ? { ...s, wins: s.wins + 1 } : { ...s, losses: s.losses + 1 });
      }
    }, 100);
  }, [flipping, prediction]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl mb-2">🪙</div>
        <div className="text-lg font-serif text-white">{display}</div>
      </div>
      <div className="flex gap-2">
        {COIN_SIDES.map(side => (
          <button
            key={side}
            onClick={() => !flipping && setPrediction(side)}
            disabled={flipping}
            className={`flex-1 py-2 text-xs font-serif uppercase tracking-wider border rounded-sm transition-colors
              ${prediction === side
                ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]"
                : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"
              }`}
          >
            {side}
          </button>
        ))}
      </div>
      <button
        onClick={flip}
        disabled={flipping || !prediction}
        className="casino-btn w-full py-2.5"
      >
        {flipping ? "FLIPPING..." : "FLIP COIN"}
      </button>
      {result && (
        <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>
      )}
      <div className="flex justify-center gap-4 text-xs text-[#6b5e50] font-serif">
        <span>Wins: {score.wins}</span>
        <span>Losses: {score.losses}</span>
      </div>
    </div>
  );
}

/* ─── Roulette ─── */
function Roulette() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [display, setDisplay] = useState("—");

  const betOptions = ["RED", "BLACK", "GREEN", "ODD", "EVEN"];

  const spin = useCallback(() => {
    if (spinning || !prediction) return;
    setSpinning(true);
    setResult(null);

    const actualNum = pick(ROULETTE_NUMBERS);
    const isRed = RED_NUMBERS.includes(actualNum);
    const isGreen = actualNum === 0;
    const color = isGreen ? "GREEN" : isRed ? "RED" : "BLACK";

    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      setDisplay(`${pick(ROULETTE_NUMBERS)}`);
      if (ticks >= 20) {
        clearInterval(iv);
        setDisplay(`${actualNum} (${color})`);
        setSpinning(false);

        let won = false;
        if (prediction === "RED" && isRed) won = true;
        if (prediction === "BLACK" && !isRed && !isGreen) won = true;
        if (prediction === "GREEN" && isGreen) won = true;
        if (prediction === "ODD" && actualNum % 2 !== 0) won = true;
        if (prediction === "EVEN" && actualNum % 2 === 0) won = true;

        setResult(`${actualNum} — ${color} ${won ? "• You won!" : "• Better luck next time."}`);
        setScore(s => won ? { ...s, wins: s.wins + 1 } : { ...s, losses: s.losses + 1 });
      }
    }, 60);
  }, [spinning, prediction]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-5xl font-serif text-white mb-1 font-bold">{display}</div>
      </div>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {betOptions.map(opt => (
          <button
            key={opt}
            onClick={() => !spinning && setPrediction(opt)}
            disabled={spinning}
            className={`px-3 py-1.5 text-[10px] font-serif uppercase tracking-wider border rounded-sm transition-colors
              ${prediction === opt
                ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]"
                : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning || !prediction}
        className="casino-btn w-full py-2.5"
      >
        {spinning ? "SPINNING..." : "SPIN WHEEL"}
      </button>
      {result && (
        <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>
      )}
      <div className="flex justify-center gap-4 text-xs text-[#6b5e50] font-serif">
        <span>Wins: {score.wins}</span>
        <span>Losses: {score.losses}</span>
      </div>
    </div>
  );
}

/* ─── Modal Container ─── */
export function CasinoGames({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<Game>("slots");
  const games: { key: Game; label: string }[] = [
    { key: "slots", label: "SLOTS" },
    { key: "coinflip", label: "COIN FLIP" },
    { key: "roulette", label: "ROULETTE" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md bg-[#120606] border border-[#d4af3715] rounded-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#d4af3710]">
            <span className="text-xs text-[#d4af37] font-serif uppercase tracking-[0.2em]">
              The Lounge
            </span>
            <button
              onClick={onClose}
              className="text-[#6b5e50] hover:text-[#d4af37] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Game tabs */}
          <div className="flex border-b border-[#d4af3710]">
            {games.map(g => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`flex-1 py-2.5 text-[10px] font-serif uppercase tracking-wider transition-colors
                  ${active === g.key
                    ? "text-[#d4af37] border-b border-[#d4af3730]"
                    : "text-[#6b5e50] hover:text-[#a89a80]"
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Game area */}
          <div className="p-5">
            {active === "slots" && <SlotMachine />}
            {active === "coinflip" && <CoinFlip />}
            {active === "roulette" && <Roulette />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
