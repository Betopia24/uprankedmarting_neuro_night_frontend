"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";
import { useCall } from "@/contexts/CallContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CallPanel = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const {
    currentCall,
    isDeviceReady,
    isMuted,
    isConnecting,
    callStatus,
    makeCall,
    hangupCall,
    muteCall,
    unmuteCall,
  } = useCall();

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const plusPrefix = value.startsWith("+") ? "+" : "";
    if (cleaned.length <= 3) return plusPrefix + cleaned;
    if (cleaned.length <= 6)
      return `${plusPrefix}(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `${plusPrefix}(${cleaned.slice(0, 3)}) ${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6, 15)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const keypadRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["+", "0", "⌫"],
  ];

  const handleKeypadPress = (digit: string) => {
    if (digit === "⌫") {
      if (!currentCall) {
        const isPlus = phoneNumber.startsWith("+");
        const cleaned = phoneNumber.replace(/\D/g, "");
        const raw = isPlus ? "+" + cleaned : cleaned;
        setPhoneNumber(formatPhoneNumber(raw.slice(0, -1)));
      }
      return;
    }
    if (digit === "+" && phoneNumber.includes("+")) return;
    if (currentCall) {
      currentCall.sendDigits(digit);
    } else {
      const currentDigits = phoneNumber.replace(/\D/g, "");
      const isPlus = phoneNumber.startsWith("+") || digit === "+";
      if (currentDigits.length >= 15 && digit !== "+") return;
      const newNumber =
        (isPlus ? "+" : "") + currentDigits + digit.replace(/\D/g, "");
      setPhoneNumber(formatPhoneNumber(newNumber));
    }
  };

  // ✅ Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDeviceReady) return;
      if (e.key >= "0" && e.key <= "9") handleKeypadPress(e.key);
      else if (e.key === "+" || (e.shiftKey && e.key === "="))
        handleKeypadPress("+");
      else if (e.key === "Backspace") handleKeypadPress("⌫");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phoneNumber, currentCall, isDeviceReady]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-4">
      {/* Phone Number Display */}
      {!currentCall && (
        <div className="px-3 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter number"
            className="w-full text-center font-bold tracking-widest text-2xl sm:text-3xl md:text-4xl bg-transparent outline-none placeholder:text-gray-300"
            disabled
          />
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {keypadRows.flat().map((digit) => (
          <motion.button
            key={digit}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeypadPress(digit)}
            disabled={!isDeviceReady}
            tabIndex={-1} // 👈 Prevent auto-focus from keyboard
            className="aspect-square flex items-center justify-center rounded-full 
                       bg-gradient-to-b from-gray-50 to-gray-100 shadow 
                       hover:shadow-md active:shadow-inner 
                       focus:outline-none focus:ring-2 focus:ring-transparent
                       transition-all disabled:opacity-50"
          >
            <span
              className={`${
                /\d/.test(digit) || digit === "+"
                  ? "text-2xl sm:text-3xl font-bold text-gray-900"
                  : "text-lg sm:text-xl font-semibold text-gray-700"
              }`}
            >
              {digit}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Call Controls */}
      <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
        {!currentCall ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => makeCall(phoneNumber.trim())}
            disabled={!isDeviceReady || isConnecting || !phoneNumber.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2 
                       rounded-full text-base sm:text-lg font-semibold 
                       text-white shadow-md 
                       bg-green-600 hover:bg-green-700 active:bg-green-800 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            {isConnecting ? "Connecting..." : "Call"}
          </motion.button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => (isMuted ? unmuteCall() : muteCall())}
              className={`flex items-center gap-2 px-5 py-2 rounded-full 
                          text-base sm:text-lg font-semibold shadow-md 
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          transition-all ${
                            isMuted
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
            >
              <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {isMuted ? "Unmute" : "Mute"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={hangupCall}
              className="flex items-center gap-2 px-6 py-2 
                         rounded-full text-base sm:text-lg font-semibold 
                         text-white shadow-md 
                         bg-red-600 hover:bg-red-700 active:bg-red-800 
                         focus:outline-none focus:ring-2 focus:ring-transparent
                         transition-all"
            >
              <PhoneXMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              Hang Up
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default CallPanel;
