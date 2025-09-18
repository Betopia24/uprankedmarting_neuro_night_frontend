// Fixed Direct Outbound CallContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Device, Call } from "@twilio/voice-sdk";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";

interface CallContextType {
  currentCall: Call | null;
  isDeviceReady: boolean;
  isMuted: boolean;
  isConnecting: boolean;
  callStatus: string;
  calls: any[];
  isLoading?: boolean;
  makeCall: (phoneNumber: string) => Promise<void>;
  hangupCall: () => void;
  muteCall: () => void;
  unmuteCall: () => void;
  fetchCallHistory: () => Promise<void>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const { token, user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState("disconnected");
  const [calls, setCalls] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;

  useEffect(() => {
    if (token && user) {
      initializeDevice();
    }

    return () => {
      if (device) {
        device.destroy();
        setDevice(null);
      }
    };
  }, [token, user]);

  const initializeDevice = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/twilio/token?identity=${encodeURIComponent(user!.id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch Twilio token: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      const newDevice = new Device(data.token, {
        logLevel: "debug",
      });

      newDevice.register();

      newDevice.on("registered", () => {
        setIsDeviceReady(true);
        setCallStatus("ready");
      });

      newDevice.on("error", (error) => {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error("[CallContext] Device error:", error);
        setIsDeviceReady(false);
        setCallStatus("error");
      });

      // Handle incoming calls (for receiving calls)
      newDevice.on("incoming", (call) => {
        // You can handle incoming calls here if needed
        // For now, just log them
      });

      setDevice(newDevice);
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("[CallContext] Failed to initialize device:", error);
      setIsDeviceReady(false);
      setCallStatus("error");
    }
  };

  const makeCall = async (phoneNumber: string) => {
    if (!device || !isDeviceReady) {
      const err = new Error("Device is not ready");
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("[CallContext] makeCall error:", err);
      throw err;
    }

    setIsConnecting(true);
    setCallStatus("connecting");

    try {
      // FIXED: Use device.connect for direct outbound calls
      const call = await device.connect({
        params: {
          To: phoneNumber, // The phone number to call
          // You can add more parameters here if your backend TwiML expects them
        },
      });

      // Setup call event listeners
      call.on("accept", () => {
        setCurrentCall(call);
        setIsConnecting(false);
        setCallStatus("connected");
      });

      call.on("disconnect", () => {
        setCurrentCall(null);
        setIsMuted(false);
        setCallStatus("ready");
        setIsConnecting(false);
      });

      call.on("cancel", () => {
        setCurrentCall(null);
        setIsConnecting(false);
        setCallStatus("ready");
      });

      call.on("error", (error) => {
        console.error("[CallContext] Call error:", error);
        setCurrentCall(null);
        setIsConnecting(false);
        setCallStatus("error");
      });

      call.on("ringing", () => {
        setCallStatus("ringing");
      });

      // Set the current call immediately
      setCurrentCall(call);
    } catch (error) {
      console.error("[CallContext] Failed to make call:", error);
      setIsConnecting(false);
      setCallStatus("error");
      throw error;
    }
  };

  const hangupCall = () => {
    if (currentCall) {
      currentCall.disconnect();
    }
    setCurrentCall(null);
    setIsMuted(false);
    setCallStatus("ready");
    setIsConnecting(false);
  };

  const muteCall = () => {
    if (currentCall) {
      currentCall.mute(true);
      setIsMuted(true);
    }
  };

  const unmuteCall = () => {
    if (currentCall) {
      currentCall.mute(false);
      setIsMuted(false);
    }
  };

  const fetchCallHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/calls/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCalls(data.data?.calls || []);
      } else {
        env.NEXT_PUBLIC_APP_ENV === "development" &&
          console.error(
            "[CallContext] Failed to fetch call history:",
            response.status
          );
      }
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("[CallContext] Failed to fetch call history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CallContext.Provider
      value={{
        currentCall,
        isDeviceReady,
        isMuted,
        isConnecting,
        callStatus,
        calls,
        isLoading,
        makeCall,
        hangupCall,
        muteCall,
        unmuteCall,
        fetchCallHistory,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
