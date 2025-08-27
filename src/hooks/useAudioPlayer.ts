"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useAudioPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize and clean up
  useEffect(() => {
    audioRef.current = new Audio(src);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Stop playback and reset
  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  return { isPlaying, togglePlay, stop };
}

/*


"use client";

import { Play, Pause, Square } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function AudioPlayer() {
  const { isPlaying, togglePlay, stop } = useAudioPlayer("/sample.mp3");

  return (
    <div className="flex items-center gap-3">
      <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </button>
      <button onClick={stop} aria-label="Stop">
        <Square size={28} />
      </button>
    </div>
  );
}

*/
