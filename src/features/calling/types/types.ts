// types.ts
export type CallQuality = "excellent" | "good" | "fair" | "poor";

export interface CallState {
  state: "none" | "incoming" | "active" | "ended";
  call: any | null; // Keep as any because @twilio/voice-sdk's Call type may be complex
  from: string;
  duration: number;
  quality: CallQuality;
  isConnected: boolean;
}

export interface ConnectionState {
  websocket: "connected" | "connecting" | "disconnected" | "error";
  device:
    | "uninitialized"
    | "initializing"
    | "registered"
    | "unregistered"
    | "error";
  lastHeartbeat: Date | null;
  reconnectAttempts: number;
  isHealthy: boolean;
}

export interface AudioState {
  inputLevel: number;
  outputLevel: number;
  isMuted: boolean;
  inputDevices: MediaDeviceInfo[];
  outputDevices: MediaDeviceInfo[];
  selectedInput: string | null;
  selectedOutput: string | null;
  hasPermission: boolean;
}

export interface TwilioInboundAgentProps {
  identity: string;
}
