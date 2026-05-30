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

/* ─── Points Badge ─── */
function PointsBadge({ balance }: { balance: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#d4af37] font-serif">
      <Trophy className="h-3.5 w-3.5" />
      <span className="tabular-nums">{balance} pts</span>
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
          <button
            key={p}
            disabled={disabled || balance < p}
            onClick={() => setBet(p)}
            className={`px-2 py-0.5 text-[10px] font-serif border rounded-sm transition-colors disabled:opacity-25
              ${bet === p ? "border-[#d4af3750] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] text-[#6b5e50] hover:border-[#d4af3730]"}`}
          >{p}</button>
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
  const finalsRef = useRef<string[]>([]);
  const tickRef = useRef(0);

  const spin = useCallback(() => {
    if (spinning || balance < bet) return;
    setBalance(b => b - bet);
    setSpinning(true);
    setResult(null);
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
        if (all3) { const w = bet * 5; setBalance(b => b + w); setResult(`JACKPOT! +${w} pts`); setScore(s => ({ ...s, w: s.w + 1 })); }
        else if (all2) { const w = bet * 2; setBalance(b => b + w); setResult(`Two match! +${w} pts`); setScore(s => ({ ...s, w: s.w + 1 })); }
        else { setResult(`No luck. -${bet} pts`); setScore(s => ({ ...s, l: s.l + 1 })); }
      }
    }, 60);
  }, [spinning, bet, balance, setBalance]);

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={spinning} />
      <div className="flex justify-center gap-3">
        {reels.map((sym, i) => (
          <motion.div
            key={i}
            animate={spinning ? { y: [0, -2, 2, 0] } : {}}
            transition={{ duration: 0.06, repeat: spinning ? Infinity : 0 }}
            className="w-[72px] h-[72px] flex items-center justify-center text-4xl border border-[#d4af3715] bg-[#0a0303] rounded-sm"
          >{sym}</motion.div>
        ))}
      </div>
      <button onClick={spin} disabled={spinning || balance < bet} className="casino-btn w-full py-3">
        {spinning ? "SPINNING..." : `SPIN (${bet} pts)`}
      </button>
      {result && <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>}
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

  const flip = useCallback(() => {
    if (flipping || !prediction || balance < bet) return;
    setBalance(b => b - bet);
    setFlipping(true);
    setResult(null);
    const actual = pick(COIN_SIDES);
    const spins = 1800 + Math.floor(Math.random() * 4) * 180;
    const finalAngle = actual === "TAILS" ? spins + 180 : spins;
    setCoinRotation(prev => prev + finalAngle);
    setTimeout(() => {
      setDisplaySide(actual);
      setFlipping(false);
      const won = prediction === actual;
      if (won) { const w = bet * 2; setBalance(b => b + w); setResult(`${actual} — You called it! +${w} pts`); setScore(s => ({ ...s, w: s.w + 1 })); }
      else { setResult(`${actual} — Wrong call. -${bet} pts`); setScore(s => ({ ...s, l: s.l + 1 })); }
    }, 1800);
  }, [flipping, prediction, bet, balance, setBalance]);

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={flipping} />
      <div className="flex justify-center py-6">
        <motion.div
          animate={{ rotateY: coinRotation }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="w-24 h-24 relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-4xl border-2 border-[#d4af3720] bg-gradient-to-br from-[#2a0e0e] to-[#1a0606] rounded-full" style={{ backfaceVisibility: "hidden" }}>🪙</div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl border-2 border-[#d4af3720] bg-gradient-to-br from-[#2a0e0e] to-[#1a0606] rounded-full" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>🪙</div>
        </motion.div>
      </div>
      <div className="text-center"><span className="text-lg font-serif text-white">{displaySide}</span></div>
      <div className="flex gap-2">
        {COIN_SIDES.map(side => (
          <button key={side} onClick={() => !flipping && setPrediction(side)} disabled={flipping}
            className={`flex-1 py-2 text-xs font-serif uppercase tracking-wider border rounded-sm transition-colors
              ${prediction === side ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"}`}>
            {side}
          </button>
        ))}
      </div>
      <button onClick={flip} disabled={flipping || !prediction || balance < bet} className="casino-btn w-full py-2.5">
        {flipping ? "FLIPPING..." : `FLIP (${bet} pts)`}
      </button>
      {result && <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>}
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
  const betOptions = ["RED", "BLACK", "GREEN", "ODD", "EVEN"];
  const segAngle = 360 / ROULETTE_NUMBERS.length;

  const spin = useCallback(() => {
    if (spinning || !prediction || balance < bet) return;
    setBalance(b => b - bet);
    setSpinning(true);
    setResult(null);
    const actualNum = pick(ROULETTE_NUMBERS);
    const idx = ROULETTE_NUMBERS.indexOf(actualNum);
    const target = 360 - idx * segAngle - segAngle / 2;
    setWheelRotation(prev => prev + 5 * 360 + target);
    const isRed = RED_NUMBERS.includes(actualNum);
    const isGreen = actualNum === 0;
    const color = isGreen ? "GREEN" : isRed ? "RED" : "BLACK";
    const iv = setInterval(() => setDisplay(String(pick(ROULETTE_NUMBERS))), 80);
    setTimeout(() => {
      clearInterval(iv);
      setDisplay(String(actualNum));
      setSpinning(false);
      let won = false;
      if (prediction === "RED" && isRed) won = true;
      if (prediction === "BLACK" && !isRed && !isGreen) won = true;
      if (prediction === "GREEN" && isGreen) won = true;
      if (prediction === "ODD" && actualNum !== 0 && actualNum % 2 !== 0) won = true;
      if (prediction === "EVEN" && actualNum % 2 === 0) won = true;
      const mult = prediction === "GREEN" ? 14 : 2;
      if (won) { const w = bet * mult; setBalance(b => b + w); setResult(`${actualNum} ${color} — +${w} pts`); setScore(s => ({ ...s, w: s.w + 1 })); }
      else { setResult(`${actualNum} ${color} — -${bet} pts`); setScore(s => ({ ...s, l: s.l + 1 })); }
    }, 3500);
  }, [spinning, prediction, bet, balance, setBalance]);

  // SVG wheel
  const segments = ROULETTE_NUMBERS.map((num, i) => {
    const a = i * segAngle;
    const isRed = RED_NUMBERS.includes(num);
    const fill = num === 0 ? "#1a5c1a" : isRed ? "#8b1a1a" : "#1a1a2e";
    const s1 = ((a - 90) * Math.PI) / 180, s2 = ((a + segAngle - 90) * Math.PI) / 180;
    const r = 45;
    return <path key={num} d={`M50 50 L${50 + r * Math.cos(s1)} ${50 + r * Math.sin(s1)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(s2)} ${50 + r * Math.sin(s2)} Z`} fill={fill} stroke="#d4af3715" strokeWidth="0.2" />;
  });

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={spinning} />
      <div className="flex justify-center py-2">
        <div className="relative w-44 h-44">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#d4af37]" />
          </div>
          <motion.div animate={{ rotate: wheelRotation }} transition={{ duration: 3.5, ease: "easeOut" }}
            className="w-44 h-44 rounded-full border-2 border-[#d4af3720] overflow-hidden bg-[#0a0303]">
            <svg viewBox="0 0 100 100" className="w-full h-full">{segments}</svg>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-[#120606] border border-[#d4af3720] flex items-center justify-center">
              <span className="text-sm font-bold font-serif text-[#d4af37]">{spinning ? "…" : display}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {betOptions.map(opt => (
          <button key={opt} onClick={() => !spinning && setPrediction(opt)} disabled={spinning}
            className={`px-3 py-1.5 text-[10px] font-serif uppercase tracking-wider border rounded-sm transition-colors
              ${prediction === opt ? "border-[#d4af3740] bg-[#2a0a0a] text-[#d4af37]" : "border-[#d4af3710] bg-[#1a0606] text-[#6b5e50]"}`}>
            {opt}
          </button>
        ))}
      </div>
      <button onClick={spin} disabled={spinning || !prediction || balance < bet} className="casino-btn w-full py-2.5">
        {spinning ? "SPINNING..." : `SPIN (${bet} pts)`}
      </button>
      {result && <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>}
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

  const dealerResolve = useCallback((dHand: Hand, dDeck: Card[], pHand: Hand, totalBet: number) => {
    let dh = [...dHand], dd = [...dDeck];
    const go = () => {
      if (handValue(dh) < 17) {
        setTimeout(() => {
          dh = [...dh, dd[0]];
          dd = dd.slice(1);
          setDealerHand(dh);
          setDeck(dd);
          go();
        }, 600);
      } else {
        const pv = handValue(pHand), dv = handValue(dh);
        if (dv > 21 || pv > dv) { const w = totalBet * 2; setBalance(b => b + w); setResult(`Win! ${pv} vs ${dv}. +${w} pts`); setScore(s => ({ ...s, w: s.w + 1 })); }
        else if (dv > pv) { setResult(`Dealer wins. ${pv} vs ${dv}. -${totalBet} pts`); setScore(s => ({ ...s, l: s.l + 1 })); }
        else { setBalance(b => b + totalBet); setResult(`Push. ${pv} vs ${dv}`); setScore(s => ({ ...s, p: s.p + 1 })); }
        setPhase("done");
      }
    };
    go();
  }, [setBalance, setScore]);

  const deal = useCallback(() => {
    if (balance < bet) return;
    setBalance(b => b - bet);
    const nd = shuffleDeck(makeDeck());
    const ph = [nd.pop()!, nd.pop()!], dh = [nd.pop()!, nd.pop()!];
    setDeck(nd.slice()); setPlayerHand(ph); setDealerHand(dh); setDoubled(false); setResult(null);
    if (isBlackjack(ph)) {
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
    if (isBust(nh)) { setResult(`Bust! -${bet * 2} pts`); setScore(s => ({ ...s, l: s.l + 1 })); setPhase("done"); }
    else { setPhase("dealer"); setTimeout(() => dealerResolve(dealerHand, nd, nh, bet * 2), 100); }
  }, [phase, playerHand, deck, bet, balance, dealerHand, dealerResolve, setScore]);

  const renderCard = (card: Card, idx: number, hidden?: boolean) => {
    const red = card.suit === "♥" || card.suit === "♦";
    return (
      <motion.div key={idx} initial={{ opacity: 0, x: -16, rotateY: 90 }} animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 0.35, delay: idx * 0.12 }}
        className={`inline-block w-12 h-[52px] mx-0.5 rounded border border-[#d4af3710] flex items-center justify-center text-sm font-bold font-serif
          ${hidden ? "bg-[#2a0a0a] text-[#d4af3730]" : "bg-[#f5f0e8]"}`}
        style={{ transformStyle: "preserve-3d" }}>
        {hidden ? "✦" : <span className={red ? "text-[#8b1a1a]" : "text-[#2a1a1a]"}>{card.rank}{card.suit}</span>}
      </motion.div>
    );
  };

  const pVal = playerHand.length > 0 ? handValue(playerHand) : 0;
  const dVal = dealerHand.length > 0 ? (phase === "playing" ? dealerHand[0].value : handValue(dealerHand)) : 0;

  return (
    <div className="space-y-4">
      <BetControl bet={bet} setBet={setBet} balance={balance} disabled={false} />
      <div className="bg-[#0a0505] border border-[#d4af3710] rounded-sm p-4 space-y-4">
        <div>
          <div className="text-[10px] text-[#6b5e50] font-serif uppercase tracking-wider mb-2">Dealer ({dVal})</div>
          <div className="flex">{dealerHand.map((c, i) => renderCard(c, i, phase === "playing" && i === 1))}</div>
        </div>
        <div className="border-t border-[#d4af3710] pt-3">
          <div className="text-[10px] text-[#6b5e50] font-serif uppercase tracking-wider mb-2">You ({pVal})</div>
          <div className="flex">{playerHand.map((c, i) => renderCard(c, i))}</div>
        </div>
      </div>
      {(phase === "idle" || phase === "done") ? (
        <button onClick={deal} disabled={balance < bet} className="casino-btn w-full py-3">DEAL ({bet} pts)</button>
      ) : phase === "playing" ? (
        <div className="flex gap-2">
          <button onClick={hit} className="casino-btn flex-1 py-2.5">HIT</button>
          <button onClick={stand} className="casino-btn flex-1 py-2.5">STAND</button>
          {playerHand.length === 2 && balance >= bet && !doubled && <button onClick={doubleDown} className="casino-btn flex-1 py-2.5">2×</button>}
        </div>
      ) : null}
      {result && <p className="text-center text-sm text-[#d4af37] font-serif">{result}</p>}
      <div className="flex justify-center gap-3 text-xs text-[#6b5e50] font-serif"><span>W: {score.w}</span><span>L: {score.l}</span><span>P: {score.p}</span></div>
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

  const games: { key: Game; label: string }[] = [
    { key: "slots", label: "SLOTS" }, { key: "coinflip", label: "COIN" },
    { key: "roulette", label: "ROULETTE" }, { key: "blackjack", label: "BJ" },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#0e0404] border border-[#d4af3712] rounded-sm overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#d4af3710] bg-[#0a0303]">
            <span className="text-xs text-[#d4af37] font-serif uppercase tracking-[0.2em]">The Lounge</span>
            <div className="flex items-center gap-3">
              <PointsBadge balance={balance} />
              <button onClick={onClose} className="text-[#6b5e50] hover:text-[#d4af37] transition-colors"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex border-b border-[#d4af3710] bg-[#0a0303]">
            {games.map(g => (
              <button key={g.key} onClick={() => setActive(g.key)}
                className={`flex-1 py-2.5 text-[10px] font-serif uppercase tracking-wider transition-colors
                  ${active === g.key ? "text-[#d4af37] border-b border-[#d4af3730]" : "text-[#6b5e50] hover:text-[#a89a80]"}`}>
                {g.label}
              </button>
            ))}
          </div>
          <div className="p-5">
            {active === "slots" && <SlotMachine bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
            {active === "coinflip" && <CoinFlip bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
            {active === "roulette" && <Roulette bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
            {active === "blackjack" && <Blackjack bet={bet} setBet={setBet} balance={balance} setBalance={clampedSetBalance} />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
