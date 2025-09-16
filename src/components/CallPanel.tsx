"use client";

import React, { useState } from "react";
import {
  PhoneIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
  SpeakerXMarkIcon,
  BackspaceIcon,
} from "@heroicons/react/24/solid";
import { useCall } from "@/contexts/CallContext";

const CallPanel: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

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

  const handleMakeCall = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    const cleaned = phoneNumber.replace(/\D/g, "");
    console.log("phone number", cleaned);
    if (cleaned.length < 11) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");

    try {
      await makeCall(phoneNumber.trim());
    } catch (err: any) {
      setError(err.message || "Failed to make call. Please try again.");
      console.error("Call error:", err);
    }
  };

  const handleHangup = () => {
    hangupCall();
  };

  const handleMute = () => {
    if (isMuted) {
      unmuteCall();
    } else {
      muteCall();
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    // Support optional "+" at start
    const plusPrefix = value.startsWith("+") ? "+" : "";

    if (cleaned.length <= 3) {
      return plusPrefix + cleaned;
    } else if (cleaned.length <= 6) {
      return `${plusPrefix}(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `${plusPrefix}(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6, 15)}`;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const keypadRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["+", "0", "⌫"], // ⌫ is the backspace symbol
  ];

  const handleKeypadPress = (digit: string) => {
    if (digit === "⌫") {
      if (!currentCall) {
        const isPlus = phoneNumber.startsWith("+");
        const cleaned = phoneNumber.replace(/\D/g, "");
        const raw = isPlus ? "+" + cleaned : cleaned;
        const updated = raw.slice(0, -1);
        setPhoneNumber(formatPhoneNumber(updated));
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

  return (
    <div className="space-y-6">
      {/* Phone Number Input */}
      {!currentCall && (
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="(555) 123-4567 or +1..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
              maxLength={20}
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {keypadRows.flat().map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeypadPress(digit)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            disabled={!isDeviceReady}
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Call Controls */}
      <div className="flex justify-center space-x-4">
        {!currentCall ? (
          <button
            onClick={handleMakeCall}
            disabled={!isDeviceReady || isConnecting || !phoneNumber.trim()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            {isConnecting ? "Connecting..." : "Call"}
          </button>
        ) : (
          <>
            <button
              onClick={handleMute}
              className={`inline-flex items-center px-4 py-3 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isMuted
                  ? "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500"
              }`}
            >
              <MicrophoneIcon className="w-5 h-5 mr-2" />
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
              onClick={handleHangup}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PhoneXMarkIcon className="w-5 h-5 mr-2" />
              Hang Up
            </button>
          </>
        )}
      </div>

      {/* Device Status */}
      {!isDeviceReady && callStatus !== "ready" && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            <p className="text-sm text-yellow-800">
              Connecting to call service...
            </p>
          </div>
        </div>
      )}

      {/* Call Status */}
      {currentCall && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-900">Call Active</p>
              <p className="text-sm text-blue-600">
                {currentCall.parameters?.To || phoneNumber}
              </p>
              {isMuted && (
                <p className="text-xs text-red-600 mt-1">Microphone muted</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallPanel;
