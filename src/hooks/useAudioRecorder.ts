"use client";

import { useState, useRef, useCallback } from "react";

export function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
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
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Audio recording failed:", err);
      alert("Microphone access denied or unavailable.");
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setAudioURL(null);
    chunks.current = [];
  }, []);

  return {
    audioBlob, // The actual Blob for upload
    audioURL, // For playback
    isRecording,
    startRecording,
    stopRecording,
    resetRecording,
  };
}

/*


"use client";

import { Mic, Square, RotateCcw } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export default function AudioRecorderComponent() {
  const {
    audioBlob,
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const uploadAudio = async () => {
    if (!audioBlob) return alert("No audio to upload!");
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) alert("Uploaded successfully!");
    else alert("Upload failed.");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      //Record Controls 
      <div className="flex gap-4">
        {!isRecording ? (
          <button onClick={startRecording} className="p-2 rounded bg-green-500 text-white">
            <Mic size={20} /> Start
          </button>
        ) : (
          <button onClick={stopRecording} className="p-2 rounded bg-red-500 text-white">
            <Square size={20} /> Stop
          </button>
        )}

        {audioURL && (
          <button onClick={resetRecording} className="p-2 rounded bg-gray-500 text-white">
            <RotateCcw size={20} /> Reset
          </button>
        )}
      </div>

      //Playback 
      {audioURL && (
        <div className="flex flex-col items-center gap-2">
          <audio controls src={audioURL} className="w-64" />
          <button
            onClick={uploadAudio}
            className="p-2 rounded bg-blue-500 text-white"
          >
            Upload to Server
          </button>
        </div>
      )}
    </div>
  );
}

*/
