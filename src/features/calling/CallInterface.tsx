"use client";

import React from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOff,
  PhoneCall,
  MessageCircle,
  User,
  Mic,
  MicOff,
  Clock,
  Settings,
  Volume2,
} from "lucide-react";

// 🔹 Define call state types
type CallStateNone = {
  state: "none";
};

type CallStateIncoming = {
  state: "incoming";
  from: string;
  call?: { ignore: () => void };
};

type CallQuality = "excellent" | "good" | "fair" | "poor";

type CallStateActive = {
  state: "active";
  from: string;
  duration: number; // in seconds
  quality: CallQuality;
};

type CallState = CallStateNone | CallStateIncoming | CallStateActive;

// 🔹 Define props
type Props = {
  callState: CallState;
  connectionState: {
    device: "registered" | "unregistered" | "error";
    isHealthy: boolean;
    lastHeartbeat?: number;
  };
  audioState: {
    inputLevel: number;
    outputLevel: number;
    isMuted: boolean;
  };
  identity: string;
  statusMessage: string;
  showSettings: boolean;

  // Actions
  connectWebSocket: () => void;
  registerDevice: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  setShowSettings: (value: boolean) => void;
};

// ✅ Helper to format duration
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function CallInterface({
  callState,
  connectionState,
  audioState,
  identity,
  statusMessage,
  showSettings,
  connectWebSocket,
  registerDevice,
  acceptCall,
  rejectCall,
  endCall,
  toggleMute,
  setShowSettings,
}: Props) {
  if (callState.state === "none") {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            {/* TODO: Replace with your actual ConnectionStatusIndicator */}
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          </div>
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Phone className="w-8 h-8 text-slate-400" />
            {connectionState.isHealthy && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready for Calls
          </h3>
          <p className="text-slate-400 mb-4">Agent: {identity}</p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-500">
              Status:{" "}
              <span
                className={`font-medium ${
                  connectionState.device === "registered"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {statusMessage}
              </span>
            </p>
            {connectionState.lastHeartbeat && (
              <p className="text-slate-500">
                Last ping:{" "}
                {new Date(connectionState.lastHeartbeat).toLocaleTimeString()}
              </p>
            )}
            {!connectionState.isHealthy && (
              <button
                onClick={() => {
                  connectWebSocket();
                  registerDevice();
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Reconnect
              </button>
            )}
          </div>
          {audioState.inputLevel > 0.1 && (
            <div className="mt-6">
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(audioState.inputLevel * 100, 100)}%`,
                  }}
                  className="h-full bg-green-400 transition-all duration-100 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Microphone Active</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (callState.state === "incoming") {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 animate-pulse" />
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="text-sm font-medium text-green-400 mb-2 flex items-center justify-center gap-2">
              <PhoneIncoming className="w-4 h-4 animate-bounce" />
              Incoming Call
            </div>
          </div>
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <User className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {callState.from}
            </h2>
            <p className="text-slate-400 text-sm">Incoming Voice Call</p>
          </div>
          <div className="flex justify-center items-center gap-6 mb-6">
            <button
              onClick={rejectCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Reject call"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={acceptCall}
              className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse"
              aria-label="Accept call"
            >
              <PhoneCall className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => callState.call?.ignore()}
              className="w-16 h-16 bg-slate-600 hover:bg-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Ignore call"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </button>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <span className="w-16 text-center">Decline</span>
            <span className="w-20 text-center font-medium text-green-400">
              Answer
            </span>
            <span className="w-16 text-center">Ignore</span>
          </div>
        </div>
      </div>
    );
  }

  if (callState.state === "active") {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-400 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Call Active
              <div
                className={`w-2 h-2 rounded-full ${
                  callState.quality === "excellent"
                    ? "bg-green-400"
                    : callState.quality === "good"
                    ? "bg-yellow-400"
                    : callState.quality === "fair"
                    ? "bg-orange-400"
                    : "bg-red-400"
                }`}
              />
            </div>
            <div className="text-2xl font-mono text-white flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              {formatTime(callState.duration)}
            </div>
          </div>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">
              {callState.from}
            </h2>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <span>Connected</span>
              {callState.quality !== "excellent" && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    callState.quality === "good"
                      ? "bg-yellow-900/50 text-yellow-300"
                      : callState.quality === "fair"
                      ? "bg-orange-900/50 text-orange-300"
                      : "bg-red-900/50 text-red-300"
                  }`}
                >
                  {callState.quality} quality
                </span>
              )}
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                audioState.isMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
              aria-label={audioState.isMuted ? "Unmute" : "Mute"}
            >
              {audioState.isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="End call"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-14 h-14 bg-slate-600 hover:bg-slate-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-xs text-slate-400 w-14 text-center">
              {audioState.isMuted ? "Unmute" : "Mute"}
            </span>
            <span className="text-xs text-slate-400 w-16 text-center">
              End Call
            </span>
            <span className="text-xs text-slate-400 w-14 text-center">
              Settings
            </span>
          </div>
          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <Volume2 className="w-3 h-3" />
                Audio Quality: {callState.quality}
              </span>
              {audioState.isMuted && (
                <span className="flex items-center gap-1 text-red-400">
                  <MicOff className="w-3 h-3" />
                  Muted
                </span>
              )}
            </div>
            {(audioState.inputLevel > 0 || audioState.outputLevel > 0) && (
              <div className="space-y-2">
                {audioState.inputLevel > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Input</span>
                      <span>{Math.round(audioState.inputLevel * 100)}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.min(
                            audioState.inputLevel * 100,
                            100
                          )}%`,
                        }}
                        className="h-full bg-green-400 transition-all duration-100 rounded-full"
                      />
                    </div>
                  </div>
                )}
                {audioState.outputLevel > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Output</span>
                      <span>{Math.round(audioState.outputLevel * 100)}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.min(
                            audioState.outputLevel * 100,
                            100
                          )}%`,
                        }}
                        className="h-full bg-blue-400 transition-all duration-100 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
