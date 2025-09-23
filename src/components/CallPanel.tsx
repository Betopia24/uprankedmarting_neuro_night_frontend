"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
  SignalIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useCall } from "@/contexts/CallContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface CallStats {
  duration: number;
  quality: "excellent" | "good" | "fair" | "poor";
  retryCount: number;
  startTime: Date | null;
}

const CallPanel = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStats, setCallStats] = useState<CallStats>({
    duration: 0,
    quality: "excellent",
    retryCount: 0,
    startTime: null,
  });
  const [isRetrying, setIsRetrying] = useState(false);

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

  // Call duration timer - only when call is connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentCall && callStats.startTime && callStatus === "connected") {
      interval = setInterval(() => {
        setCallStats((prev) => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentCall, callStats.startTime, callStatus]);

  // Handle call connection (when call is answered)
  useEffect(() => {
    if (currentCall && callStatus === "connected" && !callStats.startTime) {
      setCallStats((prev) => ({
        ...prev,
        startTime: new Date(),
        duration: 0,
      }));
      toast.success("Call connected successfully", {
        description: `Connected to ${phoneNumber}`,
        duration: 3000,
      });
    }
  }, [callStatus, phoneNumber]);

  // Handle call end
  useEffect(() => {
    if (!currentCall && callStats.startTime) {
      const totalDuration = Math.floor(
        (Date.now() - callStats.startTime.getTime()) / 1000
      );
      toast.info("Call ended", {
        description: `Duration: ${formatDuration(totalDuration)}`,
        duration: 4000,
      });
      setCallStats({
        duration: 0,
        quality: "excellent",
        retryCount: 0,
        startTime: null,
      });
    }
  }, [currentCall]);

  // Simulate call quality monitoring (you can replace with real quality data)
  useEffect(() => {
    if (currentCall && callStatus === "connected") {
      const qualityInterval = setInterval(() => {
        // Simulate quality changes - replace with real quality monitoring
        const qualities: CallStats["quality"][] = [
          "excellent",
          "good",
          "fair",
          "poor",
        ];
        const randomQuality =
          qualities[Math.floor(Math.random() * qualities.length)];

        setCallStats((prev) => {
          if (prev.quality !== randomQuality) {
            if (randomQuality === "poor") {
              toast.warning("Poor call quality", {
                description: "Connection quality has degraded",
                duration: 4000,
              });
            }
          }
          return { ...prev, quality: randomQuality };
        });
      }, 10000); // Check quality every 10 seconds

      return () => clearInterval(qualityInterval);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const plusPrefix = value.startsWith("+") ? "+" : "";
    return (
      plusPrefix +
      cleaned
        .slice(0, 15)
        .replace(/(\d{3})(?=\d)/g, "$1 ")
        .trim()
    );
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const handleRetryCall = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsRetrying(true);
    setCallStats((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }));

    toast.loading("Retrying call...", {
      description: `Attempt ${callStats.retryCount + 1}`,
      duration: 3000,
    });

    try {
      await makeCall(phoneNumber.trim());
      setIsRetrying(false);
    } catch (error) {
      setIsRetrying(false);
      const errorMessage =
        error instanceof Error ? error.message : "Retry failed";
      toast.error("Retry failed", {
        description: errorMessage,
        action: {
          label: "Try Again",
          onClick: () => handleRetryCall(),
        },
        duration: 6000,
      });
    }
  };

  const handleMakeCall = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!isDeviceReady) {
      toast.error("Device not ready", {
        description: "Please check your microphone permissions",
      });
      return;
    }

    // Show loading toast and store id
    const toastId = toast.loading("Initiating call...", {
      className: "text-gray-600",
    });

    try {
      await makeCall(phoneNumber.trim());

      // Success — update toast
      toast.success("Call started", { id: toastId, duration: 3000 });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to make call";

      // Error — update toast with retry
      toast.error(
        <div className="flex flex-col gap-2">
          <span>Call failed: {errorMessage}</span>
          <button
            onClick={() => handleRetryCall()}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>,
        { id: toastId, duration: 6000 }
      );
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-500";
      case "good":
        return "text-blue-500";
      case "fair":
        return "text-yellow-500";
      case "poor":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
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
        if (phoneNumber === "+") {
          setPhoneNumber("");
          return;
        }
        const isPlus = phoneNumber.startsWith("+");
        const raw = phoneNumber.replace(/\D/g, "").slice(0, -1);
        const newNumber = (isPlus && raw.length > 0 ? "+" : "") + raw;
        setPhoneNumber(formatPhoneNumber(newNumber));
      }
      return;
    }

    if (digit === "+" && phoneNumber.includes("+")) return;

    if (currentCall) {
      currentCall.sendDigits(digit);
      toast.success(`Sent: ${digit}`, { duration: 1000 });
    } else {
      const raw = phoneNumber.replace(/\D/g, "");
      const isPlus = phoneNumber.startsWith("+") || digit === "+";
      if (raw.length >= 15 && digit !== "+") return;
      const newNumber = (isPlus ? "+" : "") + raw + digit.replace(/\D/g, "");
      setPhoneNumber(formatPhoneNumber(newNumber));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDeviceReady) return;
      if (e.key >= "0" && e.key <= "9") handleKeypadPress(e.key);
      else if (e.key === "+" || (e.shiftKey && e.key === "="))
        handleKeypadPress("+");
      else if (e.key === "Backspace") handleKeypadPress("⌫");
      else if (e.key === "Enter" && !currentCall) handleMakeCall();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phoneNumber, currentCall, isDeviceReady]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xs mx-auto space-y-4 px-2"
    >
      {/* Call Stats Header */}
      <AnimatePresence>
        {currentCall && callStatus === "connected" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 rounded-lg p-3 border border-blue-100"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {formatDuration(callStats.duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SignalIcon
                  className={`w-4 h-4 ${getQualityColor(callStats.quality)}`}
                />
                <span
                  className={`text-xs font-medium capitalize ${getQualityColor(
                    callStats.quality
                  )}`}
                >
                  {callStats.quality}
                </span>
              </div>
              {callStats.retryCount > 0 && (
                <div className="flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-700">
                    Retries: {callStats.retryCount}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone Number Display */}
      {!currentCall && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-3 py-2 rounded-lg bg-white border border-gray-200"
        >
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter number"
            className="w-full text-center font-medium text-lg
                       bg-transparent outline-none placeholder:text-gray-400 placeholder:text-base
                       transition-all duration-200"
            style={{
              fontSize:
                phoneNumber.replace(/\D/g, "").length > 12 ? "1.5rem" : "",
            }}
          />
        </motion.div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2">
        {keypadRows.flat().map((digit, index) => (
          <motion.button
            key={digit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleKeypadPress(digit)}
            disabled={!isDeviceReady}
            tabIndex={-1}
            className="aspect-square flex items-center justify-center rounded-lg 
                       bg-white shadow-sm hover:shadow-md border border-gray-200
                       active:shadow-inner transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`${
                /\d/.test(digit) || digit === "+"
                  ? "text-lg font-bold text-gray-800"
                  : "text-sm font-semibold text-gray-600"
              }`}
            >
              {digit}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Call Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex justify-center gap-3 flex-wrap"
      >
        <AnimatePresence mode="wait">
          {!currentCall ? (
            <motion.button
              key="call-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleMakeCall}
              disabled={
                !isDeviceReady ||
                isConnecting ||
                isRetrying ||
                !phoneNumber.trim()
              }
              className="flex items-center justify-center gap-2 px-6 py-3 
                         rounded-lg text-base font-semibold text-white shadow-md hover:shadow-lg
                         bg-green-600 hover:bg-green-700
                         focus:outline-none focus:ring-2 focus:ring-green-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-200"
            >
              {(isConnecting || isRetrying) && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
              <PhoneIcon className="w-6 h-6" />
              {isRetrying
                ? "Retrying..."
                : isConnecting
                ? "Connecting..."
                : "Call"}
            </motion.button>
          ) : (
            <motion.div
              key="call-controls"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex gap-3"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => (isMuted ? unmuteCall() : muteCall())}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                            text-sm font-semibold shadow-md hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500/50
                            transition-all duration-200 ${
                              isMuted
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
              >
                <MicrophoneIcon className="w-4 h-4" />
                {isMuted ? "Unmute" : "Mute"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={hangupCall}
                className="flex items-center gap-2 px-4 py-2 
                           rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg
                           bg-red-600 hover:bg-red-700
                           focus:outline-none focus:ring-2 focus:ring-red-500/50
                           transition-all duration-200"
              >
                <PhoneXMarkIcon className="w-4 h-4" />
                Hang Up
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Device Status */}
      <AnimatePresence>
        {!isDeviceReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center p-2 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <p className="text-sm text-amber-700 font-medium">
              Device not ready. Please check permissions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CallPanel;
