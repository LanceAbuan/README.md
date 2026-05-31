"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";

/* ─── Types ─── */
type Game = "slots" | "coinflip" | "roulette" | "blackjack";
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

/* ─── Confetti Burst ─── */
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360;
    const dist = 40 + Math.random() * 60;
    const dx = Math.cos((angle * Math.PI) / 180) * dist;
    const dy = Math.sin((angle * Math.PI) / 180) * dist;
    const color = pick(["#d4af37", "#f5f0e8", "#8b1a1a", "#fff"]);
    return (
      <motion.div
        key={i}
        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        animate={{ opacity: 0, scale: 0, x: dx, y: dy }}
        transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
    );
  });
  return <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">{particles}</div>;
}

/* ─── Points Badge ─── */
function PointsBadge({ balance }: { balance: number }) {
  const prev = useRef(balance);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (balance > prev.current) { setPulse(true); prev.current = balance; const t = setTimeout(() => setPulse(false), 300); return () => clearTimeout(t); }
    prev.current = balance;
  }, [balance]);

  return (
    <div className="flex items-center gap-2 text-xs text-[#d4af37] font-serif">
      <Trophy className="h-3.5 w-3.5" />
      <motion.span className="tabular-nums" animate={pulse ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
        {balance} pts
      </motion.span>
    </div>
  );
}

/* ─── Betting Control ─── */
function BetControl({ bet, setBet, balance, disabled }: { bet: number; setBet: (v: number) => void; balance: number; disabled: boolean }) {
  const presets = [5, 10, 25, 50, 100];
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] text-[#6b5e50] font-serif uppercase tracking-wider shrink-0">Bet:</span>
      <div className="flex gap-1">
        {presets.map(p => (
          <motion.button
            key={p}
            disabled={disabled || balance < p}
            onClick={() => setBet(p)}
            whileHover={disabled ? {} : { scale: 1.08 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={`px-2 py-0.5 text-[10px] font-serif border rounded-sm transition-colors disabled:opacity-25
              ${bet === p ? "border-[#d4af3750] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] text-[#6b5e50] hover:border-[#d4af3730]"}`}
          >{p}</motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── Slot Machine ─── */
function SlotMachine({ bet, setBet, balance, setBalance }: { bet: number; setBet: (v: number) => void; balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [reels, setReels] = useState(["♠", "♥", "♦"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ w: 0, l: 0 });
  const [won, setWon] = useState(false);
  const finalsRef = useRef<string[]>([]);
  const tickRef = useRef(0);

  const spin = useCallback(() => {
    if (spinning || balance < bet) return;
    setBalance(b => b - bet);
    setSpinning(true);
    setResult(null);
    setWon(false);
    tickRef.current = 0;
    finalsRef.current = [pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS), pick(SLOT_SYMBOLS)];

    const iv = setInterval(() => {
      tickRef.current++;
      const t = tickRef.current;
      setReels(prev => {
        const next = [...prev];
        for (let r = 0; r < 3; r++) {
          next[r] = t < 15 + r * 10 ? pick(SLOT_SYMBOLS) : finalsRef.current[r];
        }
        return next;
      });
      if (t >= 35) {
        clearInterval(iv);
        setSpinning(false);
        const f = finalsRef.current;
        const all3 = f[0] === f[1] && f[1] === f[2];
        const all2 = f[0] === f[1] || f[1] === f[2] || f[0] === f[2];
        if (all3) { const w = bet * 5; setBalance(b => b + w); setResult(`JACKPOT! +${w} pts`); setWon(true); setScore(s => ({ ...s, w: s.w + 1 })); }
        else if (all2) { const w = bet * 2; setBalance(b => b + w); setResult(`Two match! +${w} pts`); setWon(true); setScore(s => ({ ...s, w: s.w + 1 })); }
        else { setResult(`No luck. -${bet} pts`); setScore(s => ({ ...s, l: s.l + 1 })); }
      }
    }, 55);
  }, [spinning, bet, balance, setBalance]);

  useEffect(() => { setWon(false); }, [result]);

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={spinning} />

      {/* Machine frame */}
      <div className="relative bg-gradient-to-b from-[#1a0808] to-[#0a0303] border border-[#d4af3715] rounded-md p-5 overflow-hidden">
        <ConfettiBurst active={won} />
        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3730] to-transparent" />

        <div className="flex justify-center gap-3">
          {reels.map((sym, i) => {
            const reelDelay = [0, 200, 400];
            const isStopping = spinning && (i === 0 && tickRef.current >= 15) || (i === 1 && tickRef.current >= 25) || (i === 2 && tickRef.current >= 35);
            return (
              <motion.div
                key={i}
                animate={
                  !spinning
                    ? won ? { scale: [1, 1.1, 1], transition: { duration: 0.3, repeat: 2, repeatDelay: 0.1 } } : {}
                    : { y: [0, -4, 4, 0] }
                }
                transition={!spinning ? {} : { duration: 0.055, repeat: Infinity, delay: reelDelay[i] / 1000 }}
                className="w-[76px] h-[80px] flex items-center justify-center text-5xl border border-[#d4af3715] bg-[#060202] rounded-sm relative overflow-hidden"
              >
                {/* Blur overlay during spin for motion effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-[#0a0303]/50 via-transparent to-[#0a0303]/50"
                  animate={{ opacity: spinning ? 0.6 : 0 }}
                />
                <motion.span
                  key={`${sym}-${i}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative z-10"
                >
                  {sym}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button
        onClick={spin}
        disabled={spinning || balance < bet}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="casino-btn w-full py-3"
      >
        {spinning ? "SPINNING..." : `SPIN (${bet} pts)`}
      </motion.button>
      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-[#d4af37] font-serif"
          >{result}</motion.p>
        )}
      </AnimatePresence>
      <div className="flex justify-center gap-4 text-xs text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
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

  const flip = useCallback(() => {
    if (flipping || !prediction || balance < bet) return;
    setBalance(b => b - bet);
    setFlipping(true);
    setResult(null);
    setWon(false);
    const actual = pick(COIN_SIDES);
    const spins = 1800 + Math.floor(Math.random() * 4) * 180;
    const finalAngle = actual === "TAILS" ? spins + 180 : spins;
    setCoinRotation(prev => prev + finalAngle);
    setTimeout(() => {
      setDisplaySide(actual);
      setFlipping(false);
      const win = prediction === actual;
      if (win) {
        setWon(true);
        const w = bet * 2;
        setBalance(b => b + w);
        setResult(`${actual} — You called it! +${w} pts`);
        setScore(s => ({ ...s, w: s.w + 1 }));
      } else {
        setResult(`${actual} — Wrong call. -${bet} pts`);
        setScore(s => ({ ...s, l: s.l + 1 }));
      }
    }, 2200);
  }, [flipping, prediction, bet, balance, setBalance]);

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={flipping} />

      <div className="relative flex justify-center py-6" style={{ perspective: "600px" }}>
        <ConfettiBurst active={won} />
        <motion.div
          animate={{ rotateY: coinRotation, scale: flipping ? 1.15 : 1 }}
          transition={{ duration: 2.2, ease: [0.15, 0.8, 0.3, 1] }}
          className="w-28 h-28 relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Heads */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center border-2 border-[#d4af3740] bg-gradient-to-br from-[#3a1a1a] via-[#2a0e0e] to-[#1a0606] rounded-full shadow-lg"
            style={{ backfaceVisibility: "hidden", boxShadow: "0 0 20px #d4af3715, inset 0 1px 0 #d4af3720" }}
          >
            <span className="text-3xl">🪙</span>
            <span className="text-[9px] text-[#d4af37] font-serif uppercase tracking-wider mt-1">Heads</span>
          </motion.div>
          {/* Tails */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center border-2 border-[#d4af3740] bg-gradient-to-br from-[#1a1a2e] via-[#12122a] to-[#0a0a1a] rounded-full shadow-lg"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "0 0 20px #d4af3715, inset 0 1px 0 #d4af3720" }}
          >
            <span className="text-3xl">🪙</span>
            <span className="text-[9px] text-[#d4af37] font-serif uppercase tracking-wider mt-1">Tails</span>
          </motion.div>
        </motion.div>
        {/* Ground shadow */}
        <motion.div
          animate={{ scale: flipping ? [1, 0.5, 1] : 1, opacity: flipping ? [0.5, 0.1, 0.5] : 0.5 }}
          transition={{ duration: 2.2, ease: [0.15, 0.8, 0.3, 1] }}
          className="absolute bottom-4 w-20 h-3 bg-[#d4af3710] rounded-full blur-sm"
        />
      </div>

      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-sm text-[#d4af37] font-serif"
          >{result}</motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        {COIN_SIDES.map(side => (
          <motion.button
            key={side}
            onClick={() => !flipping && setPrediction(side)}
            disabled={flipping}
            whileHover={flipping ? {} : { scale: 1.03 }}
            whileTap={flipping ? {} : { scale: 0.97 }}
            className={`flex-1 py-2 text-xs font-serif uppercase tracking-wider border rounded-sm transition-colors
              ${prediction === side ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"}`}
          >{side}</motion.button>
        ))}
      </div>
      <motion.button
        onClick={flip}
        disabled={flipping || !prediction || balance < bet}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="casino-btn w-full py-2.5"
      >
        {flipping ? "FLIPPING..." : `FLIP (${bet} pts)`}
      </motion.button>
      <div className="flex justify-center gap-4 text-xs text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
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
  const betOptions = ["RED", "BLACK", "GREEN", "ODD", "EVEN"];
  const segAngle = 360 / ROULETTE_NUMBERS.length;

  const spin = useCallback(() => {
    if (spinning || !prediction || balance < bet) return;
    setBalance(b => b - bet);
    setSpinning(true);
    setResult(null);
    setWon(false);
    const actualNum = pick(ROULETTE_NUMBERS);
    const idx = ROULETTE_NUMBERS.indexOf(actualNum);
    const target = 360 - idx * segAngle - segAngle / 2;
    setWheelRotation(prev => prev + 5 * 360 + target);
    // Ball spins opposite direction
    setBallAngle(prev => prev - (6 * 360 + target));
    const isRed = RED_NUMBERS.includes(actualNum);
    const isGreen = actualNum === 0;
    const color = isGreen ? "GREEN" : isRed ? "RED" : "BLACK";

    // Rapid number flash
    const iv = setInterval(() => setDisplay(String(pick(ROULETTE_NUMBERS))), 70);
    setTimeout(() => {
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
        const w = bet * mult;
        setBalance(b => b + w);
        setResult(`${actualNum} ${color} — +${w} pts`);
        setScore(s => ({ ...s, w: s.w + 1 }));
      } else {
        setResult(`${actualNum} ${color} — -${bet} pts`);
        setScore(s => ({ ...s, l: s.l + 1 }));
      }
    }, 3500);
  }, [spinning, prediction, bet, balance, setBalance]);

  // SVG wheel segments
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

      <div className="relative flex justify-center py-3">
        <ConfettiBurst active={won} />
        <div className="relative w-48 h-48">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[12px] border-t-[#d4af37]" />
          </div>
          {/* Wheel */}
          <motion.div
            animate={{ rotate: wheelRotation }}
            transition={{ duration: 3.5, ease: [0.15, 0.85, 0.3, 1] }}
            className="w-48 h-48 rounded-full border-2 border-[#d4af3725] overflow-hidden bg-[#0a0303] shadow-lg"
            style={{ boxShadow: "0 0 30px #d4af370a, inset 0 0 20px #00000040" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">{segments}</svg>
          </motion.div>
          {/* Ball */}
          <motion.div
            animate={{ rotate: ballAngle }}
            transition={{ duration: 3.5, ease: [0.15, 0.85, 0.3, 1] }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute w-2.5 h-2.5 bg-gradient-to-br from-white to-[#ccc] rounded-full shadow-md"
              style={{ top: "6px", left: "50%", transform: "translateX(-50%)" }}
            />
          </motion.div>
          {/* Center hub */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={won ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5, repeat: won ? 2 : 0 }}
              className="w-10 h-10 rounded-full bg-[#120606] border border-[#d4af3725] flex items-center justify-center"
            >
              <span className="text-sm font-bold font-serif text-[#d4af37]">{spinning ? "…" : display}</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap justify-center">
        {betOptions.map(opt => {
          const colorMap: Record<string, string> = { RED: "text-[#c0392b]", BLACK: "text-[#555]", GREEN: "text-[#27ae60]" };
          return (
            <motion.button
              key={opt}
              onClick={() => !spinning && setPrediction(opt)}
              disabled={spinning}
              whileHover={spinning ? {} : { scale: 1.06 }}
              whileTap={spinning ? {} : { scale: 0.95 }}
              className={`px-3 py-1.5 text-[10px] font-serif uppercase tracking-wider border rounded-sm transition-colors
                ${prediction === opt ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : `border-[#d4af3710] bg-[#1a0606] ${colorMap[opt] || "text-[#6b5e50]"}`}`}
            >{opt}</motion.button>
          );
        })}
      </div>
      <motion.button
        onClick={spin}
        disabled={spinning || !prediction || balance < bet}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="casino-btn w-full py-2.5"
      >
        {spinning ? "SPINNING..." : `SPIN (${bet} pts)`}
      </motion.button>
      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-sm text-[#d4af37] font-serif"
          >{result}</motion.p>
        )}
      </AnimatePresence>
      <div className="flex justify-center gap-4 text-xs text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span></div>
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
  const [lastCardIdx, setLastCardIdx] = useState(0);

  const dealerResolve = useCallback((dHand: Hand, dDeck: Card[], pHand: Hand, totalBet: number) => {
    let dh = [...dHand], dd = [...dDeck];
    const go = () => {
      if (handValue(dh) < 17) {
        setTimeout(() => {
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
          setBalance(b => b + w);
          setResult(`Win! ${pv} vs ${dv}. +${w} pts`);
          setScore(s => ({ ...s, w: s.w + 1 }));
        } else if (dv > pv) {
          setResult(`Dealer wins. ${pv} vs ${dv}. -${totalBet} pts`);
          setScore(s => ({ ...s, l: s.l + 1 }));
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
    setBalance(b => b - bet);
    setWon(false);
    const nd = shuffleDeck(makeDeck());
    const ph = [nd.pop()!, nd.pop()!], dh = [nd.pop()!, nd.pop()!];
    setDeck(nd.slice()); setPlayerHand(ph); setDealerHand(dh); setDoubled(false); setResult(null);
    setLastCardIdx(0);
    if (isBlackjack(ph)) {
      setWon(true);
      const w = bet + Math.floor(bet * 1.5);
      setBalance(b => b + w);
      setResult(`BLACKJACK! +${w} pts`);
      setScore(s => ({ ...s, w: s.w + 1 }));
      setPhase("done");
    } else if (isBlackjack(dh)) {
      setResult(`Dealer BJ. -${bet} pts`);
      setScore(s => ({ ...s, l: s.l + 1 }));
      setPhase("done");
    } else if (isBust(ph)) {
      setResult(`Bust! -${bet} pts`);
      setScore(s => ({ ...s, l: s.l + 1 }));
      setPhase("done");
    } else {
      setPhase("playing");
    }
  }, [bet, balance, setBalance, setScore]);

  const hit = useCallback(() => {
    if (phase !== "playing") return;
    const card = deck[0], nd = deck.slice(1);
    const nh = [...playerHand, card];
    setDeck(nd); setPlayerHand(nh);
    setLastCardIdx(playerHand.length);
    if (isBust(nh)) { setResult(`Bust! -${doubled ? bet * 2 : bet} pts`); setScore(s => ({ ...s, l: s.l + 1 })); setPhase("done"); }
  }, [phase, deck, playerHand, bet, doubled, setScore]);

  const stand = useCallback(() => {
    if (phase !== "playing") return;
    setPhase("dealer");
    dealerResolve(dealerHand, deck, playerHand, doubled ? bet * 2 : bet);
  }, [phase, dealerHand, deck, playerHand, bet, doubled, dealerResolve]);

  const doubleDown = useCallback(() => {
    if (phase !== "playing" || playerHand.length !== 2 || balance < bet) return;
    setBalance(b => b - bet);
    setDoubled(true);
    const card = deck[0], nd = deck.slice(1);
    const nh = [...playerHand, card];
    setDeck(nd); setPlayerHand(nh);
    setLastCardIdx(playerHand.length);
    if (isBust(nh)) { setResult(`Bust! -${bet * 2} pts`); setScore(s => ({ ...s, l: s.l + 1 })); setPhase("done"); }
    else { setPhase("dealer"); setTimeout(() => dealerResolve(dealerHand, nd, nh, bet * 2), 100); }
  }, [phase, playerHand, deck, bet, balance, dealerHand, dealerResolve, setScore]);

  const renderCard = (card: Card, idx: number, hidden?: boolean) => {
    const red = card.suit === "♥" || card.suit === "♦";
    const isLast = idx === lastCardIdx && !hidden;
    return (
      <motion.div
        key={idx}
        initial={isLast ? { opacity: 0, x: -20, rotateY: 90, scale: 0.8 } : {}}
        animate={isLast ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: idx * 0.1, type: "spring", damping: 18 }}
        whileHover={{ y: -4, transition: { duration: 0.15 } }}
        className={`inline-block w-14 h-[60px] mx-0.5 rounded-md border flex flex-col items-center justify-center font-bold font-serif relative
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
            <span className={`text-xs leading-none ${red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}`}>
              {card.rank}
            </span>
            <span className={`text-sm leading-none ${red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}`}>
              {card.suit}
            </span>
          </>
        )}
      </motion.div>
    );
  };

  const pVal = playerHand.length > 0 ? handValue(playerHand) : 0;
  const dVal = dealerHand.length > 0 ? (phase === "playing" ? dealerHand[0].value : handValue(dealerHand)) : 0;

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={phase === "playing" || phase === "dealer"} />

      <div className="relative bg-gradient-to-b from-[#0e0606] to-[#060202] border border-[#d4af3710] rounded-md p-4 space-y-4 overflow-hidden">
        <ConfettiBurst active={won} />
        {/* Felt texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,#d4af37_0%,transparent_70%)] pointer-events-none" />

        {/* Dealer hand */}
        <div className="relative">
          <div className="text-[10px] text-[#6b5e50] font-serif uppercase tracking-wider mb-2">Dealer <span className="text-[#d4af37]">({dVal})</span></div>
          <div className="flex flex-wrap min-h-[60px]">{dealerHand.map((c, i) => renderCard(c, i, phase === "playing" && i === 1))}</div>
        </div>

        <div className="border-t border-[#d4af3710] pt-3" />

        {/* Player hand */}
        <div className="relative">
          <div className="text-[10px] text-[#6b5e50] font-serif uppercase tracking-wider mb-2">You <span className="text-[#d4af37]">({pVal})</span></div>
          <div className="flex flex-wrap min-h-[60px]">{playerHand.map((c, i) => renderCard(c, i))}</div>
        </div>
      </div>

      {(phase === "idle" || phase === "done") ? (
        <motion.button onClick={deal} disabled={balance < bet} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="casino-btn w-full py-3">
          DEAL ({bet} pts)
        </motion.button>
      ) : phase === "playing" ? (
        <div className="flex gap-2">
          <motion.button onClick={hit} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="casino-btn flex-1 py-2.5">HIT</motion.button>
          <motion.button onClick={stand} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="casino-btn flex-1 py-2.5">STAND</motion.button>
          {playerHand.length === 2 && balance >= bet && !doubled && (
            <motion.button onClick={doubleDown} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="casino-btn flex-1 py-2.5">2×</motion.button>
          )}
        </div>
      ) : null}

      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-sm text-[#d4af37] font-serif"
          >{result}</motion.p>
        )}
      </AnimatePresence>
      <div className="flex justify-center gap-3 text-xs text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span><span>P: {score.p}</span></div>
    </div>
  );
}

/* ─── Ambient Lounge Particles ─── */
function LoungeParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    dur: 4 + Math.random() * 6,
    delay: Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: p.y * 100, x: 0 }}
          animate={{ opacity: [0, 0.15, 0], y: p.y * 100 - 200, x: (Math.random() - 0.5) * 60 }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-4px",
            width: p.size,
            height: p.size,
            backgroundColor: "#d4af37",
          }}
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

  // Earn 1 pt/sec
  useEffect(() => {
    const iv = setInterval(() => setBalance(b => b + POINTS_PER_SECOND), 1000);
    return () => clearInterval(iv);
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, lastVisit: Date.now() }));
  }, [balance]);

  const clampedSetBalance = useCallback((fn: (b: number) => number) => {
    setBalance(prev => { const next = fn(prev); return next < 0 ? 0 : next; });
  }, []);

  const games: { key: Game; label: string; icon: string }[] = [
    { key: "slots", label: "SLOTS", icon: "🎰" },
    { key: "coinflip", label: "COIN", icon: "🪙" },
    { key: "roulette", label: "ROULETTE", icon: "🎡" },
    { key: "blackjack", label: "BLACKJACK", icon: "🃏" },
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
        {/* Backdrop with subtle animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 22, stiffness: 280, mass: 0.8 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0e0404] border border-[#d4af3718] rounded-lg overflow-hidden"
          style={{ boxShadow: "0 25px 80px #00000080, 0 0 60px #d4af3708, inset 0 1px 0 #d4af3710" }}
        >
          <LoungeParticles />

          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-4 border-b border-[#d4af3712] bg-gradient-to-r from-[#0a0303] via-[#120606] to-[#0a0303]">
            {/* Gold accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af3725] to-transparent" />
            <div className="flex items-center gap-2">
              <span className="text-base">🍸</span>
              <span className="text-xs text-[#d4af37] font-serif uppercase tracking-[0.25em]">The Lounge</span>
            </div>
            <div className="flex items-center gap-4">
              <PointsBadge balance={balance} />
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-[#6b5e50] hover:text-[#d4af37] transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative flex border-b border-[#d4af3710] bg-[#080202]">
            {games.map(g => (
              <motion.button
                key={g.key}
                onClick={() => setActive(g.key)}
                whileHover={{ backgroundColor: "rgba(212,175,55,0.04)" }}
                className={`flex-1 py-3 text-[10px] font-serif uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5
                  ${active === g.key ? "text-[#d4af37] border-b-2 border-[#d4af3740]" : "text-[#6b5e50] hover:text-[#a89a80]"}`}
              >
                <span className="text-sm">{g.icon}</span>
                <span>{g.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Game content */}
          <div className="relative p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {active === "slots" && <SlotMachine bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "coinflip" && <CoinFlip bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "roulette" && <Roulette bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
                {active === "blackjack" && <Blackjack bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
