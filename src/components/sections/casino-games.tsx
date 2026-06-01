"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";

/* ─── Types ─── */
type Game = "slots" | "coinflip" | "roulette" | "blackjack" | "videopoker" | "dice";
type Card = { suit: string; rank: string; value: number };
type Hand = Card[];

/* ─── Constants ─── */
const SLOT_SYMBOLS = ["♠", "♥", "♦", "♣"];
const COIN_SIDES = ["HEADS", "TAILS"];
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const POINTS_PER_SECOND = 1;
const STORAGE_KEY = "casino_points_v1";

const VP_SUITS = ["♠", "♥", "♦", "♣"];
const VP_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/* ─── Sound FX (Web Audio, no files needed) ─── */
const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.12) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}

const sfx = {
  tick: () => playTone(800, 0.06, "square", 0.04),
  win: () => { playTone(523, 0.15); setTimeout(() => playTone(659, 0.15), 100); setTimeout(() => playTone(784, 0.3), 200); },
  lose: () => { playTone(200, 0.25, "sine", 0.08); playTone(160, 0.3, "sine", 0.06); },
  jackpot: () => {
    [523, 587, 659, 698, 784, 880, 988, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.18, "sine", 0.1), i * 80));
  },
  card: () => playTone(600 + Math.random() * 200, 0.08, "triangle", 0.05),
  coin: () => playTone(1200, 0.1, "triangle", 0.06),
  spin: () => playTone(150, 0.4, "sine", 0.04),
  dice: () => { for (let i = 0; i < 6; i++) setTimeout(() => playTone(300 + Math.random() * 600, 0.04, "square", 0.03), i * 40); },
  flip: () => playTone(1000, 0.06, "triangle", 0.04),
};

/* ─── Helpers ─── */
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function loadBalance(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const d = JSON.parse(raw); return d.balance ?? 100; }
  } catch { /* ignore */ }
  return 100;
}

/* ─── Blackjack helpers ─── */
function makeDeck(): Card[] {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck: Card[] = [];
  for (const s of suits) for (const r of ranks) {
    deck.push({ suit: s, rank: r, value: r === "A" ? 11 : /\d/.test(r) ? parseInt(r) : 10 });
  }
  return deck;
}
function shuffleDeck(d: Card[]): Card[] {
  const a = [...d];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function handValue(hand: Hand): number {
  let total = 0, aces = 0;
  for (const c of hand) { total += c.value; if (c.rank === "A") aces++; }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}
function isBust(h: Hand): boolean { return handValue(h) > 21; }
function isBlackjack(h: Hand): boolean { return h.length === 2 && handValue(h) === 21; }

/* ─── Omaha Poker helpers ─── */
function vpMakeDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of VP_SUITS) for (const r of VP_RANKS) {
    deck.push({ suit: s, rank: r, value: r === "A" ? 14 : /\d/.test(r) ? parseInt(r) : r === "K" ? 13 : r === "Q" ? 12 : r === "J" ? 11 : 0 });
  }
  return deck;
}
function vpShuffle(d: Card[]): Card[] {
  const a = [...d];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function evaluateHand(hand: Card[]): { rank: string; mult: number } {
  const sorted = [...hand].sort((a, b) => a.value - b.value);
  const values = sorted.map(c => c.value);
  const suits = sorted.map(c => c.suit);
  const isFlush = suits.every(s => s === suits[0]);
  const diffs = values.map((v, i) => i === 0 ? 0 : v - values[i - 1]);
  const isStraight = !isFlush && values[4] - values[0] === 4 && new Set(values).size === 5;
  // Check straight with A low (A,2,3,4,5)
  const isWheel = !isFlush && values[0] === 1 && values[1] === 2 && values[2] === 3 && values[3] === 4 && values[4] === 14;
  const counts: Record<number, number> = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  const freq = Object.values(counts).sort((a, b) => b - a);

  if (isFlush && isStraight && values[4] === 14 && values[3] === 13) return { rank: "ROYAL FLUSH", mult: 250 };
  if (isFlush && (isStraight || isWheel)) return { rank: "STRAIGHT FLUSH", mult: 50 };
  if (freq[0] === 4) return { rank: "FOUR OF A KIND", mult: 25 };
  if (freq[0] === 3 && freq[1] === 2) return { rank: "FULL HOUSE", mult: 9 };
  if (isFlush) return { rank: "FLUSH", mult: 6 };
  if (isStraight || isWheel) return { rank: "STRAIGHT", mult: 4 };
  if (freq[0] === 3) return { rank: "THREE OF A KIND", mult: 3 };
  if (freq[0] === 2 && freq[1] === 2) return { rank: "TWO PAIR", mult: 2 };
  if (freq[0] === 2) return { rank: "ONE PAIR", mult: 0 };
  return { rank: "HIGH CARD", mult: 0 };
}

/* ─── Enhanced Confetti Burst (30+ particles, varied sizes/colors) ─── */
function ConfettiBurst({ active, intensity = 1 }: { active: boolean; intensity?: number }) {
  if (!active) return null;
  const count = Math.floor(50 + Math.random() * 30) * intensity;
  const colors = ["#d4af37", "#f5f0e8", "#8b1a1a", "#fff", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fff", "#ffa500"];
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360 + Math.random() * 30;
    const dist = 80 + Math.random() * 140;
    const dx = Math.cos((angle * Math.PI) / 180) * dist;
    const dy = Math.sin((angle * Math.PI) / 180) * dist;
    const color = colors[i % colors.length];
    const size = 4 + Math.random() * 10;
    const shape = Math.random() > 0.5 ? "rounded-full" : "rounded-sm";
    return (
      <motion.div
        key={i}
        initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
        animate={{ opacity: 0, scale: 0, x: dx, y: dy, rotate: Math.random() * 720 - 360 }}
        transition={{ duration: 1 + Math.random() * 0.8, ease: "easeOut", delay: Math.random() * 0.15 }}
        className={`absolute left-1/2 top-1/2 ${shape}`}
        style={{ backgroundColor: color, width: size, height: size * (0.6 + Math.random() * 0.4) }}
      />
    );
  });
  return <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">{particles}</div>;
}

/* ─── Collectible Poker Chips ─── */
export function CollectibleChips() {
  const [chips, setChips] = useState<Array<{ id: number; x: number; y: number; value: number; color: string }>>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const spawn = () => {
      const values = [5, 10, 25, 50];
      const colors: Record<number, string> = { 5: "#ef4444", 10: "#3b82f6", 25: "#22c55e", 50: "#d4af37" };
      const value = values[Math.floor(Math.random() * values.length)];
      setChips(prev => [...prev, {
        id: Date.now() + Math.random(),
        x: 4 + Math.random() * 92,
        y: 4 + Math.random() * 92,
        value,
        color: colors[value],
      }]);
    };
    const firstTimeout = setTimeout(spawn, 3000 + Math.random() * 3000);
    intervalRef.current = setInterval(spawn, 5000 + Math.random() * 4000);
    return () => {
      clearTimeout(firstTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const collect = (id: number, value: number) => {
    // Update localStorage balance directly
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const newBal = (stored.balance || 0) + value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance: newBal, lastVisit: Date.now() }));
      // Notify any listeners
      window.dispatchEvent(new CustomEvent("casinoChipCollected", { detail: value }));
    } catch {}
    setChips(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9998]">
      {chips.map(chip => (
        <motion.div
          key={chip.id}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 0.85, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, type: "spring", damping: 12 }}
          onClick={() => collect(chip.id, chip.value)}
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          whileTap={{ scale: 0.85 }}
          className="absolute cursor-pointer pointer-events-auto"
          style={{ left: `${chip.x}%`, top: `${chip.y}%` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-white/30"
            style={{
              backgroundColor: chip.color,
              boxShadow: "0 2px 8px " + chip.color + "60, 0 0 12px " + chip.color + "30",
            }}
          >
            {chip.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Inside the modal, listen for chip collections to sync balance
function useChipSync(setBalance: (fn: (b: number) => number) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const value = (e as CustomEvent).detail;
      setBalance(b => b + value);
    };
    window.addEventListener("casinoChipCollected", handler);
    return () => window.removeEventListener("casinoChipCollected", handler);
  }, [setBalance]);
}

/* ─── Screen Shake Wrapper ─── */
function ScreenShake({ shaking, children }: { shaking: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      animate={shaking ? {
        x: [0, -4, 3, -3, 2, -2, 1, 0],
        y: [0, 3, -3, 2, -2, 1, -1, 0],
        transition: { duration: 0.5, ease: "easeOut" }
      } : { x: 0, y: 0 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/* ─── Neon Glow Pulse ─── */
function NeonPulse({ active, children }: { active: boolean; children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

/* ─── Particle Trail ─── */
function ParticleTrail({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
    dur: 1.5 + Math.random() * 2,
    delay: Math.random() * 1,
    color: pick(["#d4af37", "#f5f0e8", "#8b1a1a", "#ff6b6b", "#ffd93d"]),
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.8, y: 0 }}
          animate={{ opacity: 0, y: -120 - Math.random() * 80, x: (Math.random() - 0.5) * 40 }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, bottom: "20%", width: p.size, height: p.size, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

/* ─── Points Badge ─── */
function PointsBadge({ balance }: { balance: number }) {
  const prev = useRef(balance);
  const [display, setDisplay] = useState(balance);
  const [counting, setCounting] = useState(false);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    if (balance > prev.current) {
      const start = prev.current;
      const diff = balance - start;
      const duration = Math.min(1500, 400 + diff * 15);
      const startTime = performance.now();
      setCounting(true);

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(start + diff * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(balance);
          setCounting(false);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
      prev.current = balance;
    } else if (balance < prev.current) {
      setDisplay(balance);
      prev.current = balance;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [balance]);

  return (
    <motion.div
      animate={counting ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 bg-[#1a0808] border border-[#d4af3725] px-3 py-1.5 rounded-md"
      style={{ boxShadow: counting ? "0 0 20px #d4af3730" : "0 0 12px #d4af3710" }}
    >
      <Trophy className="h-4 w-4 text-[#d4af37]" />
      <span
        className="text-base font-bold font-serif text-[#d4af37] tabular-nums"
      >
        {display}
      </span>
      <span className="text-xs text-[#6b5e50] font-serif uppercase tracking-wider">pts</span>
    </motion.div>
  );
}

/* ─── Betting Control ─── */
function BetControl({ bet, setBet, balance, disabled }: { bet: number; setBet: (v: number) => void; balance: number; disabled: boolean }) {
  const presets = [5, 10, 25, 50, 100];
  const [custom, setCustom] = useState("");
  const [inputMode, setInputMode] = useState(false);

  const applyCustom = () => {
    const val = parseInt(custom, 10);
    if (!isNaN(val) && val >= 1) {
      sfx.tick();
      setBet(Math.min(val, balance));
    }
    setCustom("");
    setInputMode(false);
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm text-[#6b5e50] font-serif uppercase tracking-wider shrink-0">Bet:</span>
      <div className="flex gap-1.5 flex-wrap">
        {presets.map(p => (
          <motion.button
            key={p}
            disabled={disabled || balance < p}
            onClick={() => { sfx.tick(); setBet(p); setInputMode(false); }}
            whileHover={disabled ? {} : { scale: 1.08 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={`px-3 py-1 text-xs font-serif border rounded-sm transition-colors disabled:opacity-25
              ${bet === p && !inputMode ? "border-[#d4af3750] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] text-[#6b5e50] hover:border-[#d4af3730]"}`}
          >{p}</motion.button>
        ))}
        {!inputMode ? (
          <motion.button
            disabled={disabled}
            onClick={() => { setInputMode(true); setCustom(String(bet)); }}
            whileHover={disabled ? {} : { scale: 1.08 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className="px-3 py-1 text-xs font-serif border rounded-sm border-dashed border-[#d4af3720] text-[#6b5e50] hover:border-[#d4af3740] hover:text-[#d4af37] transition-colors disabled:opacity-25"
          >Custom</motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1.5"
          >
            <input
              type="number"
              min={1}
              max={balance}
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyCustom()}
              disabled={disabled}
              autoFocus
              className="w-20 bg-[#0e0505] border border-[#d4af3740] rounded-sm px-2 py-1 text-xs text-[#d4af37] font-serif outline-none"
              placeholder="Amt"
            />
            <motion.button
              onClick={applyCustom}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-2 py-1 text-xs font-serif border border-[#d4af3750] bg-[#2a0a0a] text-[#d4af37] rounded-sm"
            >✓</motion.button>
            <motion.button
              onClick={() => { setInputMode(false); setCustom(""); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-2 py-1 text-xs font-serif border border-[#d4af3710] text-[#6b5e50] rounded-sm"
            >✗</motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Result Banner ─── */
function ResultBanner({ result }: { result: string | null }) {
  const isWin = result?.startsWith("JACKPOT") || result?.startsWith("WIN") || result?.includes("called it") || result?.startsWith("BLACKJACK") || result?.includes("— +");
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className={`text-center font-serif rounded-md border
            ${isWin
              ? "text-[#d4af37] border-[#d4af3730] bg-[#2a1010] py-4 px-6"
              : "text-[#8b8b8b] border-[#33333340] bg-[#0a0a0a] py-3 px-4"
            }`}
          style={isWin ? { boxShadow: "0 0 30px #d4af3725, 0 0 60px #d4af3710" } : {}}
        >
          <motion.span
            className={isWin ? "text-xl font-bold" : "text-base"}
            animate={isWin ? { scale: [1, 1.08, 1] } : {}}
            transition={isWin ? { duration: 0.6, repeat: 1 } : {}}
          >
            {result}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Slot Machine (3×3) ─── */
function SlotMachine({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  type Grid = string[][];
  const blankGrid = (): Grid => Array.from({ length: 3 }, () => ["", "", ""]);
  const [grid, setGrid] = useState<Grid>(blankGrid);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });
  const [won, setWon] = useState(false);
  const [winningCells, setWinningCells] = useState<Set<string>>(new Set());
  const [shaking, setShaking] = useState(false);
  const finalsRef = useRef<Grid>(blankGrid());
  const tickRef = useRef(0);
  const jackpotTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const WIN_LINES: [number, number][][] = [
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
  ];

  const spin = useCallback(() => {
    if (spinning || balance < bet) return;
    sfx.spin();
    setBalance(b => b - bet);
    setSpinning(true);
    setResult(null);
    setWon(false);
    setShaking(false);
    setWinningCells(new Set());
    tickRef.current = 0;
    const fg: Grid = Array.from({ length: 3 }, () => [pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS)]);
    finalsRef.current = fg;

    const iv = setInterval(() => {
      tickRef.current++;
      const t = tickRef.current;
      if (t < 12) sfx.tick();
      setGrid(prev => {
        const next = prev.map(row => [...row]);
        for (let col = 0; col < 3; col++) {
          for (let row = 0; row < 3; row++) {
            const stopTick = 10 + col * 8 + row * 3;
            next[row][col] = t < stopTick ? pick(SLOT_SYMBOLS) : finalsRef.current[row][col];
          }
        }
        return next;
      });
      if (t >= 40) {
        clearInterval(iv);
        setGrid(finalsRef.current);
        setSpinning(false);
        const wins: Set<string> = new Set();
        let jackpot = false;
        for (const line of WIN_LINES) {
          const [a, b, c] = line;
          const sa = finalsRef.current[a[0]][a[1]]; const sb = finalsRef.current[b[0]][b[1]]; const sc = finalsRef.current[c[0]][c[1]];
          if (sa && sa === sb && sb === sc) {
            line.forEach(([r, col]) => wins.add(`${r}-${col}`));
            if (line === WIN_LINES[6] || line === WIN_LINES[7]) jackpot = true;
          }
        }
        if (wins.size > 0) {
          setWinningCells(wins);
          const mult = jackpot ? 10 : wins.size >= 2 ? 7 : 3;
          const w = bet * mult;
          setBalance(b => b + w);
          setResult(`${jackpot ? "🎰 JACKPOT" : "✨ WIN"}! +${w} pts`);
          setWon(true);
          setShaking(true);
          if (jackpotTimeoutRef.current) clearTimeout(jackpotTimeoutRef.current);
          jackpotTimeoutRef.current = setTimeout(() => setShaking(false), 500);
          setScore(s => ({ ...s, w: s.w + 1 }));
          jackpot ? sfx.jackpot() : sfx.win();
        } else {
          setResult(`No luck —${bet} pts`);
          setScore(s => ({ ...s, l: s.l + 1 }));
          sfx.lose();
        }
      }
    }, 50);
  }, [spinning, bet, balance, setBalance]);

  useEffect(() => {
    if (grid[0][0] === "") setGrid(Array.from({ length: 3 }, () => [pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS)]));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={spinning} />

      <ScreenShake shaking={shaking}>
        <NeonPulse active={won}>
          <div className="relative bg-gradient-to-b from-[#1a0808] to-[#0a0303] border border-[#d4af3715] rounded-lg p-6 overflow-hidden">
            <ConfettiBurst active={won} />
            <ParticleTrail active={won} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />

            <div className="flex flex-col items-center gap-2">
              {grid.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  {row.map((sym, ci) => {
                    const cellKey = `${ri}-${ci}`;
                    const isWinning = winningCells.has(cellKey);
                    return (
                      <motion.div
                        key={cellKey}
                        animate={
                          !spinning
                            ? isWinning ? { scale: [1, 1.15, 1], boxShadow: ["0 0 5px #d4af3730", "0 0 20px #d4af3760", "0 0 5px #d4af3730"], transition: { duration: 0.4, repeat: 3 } } : (won ? { scale: [1, 1.02, 1] } : {})
                            : { y: [0, -3, 3, 0] }
                        }
                        transition={!spinning ? {} : { duration: 0.05, repeat: Infinity }}
                        className={`w-[80px] h-[80px] flex items-center justify-center text-5xl border rounded-md relative overflow-hidden
                          ${isWinning ? "border-[#d4af3760] bg-[#2a1010]" : "border-[#d4af3710] bg-[#060202]"}`}
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-b from-[#0a0303]/40 via-transparent to-[#0a0303]/40" animate={{ opacity: spinning ? 0.5 : 0 }} />
                        <motion.span initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.12 }} className="relative z-10">{sym}</motion.span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </NeonPulse>
      </ScreenShake>

      <motion.button onClick={spin} disabled={spinning || balance < bet} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="casino-btn w-full py-3.5 text-sm">
        {spinning ? "SPINNING..." : `SPIN (${bet} pts)`}
      </motion.button>
      <ResultBanner result={result} />
      <div className="flex justify-center gap-4 text-sm text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
    </div>
  );
}

/* ─── Coin Flip ─── */
function CoinFlip({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });
  const [coinRotation, setCoinRotation] = useState(0);
  const [displaySide, setDisplaySide] = useState("HEADS");
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flip = useCallback(() => {
    if (flipping || !prediction || balance < bet) return;
    sfx.coin();
    setBalance(b => b - bet);
    setFlipping(true);
    setResult(null);
    setWon(false);
    setShaking(false);
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    const actual = pick(COIN_SIDES);
    const spins = 1800 + Math.floor(Math.random() * 4) * 180;
    const finalAngle = actual === "TAILS" ? spins + 180 : spins;
    setCoinRotation(prev => prev + finalAngle);
    resultTimeoutRef.current = setTimeout(() => {
      setDisplaySide(actual);
      setFlipping(false);
      const win = prediction === actual;
      if (win) {
        setWon(true);
        setShaking(true);
        const w = bet * 2;
        setBalance(b => b + w);
        setResult(`${actual} — You called it! +${w} pts`);
        setScore(s => ({ ...s, w: s.w + 1 }));
        sfx.win();
        resultTimeoutRef.current = setTimeout(() => setShaking(false), 500);
      } else {
        setResult(`${actual} — Wrong call. -${bet} pts`);
        setScore(s => ({ ...s, l: s.l + 1 }));
        sfx.lose();
      }
    }, 2200);
  }, [flipping, prediction, bet, balance, setBalance]);

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={flipping} />

      <ScreenShake shaking={shaking}>
        <NeonPulse active={won}>
          <div className="relative flex justify-center py-6">
            <ConfettiBurst active={won} />
            <ParticleTrail active={flipping} />
            <motion.div
              animate={{ rotateY: coinRotation, scale: flipping ? 1.15 : 1 }}
              transition={{ duration: 2.2, ease: [0.15, 0.8, 0.3, 1] }}
              className="w-32 h-32 relative"
              style={{ perspective: "600px", transformStyle: "preserve-3d" }}
            >
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-[#d4af3740] bg-gradient-to-br from-[#3a1a1a] via-[#2a0e0e] to-[#1a0606] rounded-full shadow-lg" style={{ backfaceVisibility: "hidden", boxShadow: "0 0 20px #d4af3715, inset 0 1px 0 #d4af3720" }}>
                <span className="text-4xl">🪙</span>
                <span className="text-xs text-[#d4af37] font-serif uppercase tracking-wider mt-1">Heads</span>
              </motion.div>
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-[#d4af3740] bg-gradient-to-br from-[#1a1a2e] via-[#12122a] to-[#0a0a1a] rounded-full shadow-lg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "0 0 20px #d4af3715, inset 0 1px 0 #d4af3720" }}>
                <span className="text-4xl">🪙</span>
                <span className="text-xs text-[#d4af37] font-serif uppercase tracking-wider mt-1">Tails</span>
              </motion.div>
            </motion.div>
            <motion.div animate={{ scale: flipping ? [1, 0.5, 1] : 1, opacity: flipping ? [0.5, 0.1, 0.5] : 0.5 }} transition={{ duration: 2.2, ease: [0.15, 0.8, 0.3, 1] }} className="absolute bottom-4 w-24 h-3 bg-[#d4af3710] rounded-full blur-sm" />
          </div>
        </NeonPulse>
      </ScreenShake>

      <div className="flex gap-2">
        {COIN_SIDES.map(side => (
          <motion.button
            key={side}
            onClick={() => { if (!flipping) { sfx.tick(); setPrediction(side); } }}
            disabled={flipping}
            whileHover={flipping ? {} : { scale: 1.03 }}
            whileTap={flipping ? {} : { scale: 0.97 }}
            className={`flex-1 py-3 text-xs font-serif uppercase tracking-wider border rounded-sm transition-colors
              ${prediction === side ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"}`}
          >{side}</motion.button>
        ))}
      </div>
      <motion.button onClick={flip} disabled={flipping || !prediction || balance < bet} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="casino-btn w-full py-3.5 text-sm">
        {flipping ? "FLIPPING..." : `FLIP (${bet} pts)`}
      </motion.button>
      <ResultBanner result={result} />
      <div className="flex justify-center gap-4 text-sm text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
    </div>
  );
}

/* ─── Roulette ─── */
function Roulette({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });
  const [display, setDisplay] = useState("—");
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballAngle, setBallAngle] = useState(0);
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const betOptions = ["RED", "BLACK", "GREEN", "ODD", "EVEN"];
  const segAngle = 360 / ROULETTE_NUMBERS.length;

  const spin = useCallback(() => {
    if (spinning || !prediction || balance < bet) return;
    sfx.spin();
    setBalance(b => b - bet);
    setSpinning(true);
    setResult(null);
    setWon(false);
    setShaking(false);
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    const actualNum = pick(ROULETTE_NUMBERS);
    const idx = ROULETTE_NUMBERS.indexOf(actualNum);
    const target = 360 - idx * segAngle - segAngle / 2;
    setWheelRotation(prev => prev + 5 * 360 + target);
    setBallAngle(prev => prev - (6 * 360 + target));
    const isRed = RED_NUMBERS.includes(actualNum);
    const isGreen = actualNum === 0;
    const color = isGreen ? "GREEN" : isRed ? "RED" : "BLACK";
    const iv = setInterval(() => setDisplay(String(pick(ROULETTE_NUMBERS))), 70);
    resultTimeoutRef.current = setTimeout(() => {
      clearInterval(iv);
      setDisplay(String(actualNum));
      setSpinning(false);
      let win = false;
      if (prediction === "RED" && isRed) win = true;
      if (prediction === "BLACK" && !isRed && !isGreen) win = true;
      if (prediction === "GREEN" && isGreen) win = true;
      if (prediction === "ODD" && actualNum !== 0 && actualNum % 2 !== 0) win = true;
      if (prediction === "EVEN" && actualNum % 2 === 0) win = true;
      const mult = prediction === "GREEN" ? 14 : 2;
      if (win) {
        setWon(true);
        setShaking(true);
        const w = bet * mult;
        setBalance(b => b + w);
        setResult(`${actualNum} ${color} — +${w} pts`);
        setScore(s => ({ ...s, w: s.w + 1 }));
        sfx.win();
        resultTimeoutRef.current = setTimeout(() => setShaking(false), 500);
      } else {
        setResult(`${actualNum} ${color} — -${bet} pts`);
        setScore(s => ({ ...s, l: s.l + 1 }));
        sfx.lose();
      }
    }, 3500);
  }, [spinning, prediction, bet, balance, setBalance]);

  const segments = ROULETTE_NUMBERS.map((num, i) => {
    const a = i * segAngle;
    const isRed = RED_NUMBERS.includes(num);
    const fill = num === 0 ? "#1a5c1a" : isRed ? "#8b1a1a" : "#1a1a2e";
    const s1 = ((a - 90) * Math.PI) / 180, s2 = ((a + segAngle - 90) * Math.PI) / 180;
    const r = 45;
    return <path key={num} d={`M50 50 L${50 + r * Math.cos(s1)} ${50 + r * Math.sin(s1)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(s2)} ${50 + r * Math.sin(s2)} Z`} fill={fill} stroke="#d4af3710" strokeWidth="0.15" />;
  });

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={spinning} />

      <ScreenShake shaking={shaking}>
        <NeonPulse active={won}>
          <div className="relative flex justify-center py-3">
            <ConfettiBurst active={won} />
            <ParticleTrail active={spinning} />
            <div className="relative w-48 h-48">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
                <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[12px] border-t-[#d4af37]" />
              </div>
              <motion.div animate={{ rotate: wheelRotation }} transition={{ duration: 3.5, ease: [0.15, 0.85, 0.3, 1] }} className="w-48 h-48 rounded-full border-2 border-[#d4af3725] overflow-hidden bg-[#0a0303] shadow-lg" style={{ boxShadow: "0 0 30px #d4af370a, inset 0 0 20px #00000040" }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">{segments}</svg>
              </motion.div>
              <motion.div animate={{ rotate: ballAngle }} transition={{ duration: 3.5, ease: [0.15, 0.85, 0.3, 1] }} className="absolute inset-0 pointer-events-none">
                <div className="absolute w-2.5 h-2.5 bg-gradient-to-br from-white to-[#ccc] rounded-full shadow-md" style={{ top: "6px", left: "50%", transform: "translateX(-50%)" }} />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div animate={won ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.5, repeat: won ? 2 : 0 }} className="w-12 h-12 rounded-full bg-[#120606] border border-[#d4af3725] flex items-center justify-center">
                  <span className="text-lg font-bold font-serif text-[#d4af37]">{spinning ? "…" : display}</span>
                </motion.div>
              </div>
            </div>
          </div>
        </NeonPulse>
      </ScreenShake>

      <div className="flex gap-2 flex-wrap justify-center">
        {betOptions.map(opt => {
          const colorMap: Record<string, string> = { RED: "text-[#c0392b]", BLACK: "text-[#888]", GREEN: "text-[#27ae60]" };
          return (
            <motion.button
              key={opt}
              onClick={() => { if (!spinning) { sfx.tick(); setPrediction(opt); } }}
              disabled={spinning}
              whileHover={spinning ? {} : { scale: 1.06 }}
              whileTap={spinning ? {} : { scale: 0.95 }}
              className={`px-3 py-2 text-xs font-serif uppercase tracking-wider border rounded-sm transition-colors
                ${prediction === opt ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : `border-[#d4af3710] bg-[#1a0606] ${colorMap[opt] || "text-[#6b5e50]"}`}`}
            >{opt}</motion.button>
          );
        })}
      </div>
      <motion.button onClick={spin} disabled={spinning || !prediction || balance < bet} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="casino-btn w-full py-3.5 text-sm">
        {spinning ? "SPINNING..." : `SPIN (${bet} pts)`}
      </motion.button>
      <ResultBanner result={result} />
      <div className="flex justify-center gap-4 text-sm text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
    </div>
  );
}

/* ─── Blackjack ─── */
function Blackjack({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Hand>([]);
  const [dealerHand, setDealerHand] = useState<Hand>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "dealer" | "done">("idle");
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0, p: 0 });
  const [doubled, setDoubled] = useState(false);
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [lastCardIdx, setLastCardIdx] = useState(0);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dealerTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dealerResolve = useCallback((dHand: Hand, dDeck: Card[], pHand: Hand, totalBet: number) => {
    let dh = [...dHand], dd = [...dDeck];
    const go = () => {
      if (handValue(dh) < 17) {
        if (dealerTimeoutRef.current) clearTimeout(dealerTimeoutRef.current);
        dealerTimeoutRef.current = setTimeout(() => {
          sfx.card();
          dh = [...dh, dd[0]];
          dd = dd.slice(1);
          setDealerHand(dh);
          setDeck(dd);
          setLastCardIdx(i => i + 1);
          go();
        }, 600);
      } else {
        const pv = handValue(pHand), dv = handValue(dh);
        if (dv > 21 || pv > dv) {
          const w = totalBet * 2;
          setWon(true);
          setShaking(true);
          setBalance(b => b + w);
          setResult(`Win! ${pv} vs ${dv}. +${w} pts`);
          setScore(s => ({ ...s, w: s.w + 1 }));
          sfx.win();
          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => setShaking(false), 500);
        } else if (dv > pv) {
          setResult(`Dealer wins. ${pv} vs ${dv}. -${totalBet} pts`);
          setScore(s => ({ ...s, l: s.l + 1 }));
          sfx.lose();
        } else {
          setBalance(b => b + totalBet);
          setResult(`Push. ${pv} vs ${dv}`);
          setScore(s => ({ ...s, p: s.p + 1 }));
        }
        setPhase("done");
      }
    };
    go();
  }, [setBalance, setScore]);

  const deal = useCallback(() => {
    if (balance < bet) return;
    sfx.card();
    setBalance(b => b - bet);
    setWon(false);
    setShaking(false);
    const nd = shuffleDeck(makeDeck());
    const ph = [nd.pop()!, nd.pop()!], dh = [nd.pop()!, nd.pop()!];
    setDeck(nd.slice()); setPlayerHand(ph); setDealerHand(dh); setDoubled(false); setResult(null);
    setLastCardIdx(0);
    if (isBlackjack(ph)) {
      setWon(true);
      setShaking(true);
      const w = bet + Math.floor(bet * 1.5);
      setBalance(b => b + w);
      setResult(`BLACKJACK! +${w} pts`);
      setScore(s => ({ ...s, w: s.w + 1 }));
      setPhase("done");
      sfx.jackpot();
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = setTimeout(() => setShaking(false), 500);
    } else if (isBlackjack(dh)) {
      setResult(`Dealer BJ. -${bet} pts`);
      setScore(s => ({ ...s, l: s.l + 1 }));
      setPhase("done");
      sfx.lose();
    } else if (isBust(ph)) {
      setResult(`Bust! -${bet} pts`);
      setScore(s => ({ ...s, l: s.l + 1 }));
      setPhase("done");
      sfx.lose();
    } else {
      setPhase("playing");
    }
  }, [bet, balance, setBalance, setScore]);

  const hit = useCallback(() => {
    if (phase !== "playing") return;
    sfx.card();
    const card = deck[0], nd = deck.slice(1);
    const nh = [...playerHand, card];
    setDeck(nd); setPlayerHand(nh);
    setLastCardIdx(playerHand.length);
    if (isBust(nh)) {
      setResult(`Bust! -${doubled ? bet * 2 : bet} pts`);
      setScore(s => ({ ...s, l: s.l + 1 }));
      setPhase("done");
      sfx.lose();
    }
  }, [phase, deck, playerHand, bet, doubled, setScore]);

  const stand = useCallback(() => {
    if (phase !== "playing") return;
    setPhase("dealer");
    dealerResolve(dealerHand, deck, playerHand, doubled ? bet * 2 : bet);
  }, [phase, dealerHand, deck, playerHand, bet, doubled, dealerResolve]);

  const doubleDown = useCallback(() => {
    if (phase !== "playing" || playerHand.length !== 2 || balance < bet) return;
    sfx.card();
    setBalance(b => b - bet);
    setDoubled(true);
    const card = deck[0], nd = deck.slice(1);
    const nh = [...playerHand, card];
    setDeck(nd); setPlayerHand(nh);
    setLastCardIdx(playerHand.length);
    if (isBust(nh)) {
      setResult(`Bust! -${bet * 2} pts`);
      setScore(s => ({ ...s, l: s.l + 1 }));
      setPhase("done");
      sfx.lose();
    } else {
      setPhase("dealer");
      if (dealerTimeoutRef.current) clearTimeout(dealerTimeoutRef.current);
      dealerTimeoutRef.current = setTimeout(() => dealerResolve(dealerHand, nd, nh, bet * 2), 100);
    }
  }, [phase, playerHand, deck, bet, balance, dealerHand, dealerResolve, setScore]);

  const renderCard = (card: Card | undefined, idx: number, hidden?: boolean) => {
    if (!card) return <div key={idx} className="inline-block w-16 h-[72px] mx-1 rounded-md border border-[#d4af3710] bg-[#080302]" />;
    const red = card.suit === "♥" || card.suit === "♦";
    const isLast = idx === lastCardIdx && !hidden;
    return (
      <motion.div
        key={idx}
        initial={isLast ? { opacity: 0, x: -20, rotateY: 90, scale: 0.8 } : {}}
        animate={isLast ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: idx * 0.1, type: "spring", damping: 18 }}
        whileHover={{ y: -4, transition: { duration: 0.15 } }}
        className={`inline-block w-16 h-[72px] mx-1 rounded-md border flex flex-col items-center justify-center font-bold font-serif relative
          ${hidden
            ? "bg-gradient-to-br from-[#3a1515] to-[#1a0808] border-[#d4af3725] cursor-default"
            : "bg-gradient-to-br from-[#faf5eb] to-[#f0e8d8] border-[#d4af3715] text-[#2a1a1a]"
          }`}
        style={{ transformStyle: "preserve-3d", boxShadow: hidden ? "0 2px 8px #00000040" : "0 2px 8px #00000020" }}
      >
        {hidden ? (
          <span className="text-lg text-[#d4af3730]">✦</span>
        ) : (
          <>
            <span className={`text-sm leading-none ${red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}`}>{card.rank}</span>
            <span className={`text-xl leading-none ${red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}`}>{card.suit}</span>
          </>
        )}
      </motion.div>
    );
  };

  const pVal = playerHand.length > 0 ? handValue(playerHand) : 0;
  const dVal = dealerHand.length > 0 && dealerHand[0] ? (phase === "playing" ? dealerHand[0].value : handValue(dealerHand)) : 0;

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={phase === "playing" || phase === "dealer"} />

      <ScreenShake shaking={shaking}>
        <NeonPulse active={won}>
          <div className="relative bg-gradient-to-b from-[#0e0606] to-[#060202] border border-[#d4af3710] rounded-md p-4 space-y-4 overflow-hidden">
            <ConfettiBurst active={won} />
            <ParticleTrail active={won} />
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,#d4af37_0%,transparent_70%)] pointer-events-none" />

            <div className="relative">
              <div className="text-xs text-[#6b5e50] font-serif uppercase tracking-wider mb-2">Dealer <span className="text-[#d4af37]">({dVal})</span></div>
              <div className="flex flex-wrap min-h-[72px]">{dealerHand.map((c, i) => renderCard(c, i, phase === "playing" && i === 1))}</div>
            </div>

            <div className="border-t border-[#d4af3710] pt-3" />

            <div className="relative">
              <div className="text-xs text-[#6b5e50] font-serif uppercase tracking-wider mb-2">You <span className="text-[#d4af37]">({pVal})</span></div>
              <div className="flex flex-wrap min-h-[72px]">{playerHand.map((c, i) => renderCard(c, i))}</div>
            </div>
          </div>
        </NeonPulse>
      </ScreenShake>

      {(phase === "idle" || phase === "done") ? (
        <motion.button onClick={deal} disabled={balance < bet} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="casino-btn w-full py-3.5 text-sm">
          DEAL ({bet} pts)
        </motion.button>
      ) : phase === "playing" ? (
        <div className="flex gap-2">
          <motion.button onClick={hit} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="casino-btn flex-1 py-3 text-sm">HIT</motion.button>
          <motion.button onClick={stand} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="casino-btn flex-1 py-3 text-sm">STAND</motion.button>
          {playerHand.length === 2 && balance >= bet && !doubled && (
            <motion.button onClick={doubleDown} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="casino-btn flex-1 py-3 text-sm">2×</motion.button>
          )}
        </div>
      ) : null}

      <ResultBanner result={result} />
      <div className="flex justify-center gap-3 text-sm text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span><span>P: {score.p}</span></div>
    </div>
  );
}

/* ─── Omaha Poker (5-Card Draw) ─── */
function VideoPoker({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [hand, setHand] = useState<Card[]>([]);
  const [phase, setPhase] = useState<"idle" | "select" | "dealing" | "done">("idle");
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);
  const [handRank, setHandRank] = useState<string>("");
  const deckRef = useRef<Card[]>([]);
  const dealTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dealCards = useCallback(() => {
    if (balance < bet || animating || (phase !== "idle" && phase !== "done")) return;
    sfx.card();
    setBalance(b => b - bet);
    setWon(false);
    setShaking(false);
    setResult(null);
    setHandRank("");
    setAnimating(true);
    setFlippedCards([]);

    const deck = vpShuffle(vpMakeDeck());
    deckRef.current = deck;
    const newHand = [deck[0], deck[1], deck[2], deck[3], deck[4]];
    deckRef.current = deck.slice(5);

    // Deal one card at a time with dramatic flip
    setHand([]);
    setHeld([false, false, false, false, false]);

    let dealt = 0;
    const dealNext = () => {
      if (dealt >= 5) {
        setPhase("select");
        setAnimating(false);
        return;
      }
      if (dealTimeoutRef.current) clearTimeout(dealTimeoutRef.current);
      dealTimeoutRef.current = setTimeout(() => {
        setHand(prev => [...prev, newHand[dealt]]);
        setFlippedCards(prev => [...prev, dealt]);
        sfx.flip();
        dealt++;
        dealNext();
      }, 200);
    };
    dealNext();
  }, [bet, balance, phase, animating, setBalance]);

  const draw = useCallback(() => {
    if (phase !== "select" || animating) return;
    setAnimating(true);
    const deck = [...deckRef.current];
    let currentHand = [...hand];
    let idx = 0;

    const drawNext = () => {
      // Find next non-held card
      while (idx < 5 && held[idx]) idx++;
      if (idx >= 5) {
        // All replacements done
        const evalResult = evaluateHand(currentHand);
        setHandRank(evalResult.rank);
        if (evalResult.mult > 0) {
          setWon(true);
          setShaking(true);
          const w = bet * evalResult.mult;
          setBalance(b => b + w);
          setResult(`${evalResult.rank}! +${w} pts`);
          setScore(s => ({ ...s, w: s.w + 1 }));
          evalResult.mult >= 25 ? sfx.jackpot() : sfx.win();
          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => setShaking(false), 600);
        } else {
          setResult(`${evalResult.rank} — no win. -${bet} pts`);
          setScore(s => ({ ...s, l: s.l + 1 }));
          sfx.lose();
        }
        setPhase("done");
        setAnimating(false);
        return;
      }

      // Flip animation for this card
      setFlippedCards(prev => [...prev, idx]);
      if (deck.length > 0) {
        const newCard = deck.pop()!;
        currentHand[idx] = newCard;
      }
      sfx.flip();
      setHand([...currentHand]);

      idx++;
      if (drawTimeoutRef.current) clearTimeout(drawTimeoutRef.current);
      drawTimeoutRef.current = setTimeout(drawNext, 250);
    };
    drawNext();
  }, [phase, animating, hand, held, bet, setBalance, setScore]);

  const drawTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toggleHold = (idx: number) => {
    if (phase !== "select") return;
    sfx.tick();
    setHeld(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const renderCard = (card: Card | undefined, idx: number) => {
    if (!card) return <div key={idx} className="w-[72px] h-[100px] mx-1 rounded-md border border-[#d4af3710] bg-[#080302]" />;
    const red = card.suit === "♥" || card.suit === "♦";
    const isHeld = held[idx] && phase === "select";
    const justFlipped = flippedCards.includes(idx) && flippedCards[flippedCards.length - 1] === idx;
    const isWinning = won && idx < 5;

    return (
      <motion.div
        key={`${idx}-${flippedCards.length}`}
        initial={justFlipped ? { opacity: 0, rotateY: 90, scale: 0.8, y: -30 } : { opacity: 1, rotateY: 0, scale: 1, y: 0 }}
        animate={{ opacity: 1, rotateY: 0, scale: isHeld ? 1.05 : 1, y: isHeld ? -6 : 0 }}
        transition={{ duration: 0.5, type: "spring", damping: 16 }}
        onClick={() => toggleHold(idx)}
        whileHover={!animating && phase === "select" ? { y: -8, scale: 1.08 } : {}}
        whileTap={!animating && phase === "select" ? { scale: 0.95 } : {}}
        className={`relative w-[72px] h-[100px] mx-1 rounded-md border-2 flex flex-col items-center justify-center font-bold font-serif cursor-pointer select-none
          ${isHeld
            ? "border-[#d4af37] bg-gradient-to-br from-[#2a1a0a] to-[#1a0e05] shadow-lg"
            : isWinning
              ? "border-[#d4af3740] bg-gradient-to-br from-[#faf5eb] to-[#f0e8d8] shadow-md"
              : "border-[#d4af3720] bg-gradient-to-br from-[#faf5eb] to-[#f0e8d8]"
          }`}
        style={{ transformStyle: "preserve-3d", boxShadow: isHeld ? "0 0 15px #d4af3730" : "0 2px 8px #00000020" }}
      >
        {isHeld && (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-1 right-1 text-[8px] text-[#d4af37] font-serif uppercase tracking-wider"
          >HOLD</motion.div>
        )}
        <span className={`text-sm leading-none ${red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}`}>{card.rank}</span>
        <span className={`text-2xl leading-none ${red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}`}>{card.suit}</span>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={phase === "select" || phase === "dealing"} />

      <ScreenShake shaking={shaking}>
        <NeonPulse active={won}>
          <div className="relative bg-gradient-to-b from-[#1a0e05] to-[#0a0503] border border-[#d4af3715] rounded-lg p-6 overflow-hidden">
            <ConfettiBurst active={won} intensity={won && handRank.includes("ROYAL") ? 2 : 1} />
            <ParticleTrail active={animating} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />

            <div className="flex justify-center items-center min-h-[120px]">
              {hand.length > 0 ? hand.map((card, i) => renderCard(card, i)) : (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <motion.div
                      key={`blank-${i}`}
                      className="w-[72px] h-[100px] mx-1 rounded-md border border-[#d4af3710] bg-[#080302] flex items-center justify-center"
                    >
                      <span className="text-[#d4af3720] text-xl">♠</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {phase === "select" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-[#d4af37] font-serif uppercase tracking-wider mt-2"
              >
                Tap cards to hold · Then press DEAL
              </motion.div>
            )}

            {handRank && phase === "done" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 14 }}
                className="text-center mt-3"
              >
                <span className={`text-sm font-serif tracking-wider ${won ? "text-[#d4af37]" : "text-[#8b8b8b]"}`}>
                  {handRank}
                </span>
              </motion.div>
            )}
          </div>
        </NeonPulse>
      </ScreenShake>

      <div className="flex gap-2">
        {(phase === "idle" || phase === "done") ? (
          <motion.button
            onClick={dealCards}
            disabled={balance < bet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="casino-btn flex-1 py-3.5 text-sm"
          >
            DEAL ({bet} pts)
          </motion.button>
        ) : phase === "select" ? (
          <motion.button
            onClick={draw}
            disabled={animating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="casino-btn flex-1 py-3.5 text-sm"
          >
            {animating ? "DEALING..." : "DEAL (REPLACE)"}
          </motion.button>
        ) : null}
      </div>

      {/* Payout Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0e0505] border border-[#d4af3710] rounded-md p-3"
      >
        <div className="text-xs text-[#6b5e50] font-serif uppercase tracking-wider mb-2 text-center">Pay Table (×{bet})</div>
        <div className="grid grid-cols-2 gap-1 text-xs font-serif">
          {[
            ["Royal Flush", "250×", "#ffd700"],
            ["Straight Flush", "50×", "#ff9500"],
            ["Four of a Kind", "25×", "#ff6b35"],
            ["Full House", "9×", "#ffa500"],
            ["Flush", "6×", "#ffd93d"],
            ["Straight", "4×", "#6bcb77"],
            ["Three of a Kind", "3×", "#4d96ff"],
            ["Two Pair", "2×", "#9b59b6"],
          ].map(([name, mult, color]) => (
            <div key={name as string} className="flex justify-between px-2 py-1 rounded-sm bg-[#1a0a0a]/50">
              <span className="text-[#a89a80]">{name as string}</span>
              <span style={{ color: color as string }}>{mult as string}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <ResultBanner result={result} />
      <div className="flex justify-center gap-4 text-sm text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
    </div>
  );
}

/* ─── Dice / Craps ─── */
function DiceGame({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [dice1Rotation, setDice1Rotation] = useState({ x: 0, y: 0, z: 0 });
  const [dice2Rotation, setDice2Rotation] = useState({ x: 0, y: 0, z: 0 });
  const [dice1Display, setDice1Display] = useState(1);
  const [dice2Display, setDice2Display] = useState(1);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const betOptions = [
    { key: "over7", label: "Over 7", icon: "↗", mult: 2 },
    { key: "under7", label: "Under 7", icon: "↙", mult: 2 },
    { key: "exactly7", label: "Exactly 7", icon: "7️⃣", mult: 4 },
    { key: "snakeeyes", label: "Snake Eyes", icon: "🐍", mult: 10 },
    { key: "boxcars", label: "Boxcars", icon: "🚂", mult: 10 },
  ];

  const roll = useCallback(() => {
    if (rolling || !prediction || balance < bet) return;
    sfx.dice();
    setBalance(b => b - bet);
    setRolling(true);
    setResult(null);
    setWon(false);
    setShaking(false);

    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);

    // Animate with extra random spins, then land on the correct face
    const target1 = faceRotations[d1];
    const target2 = faceRotations[d2];
    const extraSpins = 3 + Math.floor(Math.random() * 3);
    const final1 = {
      x: target1.x + extraSpins * 360 + Math.floor(Math.random() * 2) * 360,
      y: target1.y + extraSpins * 360 + Math.floor(Math.random() * 2) * 360,
      z: 0,
    };
    const final2 = {
      x: target2.x + extraSpins * 360 + Math.floor(Math.random() * 2) * 360,
      y: target2.y + extraSpins * 360 + Math.floor(Math.random() * 2) * 360,
      z: 0,
    };
    setDice1Rotation(final1);
    setDice2Rotation(final2);

    // Flicker numbers during roll
    let flickerCount = 0;
    const flickerIv = setInterval(() => {
      setDice1Display(1 + Math.floor(Math.random() * 6));
      setDice2Display(1 + Math.floor(Math.random() * 6));
      flickerCount++;
      if (flickerCount > 12) {
        clearInterval(flickerIv);
      }
    }, 80);

    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    rollTimeoutRef.current = setTimeout(() => {
      clearInterval(flickerIv);
      setDice1Display(d1);
      setDice2Display(d2);
      setDice([d1, d2]);
      setRolling(false);

      const total = d1 + d2;
      let win = false;
      let payout = 0;

      if (prediction === "over7" && total > 7) { win = true; payout = bet * 2; }
      if (prediction === "under7" && total < 7) { win = true; payout = bet * 2; }
      if (prediction === "exactly7" && total === 7) { win = true; payout = bet * 4; }
      if (prediction === "snakeeyes" && d1 === 1 && d2 === 1) { win = true; payout = bet * 10; }
      if (prediction === "boxcars" && d1 === 6 && d2 === 6) { win = true; payout = bet * 10; }

      if (win) {
        setWon(true);
        setShaking(true);
        setBalance(b => b + payout);
        const predLabel = betOptions.find(o => o.key === prediction)?.label || prediction;
        setResult(`${predLabel}! ${d1}+${d2}=${total} — +${payout} pts`);
        setScore(s => ({ ...s, w: s.w + 1 }));
        payout >= bet * 10 ? sfx.jackpot() : sfx.win();
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = setTimeout(() => setShaking(false), 600);
      } else {
        setResult(`${d1}+${d2}=${total} — no win. -${bet} pts`);
        setScore(s => ({ ...s, l: s.l + 1 }));
        sfx.lose();
      }
    }, 1800);
  }, [rolling, prediction, bet, balance, setBalance, betOptions]);

  // Dot pattern for a single face
  const dotPositions: Record<number, { top?: string; left?: string; bottom?: string; right?: string }[]> = {
    1: [{ top: "50%", left: "50%", bottom: "auto", right: "auto" }],
    2: [{ top: "20%", left: "70%" }, { top: "70%", left: "20%" }],
    3: [{ top: "20%", left: "70%" }, { top: "50%", left: "50%" }, { top: "70%", left: "20%" }],
    4: [{ top: "20%", left: "20%" }, { top: "20%", left: "70%" }, { top: "70%", left: "20%" }, { top: "70%", left: "70%" }],
    5: [{ top: "20%", left: "20%" }, { top: "20%", left: "70%" }, { top: "50%", left: "50%" }, { top: "70%", left: "20%" }, { top: "70%", left: "70%" }],
    6: [{ top: "20%", left: "20%" }, { top: "20%", left: "70%" }, { top: "50%", left: "20%" }, { top: "50%", left: "70%" }, { top: "70%", left: "20%" }, { top: "70%", left: "70%" }],
  };

  function DiceFace({ value, size = 64 }: { value: number; size?: number }) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
        <div className="w-full h-full rounded-md bg-gradient-to-br from-[#faf5eb] to-[#e8dcc8] border border-[#d4af3720] p-1.5" style={{ boxShadow: "inset 0 1px 3px #00000020" }}>
          <div className="relative w-full h-full">
            {dotPositions[value]?.map((pos, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[#2a1a1a]"
                style={{
                  width: value === 1 ? "24%" : "18%",
                  height: value === 1 ? "24%" : "18%",
                  top: pos.top,
                  left: pos.left,
                  bottom: pos.bottom || "auto",
                  right: pos.right || "auto",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Rotation to show a given face: { x, y } in degrees
  // Face layout: +Y=front(1), -Y=back(6), +X=bottom(2), -X=top(5), +Z=right(3), -Z=left(4)
  const faceRotations: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },
    2: { x: 90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: -90, y: 0 },
    6: { x: 180, y: 0 },
  };

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={rolling} />

      <ScreenShake shaking={shaking}>
        <NeonPulse active={won}>
          <div className="relative bg-gradient-to-b from-[#1a0e05] to-[#0a0503] border border-[#d4af3715] rounded-lg p-6 overflow-hidden">
            <ConfettiBurst active={won} intensity={won && (prediction === "snakeeyes" || prediction === "boxcars") ? 2 : 1} />
            <ParticleTrail active={rolling} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />

            <div className="flex justify-center gap-8 py-6" style={{ perspective: "800px" }}>
              {/* Die 1 */}
              <div className="w-[72px] h-[72px]" style={{ perspective: "600px" }}>
                <motion.div
                  animate={{
                    rotateX: dice1Rotation.x,
                    rotateY: dice1Rotation.y,
                    rotateZ: dice1Rotation.z,
                  }}
                  transition={{
                    duration: 1.6,
                    ease: [0.15, 0.8, 0.3, 1],
                  }}
                  className="w-[72px] h-[72px] relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "translateZ(36px)" }}><DiceFace value={1} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateY(180deg) translateZ(36px)" }}><DiceFace value={6} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateY(90deg) translateZ(36px)" }}><DiceFace value={3} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateY(-90deg) translateZ(36px)" }}><DiceFace value={4} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateX(90deg) translateZ(36px)" }}><DiceFace value={5} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateX(-90deg) translateZ(36px)" }}><DiceFace value={2} /></div>
                </motion.div>
              </div>

              {/* Die 2 */}
              <div className="w-[72px] h-[72px]" style={{ perspective: "600px" }}>
                <motion.div
                  animate={{
                    rotateX: dice2Rotation.x,
                    rotateY: dice2Rotation.y,
                    rotateZ: dice2Rotation.z,
                  }}
                  transition={{
                    duration: 1.6,
                    ease: [0.15, 0.8, 0.3, 1],
                  }}
                  className="w-[72px] h-[72px] relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "translateZ(36px)" }}><DiceFace value={1} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateY(180deg) translateZ(36px)" }}><DiceFace value={6} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateY(90deg) translateZ(36px)" }}><DiceFace value={3} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateY(-90deg) translateZ(36px)" }}><DiceFace value={4} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateX(90deg) translateZ(36px)" }}><DiceFace value={5} /></div>
                  <div style={{ position: "absolute", width: "100%", height: "100%", transform: "rotateX(-90deg) translateZ(36px)" }}><DiceFace value={2} /></div>
                </motion.div>
              </div>
            </div>

            {!rolling && dice[0] + dice[1] !== 2 && (
              <div className="text-center text-xs text-[#6b5e50] font-serif mt-1">
                Total: <span className="text-[#d4af37] text-base font-bold">{dice[0] + dice[1]}</span>
              </div>
            )}
          </div>
        </NeonPulse>
      </ScreenShake>

      {/* Bet Options */}
      <div className="grid grid-cols-2 gap-2">
        {betOptions.map(opt => (
          <motion.button
            key={opt.key}
            onClick={() => { if (!rolling) { sfx.tick(); setPrediction(opt.key); } }}
            disabled={rolling}
            whileHover={rolling ? {} : { scale: 1.03 }}
            whileTap={rolling ? {} : { scale: 0.97 }}
            className={`py-3 text-xs font-serif uppercase tracking-wider border rounded-sm transition-colors flex items-center justify-center gap-1.5
              ${prediction === opt.key ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"}`}
          >
            <span className="text-sm">{opt.icon}</span>
            <span>{opt.label}</span>
            <span className="text-[#d4af3780] ml-auto text-[10px]">{opt.mult}×</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={roll}
        disabled={rolling || !prediction || balance < bet}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="casino-btn w-full py-3.5 text-sm"
      >
        {rolling ? "ROLLING..." : `ROLL (${bet} pts)`}
      </motion.button>
      <ResultBanner result={result} />
      <div className="flex justify-center gap-4 text-sm text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
    </div>
  );
}

/* ─── Ambient Lounge Particles ─── */
function LoungeParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 1 + Math.random() * 2,
    dur: 4 + Math.random() * 6,
    delay: Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0], y: [-200, -200], x: (Math.random() - 0.5) * 60 }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, bottom: "-4px", width: p.size, height: p.size, backgroundColor: "#d4af37" }}
        />
      ))}
    </div>
  );
}

/* ─── Modal ─── */
export function CasinoGames({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<Game>("slots");
  const [balance, setBalance] = useState(loadBalance);
  const [bet, setBet] = useState(10);
  const [slideDir, setSlideDir] = useState(1);

  useEffect(() => {
    const iv = setInterval(() => setBalance(b => b + POINTS_PER_SECOND), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, lastVisit: Date.now() }));
  }, [balance]);

  const clampedSetBalance = useCallback((fn: (b: number) => number) => {
    setBalance(prev => { const next = fn(prev); return next < 0 ? 0 : next; });
  }, []);

  useChipSync(clampedSetBalance);

  const games: { key: Game; label: string; icon: string }[] = [
    { key: "slots", label: "SLOTS", icon: "🎰" },
    { key: "coinflip", label: "COIN", icon: "🪙" },
    { key: "roulette", label: "ROULETTE", icon: "🎡" },
    { key: "blackjack", label: "BLACKJACK", icon: "🃏" },
    { key: "videopoker", label: "OMAHA POKER", icon: "🂡" },
    { key: "dice", label: "DICE", icon: "🎲" },
  ];

  const handleGameChange = (key: Game) => {
    const currentIdx = games.findIndex(g => g.key === active);
    const newIdx = games.findIndex(g => g.key === key);
    setSlideDir(newIdx > currentIdx ? 1 : -1);
    sfx.tick();
    setActive(key);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 22, stiffness: 280, mass: 0.8 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#0e0404] border border-[#d4af3718] rounded-lg overflow-hidden"
          style={{ boxShadow: "0 25px 80px #00000080, 0 0 60px #d4af3708, inset 0 1px 0 #d4af3710" }}
        >
          <LoungeParticles />

          <div className="relative flex items-center justify-between px-6 py-4 border-b border-[#d4af3712] bg-gradient-to-r from-[#0a0303] via-[#120606] to-[#0a0303]">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3725] to-transparent" />
            <div className="flex items-center gap-2">
              <span className="text-base">🍸</span>
              <span className="text-xs text-[#d4af37] font-serif uppercase tracking-[0.25em]">The Lounge</span>
            </div>
            <div className="flex items-center gap-4">
              <PointsBadge balance={balance} />
              <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-[#6b5e50] hover:text-[#d4af37] transition-colors">
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          <div className="relative flex border-b border-[#d4af3710] bg-[#080202]">
            {games.map(g => (
              <motion.button
                key={g.key}
                onClick={() => handleGameChange(g.key)}
                whileHover={{ backgroundColor: "rgba(212,175,55,0.04)" }}
                className={`flex-1 py-3 text-xs font-serif uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5
                  ${active === g.key ? "text-[#d4af37] border-b-2 border-[#d4af3740]" : "text-[#6b5e50] hover:text-[#a89a80]"}`}
              >
                <span className="text-sm">{g.icon}</span>
                <span className="hidden sm:inline">{g.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative p-6 min-h-[440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: slideDir * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -slideDir * 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                {active === "slots" && <SlotMachine bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "coinflip" && <CoinFlip bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "roulette" && <Roulette bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "blackjack" && <Blackjack bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "videopoker" && <VideoPoker bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "dice" && <DiceGame bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
