"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Mic, Square, Play, Pause, Check, Trash2 } from "lucide-react";
import Button from "@/components/Button";

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        chunks.current = [];
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        toast.success("Recording ready");
      };

      mediaRecorder.start();
      setRecording(true);
      toast.info("Recording started");
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Record Audio</h2>
        <p className="text-slate-500">Use your microphone to capture audio</p>
      </div>

      {/* Record Controls */}
      <div className="flex flex-col items-center space-y-6">
        {!recording ? (
          <Button
            onClick={startRecording}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg hover:scale-105 transition"
          >
            <Mic className="w-8 h-8" />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-black text-white shadow-lg animate-pulse"
          >
            <Square className="w-8 h-8" />
          </Button>
        )}

        {/* Preview */}
        {audioUrl && (
          <div className="flex flex-col items-center gap-4">
            <audio ref={audioRef} controls src={audioUrl} className="w-64" />
            <div className="flex gap-3">
              <Button
                className="bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/30"
                onClick={() => toast.success("Confirmed!")}
              >
                <Check className="w-4 h-4 mr-2" /> Confirm
              </Button>
              <Button
                className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                onClick={clearRecording}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
