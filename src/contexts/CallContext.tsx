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

  console.log({ token, user });

  const [device, setDevice] = useState<Device | null>(null);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState("disconnected");
  const [calls, setCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "https://c8877843a49f.ngrok-free.app"; //|| "http://127.0.0.1:9000";

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
        console.log("[CallContext] Twilio device registered successfully");
      });

      newDevice.on("error", (error) => {
        console.error("[CallContext] Device error:", error);
        setIsDeviceReady(false);
        setCallStatus("error");
      });

      // Handle incoming calls (for receiving calls)
      newDevice.on("incoming", (call) => {
        console.log("[CallContext] Incoming call received:", call);
        // You can handle incoming calls here if needed
        // For now, just log them
      });

      setDevice(newDevice);
    } catch (error) {
      console.error("[CallContext] Failed to initialize device:", error);
      setIsDeviceReady(false);
      setCallStatus("error");
    }
  };

  const makeCall = async (phoneNumber: string) => {
    if (!device || !isDeviceReady) {
      const err = new Error("Device is not ready");
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

      console.log("[CallContext] Call initiated:", call);

      // Setup call event listeners
      call.on("accept", () => {
        setCurrentCall(call);
        setIsConnecting(false);
        setCallStatus("connected");
        console.log("[CallContext] Call accepted/connected");
      });

      call.on("disconnect", () => {
        setCurrentCall(null);
        setIsMuted(false);
        setCallStatus("ready");
        setIsConnecting(false);
        console.log("[CallContext] Call disconnected");
      });

      call.on("cancel", () => {
        setCurrentCall(null);
        setIsConnecting(false);
        setCallStatus("ready");
        console.log("[CallContext] Call cancelled");
      });

      call.on("error", (error) => {
        console.error("[CallContext] Call error:", error);
        setCurrentCall(null);
        setIsConnecting(false);
        setCallStatus("error");
      });

      call.on("ringing", () => {
        setCallStatus("ringing");
        console.log("[CallContext] Call is ringing");
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
        console.error(
          "[CallContext] Failed to fetch call history:",
          response.status
        );
      }
    } catch (error) {
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
