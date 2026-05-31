"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Casino background music — real MP3 file, no procedural synthesis.
 */

export function CasinoMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/casino-lounge.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — user needs to click again
      });
      setPlaying(true);
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    setMuted(next);
  }, [muted]);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={togglePlay}
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors text-[#d4af37] hover:bg-[#2a0a0a] border border-[#d4af3715]"
        aria-label={playing ? "Pause music" : "Play music"}
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
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors text-[#d4af37] hover:bg-[#2a0a0a] border border-[#d4af3715]"
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
