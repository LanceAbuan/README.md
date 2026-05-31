"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Casino background music — procedurally generated ambient lounge loop.
 * Uses Web Audio API oscillators only; no external files required.
 *
 * Generates a smooth jazzy pad + soft piano-like arpeggio in A minor,
 * with a subtle rhythmic pulse reminiscent of a casino floor.
 */

const BASE_VOL = 0.035;

// A minor pentatonic: A B C D E G
const SCALE = [220, 246.94, 261.63, 293.66, 329.63, 392];
// Warm jazz chords (A minor, C major, F major, G major voicings)
const CHORD_PROGRESSION: number[][] = [
  [220, 261.63, 329.63], // Am
  [261.63, 329.63, 392], // C
  [174.61, 220, 261.63], // F (F3 A3 C4)
  [196, 246.94, 293.66], // G (G3 B3 D4)
];

export function CasinoMusic() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const rafRef = useRef<ReturnType<typeof setTimeout>>(0);
  const playingRef = useRef(false);

  const startMusic = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    // Master gain
    const master = ctx.createGain();
    master.gain.value = muted ? 0 : BASE_VOL;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Low-pass filter for warm pad sound
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.7;
    filter.connect(master);

    // Schedule chord loop
    let chordIndex = 0;
    const CHORD_DURATION = 3.0; // seconds per chord
    const nextNote = () => {
      if (!playingRef.current || !ctx || !master) return;

      const now = ctx.currentTime;
      const chord = CHORD_PROGRESSION[chordIndex % CHORD_PROGRESSION.length];

      // Pad layer — soft sustained chords
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * 0.5; // octave down for warmth
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.2, now + CHORD_DURATION - 0.4);
        gain.gain.linearRampToValueAtTime(0, now + CHORD_DURATION);
        osc.connect(gain).connect(filter);
        osc.start(now);
        osc.stop(now + CHORD_DURATION);
      });

      // Arpeggio — soft piano-like pluck
      chord.forEach((freq, i) => {
        const t = now + i * 0.15 + 0.2;
        if (t > now + CHORD_DURATION) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq * 2; // octave up for sparkle
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain).connect(filter);
        osc.start(t);
        osc.stop(t + 0.7);
      });

      // Subtle rhythmic pulse (hi-hat-like noise)
      for (let beat = 0; beat < 4; beat++) {
        const t = now + beat * (CHORD_DURATION / 4);
        const bufferSize = ctx.sampleRate * 0.02;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.03;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.02, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.value = 7000;
        noise.connect(noiseFilter).connect(noiseGain).connect(master);
        noise.start(t);
        noise.stop(t + 0.06);
      }

      chordIndex++;
      rafRef.current = setTimeout(nextNote, CHORD_DURATION * 1000 - 50);
    };

    playingRef.current = true;
    setPlaying(true);
    nextNote();
  }, [muted]);

  const stopMusic = useCallback(() => {
    playingRef.current = false;
    if (rafRef.current) {
      clearTimeout(rafRef.current);
      rafRef.current = 0;
    }
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
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(next ? 0 : BASE_VOL, 0, 0.1);
      }
      return next;
    });
  }, []);

  // Sync gain when muted state changes
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(muted ? 0 : BASE_VOL, 0, 0.1);
    }
  }, [muted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      playingRef.current = false;
      if (rafRef.current) clearTimeout(rafRef.current);
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
