"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2, Download } from "lucide-react";
import { env } from "@/env";

interface PlayCallRecordProps {
  sid?: string;
  callTime?: string; // optional display
}

export default function PlayCallRecord({ sid, callTime }: PlayCallRecordProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!sid) {
    return <span className="text-xs text-gray-400">No recording</span>;
  }

  const url = `${env.NEXT_PUBLIC_API_URL}/call-logs/recordings/play/${sid}`;

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio play error:", err);
      setError("Playback not supported");
    } finally {
      setIsLoading(false);
    }
  };

  // wavy animation while playing
  useEffect(() => {
    if (!isPlaying) {
      setAnimationStep(0);
      return;
    }
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const waves = ["▁", "▃", "▄", "▅"];
  const waveDisplay = isPlaying ? waves[animationStep] : "▁▁▁▁";

  return (
    <div className="flex items-center gap-2 text-xs whitespace-nowrap">
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center w-6 h-6"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin text-gray-600" />
        ) : isPlaying ? (
          <Pause className="w-3 h-3 text-gray-700" />
        ) : (
          <Play className="w-3 h-3 text-gray-700" />
        )}
      </button>

      <span className="font-mono text-green-600">{waveDisplay}</span>

      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setIsPlaying(false)}
        onError={() => setError("Recording not available")}
        preload="none"
      />

      {error && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:underline flex items-center gap-1"
          title="Download recording"
        >
          <Download className="w-3 h-3" />
          Retry
        </a>
      )}

      {callTime && !error && (
        <span className="text-gray-500 ml-1">{callTime}</span>
      )}
    </div>
  );
}
