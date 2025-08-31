"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/Button";
import {
  Mic,
  Square,
  Pause,
  Trash2,
  Check,
  Upload,
  FileAudio,
  Play,
} from "lucide-react";

export function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000
      );
    } catch (err) {
      console.error("Audio recording failed:", err);
      alert("Microphone access denied or unavailable.");
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setAudioURL(null);
    setRecordingTime(0);
    chunks.current = [];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    audioBlob,
    audioURL,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    toggleRecording,
    resetRecording,
  };
}

export function useAudioPlayer(src: string, stopRecording: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);

    audioRef.current?.pause();
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      stopRecording();
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [stopRecording]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  return { isPlaying, togglePlay, stop };
}

export default function VoiceManagement() {
  const {
    audioBlob,
    audioURL,
    isRecording,
    toggleRecording,
    stopRecording,
    resetRecording,
    recordingTime,
  } = useAudioRecorder();

  const { isPlaying, togglePlay, stop } = useAudioPlayer(
    audioURL || "",
    stopRecording
  );

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      stop(); // stop playback if playing
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Audio Recorder
        </h1>
        <p className="text-slate-500">
          Record or upload your audio with professional quality
        </p>
      </div>

      {/* Recording Button */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping scale-150"></div>
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping scale-125 animation-delay-300"></div>
              <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping scale-110 animation-delay-600"></div>
            </>
          )}
          <button
            className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={toggleRecording}
          >
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Mic className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            {isRecording && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            )}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isRecording ? "bg-red-500 animate-pulse" : "bg-slate-400"
            }`}
          ></div>
          <span className="text-sm font-medium text-slate-600">
            {isRecording ? "Recording..." : "Ready to record"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 mb-8">
        <Button
          size="lg"
          className="border-red-200 hover:border-red-300 transition-all duration-200 px-6"
          onClick={resetRecording}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>

        <Button
          size="lg"
          className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 transition-all duration-200 px-6"
          onClick={stopRecording}
        >
          <Square className="w-4 h-4 mr-2 fill-current" />
          Stop
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all duration-200 px-6 font-mono"
          onClick={togglePlay}
          disabled={!audioURL}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {recordingTime}
        </Button>

        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25 transition-all duration-200 px-6"
          disabled={!audioBlob && !uploadedFile}
        >
          <Check className="w-4 h-4 mr-2" />
          Confirm
        </Button>
      </div>

      {/* Upload */}
      <div className="text-center">
        <label
          htmlFor="file-upload"
          className="cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-slate-300 transition-colors duration-200 flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
            <FileAudio className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700 mb-1">
              Upload Audio File
            </p>
            <p className="text-slate-500">
              Drag and drop or click to select audio
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supports MP3, WAV, M4A files up to 100MB
            </p>
          </div>
          <Button className="mt-2">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleUpload}
        />

        {uploadedFile && (
          <p className="mt-4 text-sm text-slate-600">
            Selected: <span className="font-medium">{uploadedFile.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
