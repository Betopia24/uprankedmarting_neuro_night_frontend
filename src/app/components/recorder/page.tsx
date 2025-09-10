"use client";

import { useState } from "react";
import Button from "@/components/Button";
import {
  Mic,
  Square,
  Pause,
  Trash2,
  Check,
  Upload,
  FileAudio,
} from "lucide-react";

export default function Component() {
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState("5:00");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-12 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Audio Recorder
          </h1>
          <p className="text-slate-500">
            Record your audio with professional quality
          </p>
        </div>

        {/* Recording Button */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Animated rings */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping scale-150"></div>
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping scale-125 animation-delay-300"></div>
                <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping scale-110 animation-delay-600"></div>
              </>
            )}

            {/* Main button */}
            <button
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => setIsRecording(!isRecording)}
            >
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Mic className="w-16 h-16 text-white drop-shadow-lg" />
              </div>

              {/* Recording indicator */}
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

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-3 mb-12">
          <Button
            size="lg"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 px-6"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>

          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 transition-all duration-200 px-6"
          >
            <Square className="w-4 h-4 mr-2 fill-current" />
            Stop
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all duration-200 px-6 font-mono"
          >
            <Pause className="w-4 h-4 mr-2" />
            {recordingTime}
          </Button>

          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25 transition-all duration-200 px-6"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">or</span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="text-center">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-slate-300 transition-colors duration-200 cursor-pointer group">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                <FileAudio className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-1">
                  Upload Audio File
                </p>
                <p className="text-slate-500">
                  Drag and drop your audio file here, or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Supports MP3, WAV, M4A files up to 100MB
                </p>
              </div>
              <Button className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>High-quality audio recording • Professional results</p>
      </div>
    </div>
  );
}
