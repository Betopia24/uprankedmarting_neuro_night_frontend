"use client";

import { Mic, MicOff, Keyboard, Phone } from "lucide-react";
import { useState } from "react";

export default function Component() {
  const [isRecording, setIsRecording] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleRecordClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsRecording(!isRecording);

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
      </div>

      <div className="flex flex-col items-center space-y-12 relative z-10">
        {/* Status Text */}
        <div className="text-center space-y-2 transition-all duration-500 ease-out">
          <h1
            className={`text-4xl font-bold transition-all duration-500 ease-out ${
              isRecording ? "text-red-400 animate-pulse-soft" : "text-white"
            }`}
          >
            {isRecording ? "Recording..." : "Ready to Record"}
          </h1>
          <p
            className={`text-lg transition-all duration-500 ease-out ${
              isRecording ? "text-red-300" : "text-gray-300"
            }`}
          >
            {isRecording
              ? "Tap to stop recording"
              : "Tap the microphone to start"}
          </p>
        </div>

        {/* Main Recording Button */}
        <div className="relative">
          {/* Outer animated rings */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping-smooth opacity-20">
                <div className="w-64 h-64 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
              </div>
              <div className="absolute inset-4 rounded-full animate-ping-smooth-delayed opacity-30">
                <div className="w-56 h-56 rounded-full bg-gradient-to-r from-red-400 to-pink-400"></div>
              </div>
            </>
          )}

          {/* Main button */}
          <button
            onClick={handleRecordClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-64 h-64 rounded-full overflow-hidden transition-all duration-300 ease-out
              ${
                isRecording
                  ? "bg-gradient-to-r from-red-500 via-red-400 to-pink-500 shadow-2xl shadow-red-500/30"
                  : "bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 shadow-2xl shadow-purple-500/25"
              }
              ${isHovered ? "scale-105 shadow-3xl" : "scale-100"}
              backdrop-blur-sm border border-white/10
              active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/30`}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            {/* Ripple effects */}
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
                style={{
                  left: ripple.x - 50,
                  top: ripple.y - 50,
                  width: 100,
                  height: 100,
                }}
              />
            ))}

            {/* Inner circle */}
            <div
              className={`absolute inset-6 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                isRecording
                  ? "bg-gradient-to-r from-red-400 to-pink-400"
                  : "bg-gradient-to-r from-pink-400 to-violet-400"
              }`}
            >
              <Mic
                className={`w-20 h-20 text-white transition-all duration-300 ease-out ${
                  isRecording ? "animate-bounce-soft" : ""
                } ${isHovered ? "scale-110" : "scale-100"}`}
                strokeWidth={1.5}
              />
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute -top-3 -right-3 animate-pulse-soft">
                <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg shadow-red-500/50 border-2 border-white"></div>
              </div>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-8">
          {[
            { icon: MicOff, label: "Mute", color: "hover:bg-red-500/20" },
            {
              icon: Keyboard,
              label: "Keyboard",
              color: "hover:bg-gray-500/20",
            },
            { icon: Phone, label: "Call", color: "hover:bg-green-500/20" },
          ].map(({ icon: Icon, label, color }, index) => (
            <div key={label} className="relative group">
              <button
                className={`w-18 h-18 bg-white/10 backdrop-blur-md border border-white/20 
                  rounded-3xl transition-all duration-300 ease-out hover:scale-110 active:scale-95
                  shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20
                  ${color} flex items-center justify-center`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-all duration-200 ease-out relative z-10" />
              </button>

              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-950/80 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none backdrop-blur-sm whitespace-nowrap">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Audio visualizer */}
        {isRecording && (
          <div className="flex items-center space-x-2 animate-fade-in">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-red-500 to-pink-400 rounded-full animate-audio-bar"
                style={{
                  width: "4px",
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 50}ms`,
                  animationDuration: `${Math.random() * 300 + 400}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Recording timer */}
        {isRecording && (
          <div className="animate-fade-in">
            <div className="bg-gray-950/40 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-soft"></div>
                <span className="text-white font-mono text-lg">00:00:00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
