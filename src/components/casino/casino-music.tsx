"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Casino lounge background music — procedurally generated smooth jazz loop.
 * Web Audio API only; no external files.
 *
 * Instruments:
 * - Warm detuned pad (2 detuned sines, slow attack)
 * - Walking bass (triangle with filter sweep)
 * - Soft piano melody (sine + triangle blend, exponential decay)
 * - Smooth drum groove (synthesized kick, snare, hi-hat)
 */

const BASE_VOL = 0.15;

// --- NOTE FREQUENCIES ---
const N = {
  G2: 98,
  A2: 110,
  Bb2: 116.54,
  C3: 130.81,
  Db3: 138.59,
  D3: 146.83,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  Gb3: 185,
  G3: 196,
  Ab3: 207.65,
  A3: 220,
  Bb3: 233.08,
  C4: 261.63,
  Db4: 277.18,
  D4: 293.66,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Gb4: 369.99,
  G4: 392,
  Ab4: 415.3,
  A4: 440,
  Bb4: 466.16,
  C5: 523.25,
  Db5: 554.37,
  D5: 587.33,
  Eb5: 622.25,
  E5: 659.26,
  F5: 698.46,
} as const;

// Chord progressions (jazz Am - Dm7 - G7 - C)
// Each chord: { root, bass, notes, extensions }
const CHORDS = [
  { root: "Am7", bass: N.A2, notes: [N.A3, N.C4, N.E4, N.G4], ext: [N.Bb4] },
  { root: "Dm7", bass: N.D3, notes: [N.D4, N.F4, N.A4, N.C5], ext: [N.Db5] },
  { root: "G7", bass: N.G2, notes: [N.G3, N.Bb3, N.D4, N.F4], ext: [N.Gb4] },
  { root: "Cmaj7", bass: N.C3, notes: [N.C4, N.E4, N.G4, N.Bb4], ext: [N.C5] },
] as const;

// Melody pattern (indices into chord notes + extensions, -1 = rest)
const MELODY: (number | null)[][] = [
  // Bar 1: Am7
  [2, null, 3, null, 4, 3, 2, null],
  // Bar 2: Dm7
  [0, null, 2, 3, 4, null, 3, 2],
  // Bar 3: G7
  [2, 3, null, 4, 3, 2, null, 0],
  // Bar 4: Cmaj7
  [3, 4, 2, null, 3, 2, 0, null],
];

// Bass walking pattern (note names mapped to frequencies)
const BASS_WALK = [
  // Bar 1: Am7
  [N.A2, N.A2, N.Bb2, N.C3, N.A2, N.A2, N.G3, N.G3],
  // Bar 2: Dm7
  [N.D3, N.D3, N.E3, N.F4, N.D3, N.D3, N.C4, N.C4],
  // Bar 3: G7
  [N.G2, N.G2, N.A2, N.Bb2, N.G2, N.G2, N.G3, N.G3],
  // Bar 4: Cmaj7
  [N.C3, N.C3, N.D3, N.Eb3, N.C3, N.C3, N.Bb2, N.Bb2],
];

export function CasinoMusic() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const playingRef = useRef(false);
  const mutedRef = useRef(false);

  // Keep mutedRef in sync
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const createKick = useCallback((ctx: AudioContext, dest: AudioNode, time: number, vol = 0.35) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(gain).connect(dest);
    osc.start(time);
    osc.stop(time + 0.3);
  }, []);

  const createSnare = useCallback((ctx: AudioContext, dest: AudioNode, time: number, vol = 0.18) => {
    // Noise component
    const bufLen = ctx.sampleRate * 0.08;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(vol, time);
    nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = "bandpass";
    nFilter.frequency.value = 3000;
    noise.connect(nFilter).connect(nGain).connect(dest);
    noise.start(time);
    noise.stop(time + 0.12);
    // Tone component
    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
    oGain.gain.setValueAtTime(vol * 0.5, time);
    oGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(oGain).connect(dest);
    osc.start(time);
    osc.stop(time + 0.1);
  }, []);

  const createHiHat = useCallback((ctx: AudioContext, dest: AudioNode, time: number, vol = 0.06) => {
    const bufLen = ctx.sampleRate * 0.04;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 8000;
    noise.connect(filter).connect(gain).connect(dest);
    noise.start(time);
    noise.stop(time + 0.05);
  }, []);

  const createPad = useCallback(
    (ctx: AudioContext, dest: AudioNode, notes: readonly number[], time: number, duration: number, vol = 0.08) => {
      notes.forEach((freq) => {
        // Two detuned oscillators per note for warmth
        [0, 0.0003].forEach((detune) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq * 0.5; // One octave down
          osc.detune.value = detune * 44000; // Subtle detune
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(vol, time + 0.5);
          gain.gain.linearRampToValueAtTime(vol * 0.8, time + duration - 0.5);
          gain.gain.linearRampToValueAtTime(0, time + duration);
          osc.connect(gain).connect(dest);
          osc.start(time);
          osc.stop(time + duration);
        });
      });
    },
    [],
  );

  const createBassNote = useCallback(
    (ctx: AudioContext, dest: AudioNode, freq: number, time: number, duration: number, vol = 0.2) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, time);
      filter.frequency.linearRampToValueAtTime(300, time + duration);
      filter.Q.value = 2;
      gain.gain.setValueAtTime(vol, time);
      gain.gain.setValueAtTime(vol, time + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0, time + duration);
      osc.connect(filter).connect(gain).connect(dest);
      osc.start(time);
      osc.stop(time + duration);
    },
    [],
  );

  const createPianoNote = useCallback(
    (ctx: AudioContext, dest: AudioNode, freq: number, time: number, duration: number, vol = 0.12) => {
      // Blend of sine and triangle for piano-like tone
      [
        { type: "sine" as OscillatorType, volFactor: 0.7 },
        { type: "triangle" as OscillatorType, volFactor: 0.3 },
      ].forEach(({ type, volFactor }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = type;
        osc.frequency.value = freq;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3000, time);
        filter.frequency.exponentialRampToValueAtTime(500, time + duration);
        gain.gain.setValueAtTime(vol * volFactor, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(filter).connect(gain).connect(dest);
        osc.start(time);
        osc.stop(time + duration + 0.1);
      });
    },
    [],
  );

  const scheduleBar = useCallback(
    (ctx: AudioContext, master: GainNode, barIndex: number, startTime: number) => {
      const bpm = 100;
      const beatDur = 60 / bpm; // 0.6s per beat
      const eighthDur = beatDur / 2; // 0.3s per eighth
      const barDur = beatDur * 8; // 4.8s per bar (8 eighth notes)
      const chordIdx = barIndex % CHORDS.length;
      const chord = CHORDS[chordIdx];
      const melody = MELODY[chordIdx];
      const bass = BASS_WALK[chordIdx];

      // Pad — full bar
      createPad(ctx, master, chord.notes, startTime, barDur, 0.06);

      // Bass — one note per eighth
      bass.forEach((freq, i) => {
        createBassNote(ctx, master, freq, startTime + i * eighthDur, eighthDur * 0.9, 0.15);
      });

      // Melody — piano
      const allNotes = [...chord.notes, ...(chord.ext ?? [])] as number[];
      melody.forEach((noteIdx, i) => {
        if (noteIdx !== null && allNotes[noteIdx]) {
          createPianoNote(ctx, master, allNotes[noteIdx], startTime + i * eighthDur, eighthDur * 1.2, 0.09);
        }
      });

      // Drums — smooth lounge groove
      // Kick on 1 and 3
      createKick(ctx, master, startTime, 0.25);
      createKick(ctx, master, startTime + beatDur * 2, 0.2);
      // Snare on 2 and 4
      createSnare(ctx, master, startTime + beatDur, 0.12);
      createSnare(ctx, master, startTime + beatDur * 3, 0.1);
      // Hi-hat on every eighth
      for (let i = 0; i < 8; i++) {
        createHiHat(ctx, master, startTime + i * eighthDur, i % 2 === 0 ? 0.05 : 0.03);
      }
    },
    [createPad, createBassNote, createPianoNote, createKick, createSnare, createHiHat],
  );

  const startMusic = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    // Master gain
    const master = ctx.createGain();
    master.gain.value = mutedRef.current ? 0 : BASE_VOL;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    const bpm = 100;
    const barDur = (60 / bpm) * 4;
    const loopBars = 8;

    let currentBar = 0;
    const scheduleNextBars = () => {
      if (!playingRef.current) return;

      const now = ctx.currentTime;
      const barStartTime = now + 0.1; // slight lookahead

      scheduleBar(ctx, master, currentBar % loopBars, barStartTime);
      currentBar++;

      if (currentBar % loopBars === 0) {
        // Loop back
        currentBar = 0;
      }

      loopTimerRef.current = setTimeout(scheduleNextBars, barDur * 1000 - 100);
    };

    playingRef.current = true;
    setPlaying(true);
    scheduleNextBars();
  }, [scheduleBar]);

  const stopMusic = useCallback(() => {
    playingRef.current = false;
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = undefined;
    }
    // Clean up audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    masterGainRef.current = null;
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [playing, startMusic, stopMusic]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(next ? 0 : BASE_VOL, audioCtxRef.current.currentTime, 0.1);
      }
      return next;
    });
  }, []);

  // Sync gain when muted state changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(muted ? 0 : BASE_VOL, audioCtxRef.current.currentTime, 0.1);
    }
  }, [muted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      playingRef.current = false;
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={togglePlay}
        className={
          "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors " +
          "text-[#d4af37] hover:bg-[#2a0a0a] border border-[#d4af3715]"
        }
        aria-label={playing ? "Pause music" : "Play casino music"}
        title={playing ? "Pause music" : "Play background music"}
      >
        {playing ? (
          <Volume2 className="h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>
      {playing && (
        <button
          onClick={toggleMute}
          className={
            "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors " +
            "text-[#d4af37] hover:bg-[#2a0a0a] border border-[#d4af3715]"
          }
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
