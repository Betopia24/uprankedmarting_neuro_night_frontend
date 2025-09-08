"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Device, Call } from "@twilio/voice-sdk";
import { useAuth } from "@/components/AuthProvider";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  MessageCircle,
  User,
  Settings,
  AlertTriangle,
  Wifi,
  WifiOff,
  Volume2,
  PhoneIncoming,
  Clock,
  Signal,
} from "lucide-react";

// Configuration constants
const CONFIG = {
  WEBSOCKET_RECONNECT_INTERVAL: 3000,
  WEBSOCKET_MAX_RECONNECT_ATTEMPTS: 10,
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
  DEVICE_REGISTRATION_RETRY_INTERVAL: 5000,
  CALL_TIMEOUT: 30000,
  HEARTBEAT_INTERVAL: 30000,
  CALL_QUALITY_CHECK_INTERVAL: 5000,
  AUDIO_LEVEL_THRESHOLD: 0.01,
  CONNECTION_STATE_CHECK_INTERVAL: 10000,
};

// Types
interface CallState {
  state: "none" | "incoming" | "active" | "ended";
  call: Call | null;
  from: string;
  duration: number;
  quality: "excellent" | "good" | "fair" | "poor";
  isConnected: boolean;
}

interface ConnectionState {
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

interface AudioState {
  inputLevel: number;
  outputLevel: number;
  isMuted: boolean;
  inputDevices: MediaDeviceInfo[];
  outputDevices: MediaDeviceInfo[];
  selectedInput: string | null;
  selectedOutput: string | null;
  hasPermission: boolean;
}

interface TwilioInboundAgentProps {
  identity: string;
}

const TwilioInboundAgent: React.FC<TwilioInboundAgentProps> = ({
  identity,
}) => {
  const { token, user } = useAuth();

  // Core state
  const [callState, setCallState] = useState<CallState>({
    state: "none",
    call: null,
    from: "",
    duration: 0,
    quality: "excellent",
    isConnected: false,
  });

  const [connectionState, setConnectionState] = useState<ConnectionState>({
    websocket: "disconnected",
    device: "uninitialized",
    lastHeartbeat: null,
    reconnectAttempts: 0,
    isHealthy: false,
  });

  const [audioState, setAudioState] = useState<AudioState>({
    inputLevel: 0,
    outputLevel: 0,
    isMuted: false,
    inputDevices: [],
    outputDevices: [],
    selectedInput: null,
    selectedOutput: null,
    hasPermission: false,
  });

  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; type: "error" | "warning" | "info"; message: string }>
  >([]);

  // Refs for cleanup and persistence
  const deviceRef = useRef<Device | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentCallRef = useRef<Call | null>(null);
  const isMountedRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const qualityCheckRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);
  const callAcceptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio monitoring refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_CALL_CENTER_API_URL || "http://127.0.0.1:9050";

  // WebSocket URL generation with failover
  const getWebSocketUrl = useCallback(
    (userId: string) => {
      let baseUrl = API_BASE_URL.replace(/^https?:\/\//, "");
      baseUrl = baseUrl.replace(/\/+$/, "");
      const protocol = API_BASE_URL.startsWith("https") ? "wss" : "ws";
      return `${protocol}://${baseUrl}/ws/${userId}`;
    },
    [API_BASE_URL]
  );

  // Utility functions
  const addNotification = useCallback(
    (type: "error" | "warning" | "info", message: string) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev.slice(-4), { id, type, message }]);

      setTimeout(
        () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
        type === "error" ? 10000 : 5000
      );
    },
    []
  );

  const updateStatusMessage = useCallback(
    (message: string, type?: "error" | "warning" | "info") => {
      setStatusMessage(message);
      if (type) {
        addNotification(type, message);
      }
    },
    [addNotification]
  );

  // Audio permission and monitoring
  const initializeAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (!isMountedRef.current || !analyser) return;

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const level = average / 255;

        setAudioState((prev) => ({ ...prev, inputLevel: level }));

        requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();

      setAudioState((prev) => ({ ...prev, hasPermission: true }));
      updateStatusMessage("Audio monitoring initialized");
    } catch (err) {
      console.error("Failed to initialize audio monitoring:", err);
      setAudioState((prev) => ({ ...prev, hasPermission: false }));
      updateStatusMessage("Microphone permission required", "error");
    }
  }, [updateStatusMessage]);

  // Device management
  const updateAudioDevices = useCallback(async (device?: Device) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputDevices = devices.filter((d) => d.kind === "audioinput");
      const outputDevices = devices.filter((d) => d.kind === "audiooutput");

      setAudioState((prev) => ({
        ...prev,
        inputDevices,
        outputDevices,
      }));

      if (device?.audio) {
        const twilioInputs = new Map<string, MediaDeviceInfo>();
        const twilioOutputs = new Map<string, MediaDeviceInfo>();

        device.audio.availableInputDevices.forEach(
          (media: MediaDeviceInfo, id: string) => twilioInputs.set(id, media)
        );
        device.audio.availableOutputDevices.forEach(
          (media: MediaDeviceInfo, id: string) => twilioOutputs.set(id, media)
        );
      }
    } catch (err) {
      console.error("Failed to update audio devices:", err);
    }
  }, []);

  // Token management
  const fetchToken = useCallback(async (): Promise<string> => {
    if (!token) throw new Error("No authentication token available");

    const response = await fetch(
      `${API_BASE_URL}/twilio/token?identity=${encodeURIComponent(identity)}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Token fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  }, [API_BASE_URL, identity, token]);

  const scheduleTokenRefresh = useCallback(() => {
    if (tokenRefreshRef.current) {
      clearTimeout(tokenRefreshRef.current);
    }

    tokenRefreshRef.current = setTimeout(async () => {
      if (!isMountedRef.current || !deviceRef.current) return;

      try {
        const newToken = await fetchToken();
        deviceRef.current.updateToken(newToken);
        console.log("Token refreshed successfully");
        updateStatusMessage("Token refreshed");
        scheduleTokenRefresh();
      } catch (err) {
        console.error("Token refresh failed:", err);
        updateStatusMessage("Token refresh failed, retrying...", "error");

        setTimeout(async () => {
          if (isMountedRef.current && deviceRef.current) {
            try {
              const newToken = await fetchToken();
              deviceRef.current.updateToken(newToken);
              console.log("Token refresh retry successful");
              scheduleTokenRefresh();
            } catch (retryErr) {
              console.error("Token refresh retry failed:", retryErr);
              updateStatusMessage("Critical: Token refresh failed", "error");
            }
          }
        }, 5000);
      }
    }, CONFIG.TOKEN_REFRESH_INTERVAL);
  }, [fetchToken, updateStatusMessage]);

  // Call quality monitoring
  const startCallQualityMonitoring = useCallback((call: Call) => {
    if (qualityCheckRef.current) {
      clearInterval(qualityCheckRef.current);
    }

    qualityCheckRef.current = setInterval(() => {
      if (!call || call.status() !== "open") {
        if (qualityCheckRef.current) {
          clearInterval(qualityCheckRef.current);
        }
        return;
      }

      setCallState((prev) => ({
        ...prev,
        quality: "good", // Simplified - implement actual quality detection
      }));
    }, CONFIG.CALL_QUALITY_CHECK_INTERVAL);
  }, []);

  // Call handlers
  const attachCallHandlers = useCallback(
    (call: Call) => {
      console.log("Attaching enhanced call handlers");

      call.on("accept", () => {
        if (!isMountedRef.current) return;

        setCallState((prev) => ({
          ...prev,
          state: "active",
          isConnected: true,
          duration: 0,
        }));

        currentCallRef.current = call;
        updateStatusMessage("Call connected");
        startCallQualityMonitoring(call);

        let duration = 0;
        callTimerRef.current = setInterval(() => {
          duration++;
          setCallState((prev) => ({ ...prev, duration }));
        }, 1000);
      });

      call.on("disconnect", () => {
        if (!isMountedRef.current) return;

        console.log("Call disconnected");
        setCallState({
          state: "none",
          call: null,
          from: "",
          duration: 0,
          quality: "excellent",
          isConnected: false,
        });

        currentCallRef.current = null;
        updateStatusMessage("Call ended");

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "status_update",
              data: { agent_id: user.id, status: "free" },
            })
          );
        }

        if (callTimerRef.current) clearInterval(callTimerRef.current);
        if (qualityCheckRef.current) clearInterval(qualityCheckRef.current);
        if (callAcceptTimeoutRef.current)
          clearTimeout(callAcceptTimeoutRef.current);
      });

      call.on("cancel", () => {
        if (!isMountedRef.current) return;

        console.log("Call cancelled by caller");
        setCallState({
          state: "none",
          call: null,
          from: "",
          duration: 0,
          quality: "excellent",
          isConnected: false,
        });

        currentCallRef.current = null;
        updateStatusMessage("Call cancelled", "info");

        if (callAcceptTimeoutRef.current) {
          clearTimeout(callAcceptTimeoutRef.current);
        }
      });

      call.on("error", (err: any) => {
        if (!isMountedRef.current) return;

        console.error("Call error:", err);
        updateStatusMessage(
          `Call error: ${err?.message || "Unknown error"}`,
          "error"
        );

        setTimeout(() => {
          if (isMountedRef.current && deviceRef.current) {
            registerDevice();
          }
        }, 5000);
      });

      call.on("volume", (inputVolume?: number, outputVolume?: number) => {
        if (!isMountedRef.current) return;

        setAudioState((prev) => ({
          ...prev,
          inputLevel: inputVolume || 0,
          outputLevel: outputVolume || 0,
        }));
      });

      call.on("warning", (name: string, data: any) => {
        console.warn("Call quality warning:", name, data);
        setCallState((prev) => ({ ...prev, quality: "poor" }));
        updateStatusMessage(`Call quality warning: ${name}`, "warning");
      });

      call.on("warning-cleared", (name: string) => {
        console.log("Call quality warning cleared:", name);
        setCallState((prev) => ({ ...prev, quality: "good" }));
      });
    },
    [updateStatusMessage, startCallQualityMonitoring, user.id]
  );

  // Device initialization and management
  const initializeDevice = useCallback(
    async (accessToken: string): Promise<Device> => {
      console.log("Initializing Twilio Device with enhanced configuration...");

      if (deviceRef.current) {
        try {
          deviceRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying previous device:", e);
        }
      }

      const device = new Device(accessToken, {
        tokenRefreshMs: 15000,
        enableImprovedSignalingErrorPrecision: true,
        logLevel: "info",
        allowIncomingWhileBusy: false,
      });

      deviceRef.current = device;

      device.on("registered", () => {
        if (!isMountedRef.current) return;

        setConnectionState((prev) => ({
          ...prev,
          device: "registered",
          isHealthy: true,
        }));
        updateStatusMessage("Device registered - Ready for calls");
        console.log("Device registered successfully");
      });

      device.on("unregistered", () => {
        if (!isMountedRef.current) return;

        setConnectionState((prev) => ({
          ...prev,
          device: "unregistered",
          isHealthy: false,
        }));
        updateStatusMessage("Device unregistered", "warning");

        setTimeout(() => {
          if (isMountedRef.current && device) {
            registerDevice();
          }
        }, CONFIG.DEVICE_REGISTRATION_RETRY_INTERVAL);
      });

      device.on("error", (err: any) => {
        if (!isMountedRef.current) return;

        console.error("Device error:", err);
        setConnectionState((prev) => ({
          ...prev,
          device: "error",
          isHealthy: false,
        }));
        updateStatusMessage(
          `Device error: ${err?.message || "Unknown error"}`,
          "error"
        );
      });

      device.on("incoming", (call: Call) => {
        if (!isMountedRef.current) return;

        console.log("Incoming call received:", call.parameters);

        const from = call.parameters.From || "Unknown";

        setCallState({
          state: "incoming",
          call,
          from,
          duration: 0,
          quality: "excellent",
          isConnected: false,
        });

        currentCallRef.current = call;
        updateStatusMessage(`Incoming call from ${from}`);
        attachCallHandlers(call);

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Incoming Call", {
            body: `Call from ${from}`,
            icon: "/phone-icon.png",
            tag: "incoming-call",
          });
        }

        callAcceptTimeoutRef.current = setTimeout(() => {
          if (callState.state === "incoming" && call) {
            call.reject();
            updateStatusMessage("Call auto-rejected (timeout)", "warning");
          }
        }, CONFIG.CALL_TIMEOUT);
      });

      device.on("tokenWillExpire", async () => {
        console.log("Token will expire, refreshing...");
        try {
          const newToken = await fetchToken();
          device.updateToken(newToken);
        } catch (err) {
          console.error("Token refresh failed:", err);
          updateStatusMessage("Token refresh failed", "error");
        }
      });

      device.audio?.on("deviceChange", () => {
        console.log("Audio devices changed");
        updateAudioDevices(device);
      });

      await updateAudioDevices(device);
      console.log("Device initialized successfully");
      return device;
    },
    [
      attachCallHandlers,
      callState.state,
      fetchToken,
      updateAudioDevices,
      updateStatusMessage,
    ]
  );

  const registerDevice = useCallback(async () => {
    if (!deviceRef.current) {
      updateStatusMessage("Device not initialized", "error");
      return;
    }

    try {
      setConnectionState((prev) => ({ ...prev, device: "initializing" }));
      await deviceRef.current.register();
      updateStatusMessage("Registering device...");
    } catch (err) {
      console.error("Device registration failed:", err);
      setConnectionState((prev) => ({ ...prev, device: "error" }));
      updateStatusMessage("Registration failed", "error");

      const retryDelay = Math.min(
        CONFIG.DEVICE_REGISTRATION_RETRY_INTERVAL *
          (connectionState.reconnectAttempts + 1),
        30000
      );
      setTimeout(async () => {
        if (isMountedRef.current) {
          try {
            const newToken = await fetchToken();
            deviceRef.current.updateToken(newToken);
            await registerDevice();
          } catch (retryErr) {
            console.error("Retry registration failed:", retryErr);
            updateStatusMessage("Retry registration failed", "error");
          }
        }
      }, retryDelay);
    }
  }, [updateStatusMessage, fetchToken, connectionState.reconnectAttempts]);

  // WebSocket management with enhanced reliability
  const connectWebSocket = useCallback(() => {
    if (!user?.id || !token || !isMountedRef.current) {
      console.log("Waiting for authentication...");
      return;
    }

    console.log("Connecting WebSocket for user:", user.id);

    const wsUrl = getWebSocketUrl(user.id);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
          updateStatusMessage("WebSocket connection timeout", "error");
        }
      }, 10000);

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }

        clearTimeout(connectionTimeout);
        console.log("WebSocket connected");

        setConnectionState((prev) => ({
          ...prev,
          websocket: "connected",
          reconnectAttempts: 0,
          lastHeartbeat: new Date(),
          isHealthy: true,
        }));

        updateStatusMessage("Connected to call center");
        ws.send(
          JSON.stringify({
            type: "agent_register",
            data: { agent_id: user.id, token },
          })
        );
        startHeartbeat(ws);
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);

          setConnectionState((prev) => ({
            ...prev,
            lastHeartbeat: new Date(),
          }));
        } catch (err) {
          console.error("WebSocket message parsing error:", err);
        }
      };

      ws.onerror = (error) => {
        if (!isMountedRef.current) return;

        console.error("WebSocket error:", error);
        setConnectionState((prev) => ({
          ...prev,
          websocket: "error",
          isHealthy: false,
        }));
        updateStatusMessage("Connection error", "error");
      };

      ws.onclose = (event) => {
        if (!isMountedRef.current) return;

        clearTimeout(connectionTimeout);
        console.log("WebSocket disconnected:", event.code, event.reason);

        setConnectionState((prev) => ({
          ...prev,
          websocket: "disconnected",
          isHealthy: false,
        }));

        if (event.code !== 1000 && isMountedRef.current) {
          scheduleReconnect();
        }
      };
    } catch (error) {
      console.error("WebSocket creation error:", error);
      updateStatusMessage("Failed to create WebSocket connection", "error");
      scheduleReconnect();
    }
  }, [user?.id, token, getWebSocketUrl, updateStatusMessage]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setConnectionState((prev) => {
      const attempts = prev.reconnectAttempts + 1;
      const delay = Math.min(
        CONFIG.WEBSOCKET_RECONNECT_INTERVAL * Math.pow(2, attempts),
        60000
      );

      reconnectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          updateStatusMessage("Attempting to reconnect...", "info");
          connectWebSocket();
        }
      }, delay);

      return { ...prev, reconnectAttempts: attempts, websocket: "connecting" };
    });
  }, [connectWebSocket, updateStatusMessage]);

  const startHeartbeat = useCallback((ws: WebSocket) => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      } else {
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
      }
    }, CONFIG.HEARTBEAT_INTERVAL);
  }, []);

  const handleWebSocketMessage = useCallback(
    (message: any) => {
      console.log("WebSocket message:", message);

      switch (message.type) {
        case "registration_success":
          updateStatusMessage("Agent registered successfully");
          break;

        case "incoming_call":
          console.log("Call notification received via WebSocket");
          break;

        case "call_ended":
          console.log("Call ended notification received");
          break;

        case "registration_error":
          updateStatusMessage(
            `Registration failed: ${message.data?.message}`,
            "error"
          );
          break;

        case "pong":
          setConnectionState((prev) => ({
            ...prev,
            lastHeartbeat: new Date(),
            isHealthy: true,
          }));
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    },
    [updateStatusMessage]
  );

  // Call controls
  const acceptCall = useCallback(async () => {
    if (!currentCallRef.current) return;

    try {
      updateStatusMessage("Accepting call...");

      if (callAcceptTimeoutRef.current) {
        clearTimeout(callAcceptTimeoutRef.current);
      }

      await currentCallRef.current.accept({
        rtcConstraints: {
          audio: true,
          video: false,
        },
      });

      updateStatusMessage("Call accepted");
    } catch (err) {
      console.error("Failed to accept call:", err);
      updateStatusMessage("Failed to accept call", "error");
    }
  }, [updateStatusMessage]);

  const rejectCall = useCallback(async () => {
    if (!currentCallRef.current) return;

    try {
      await currentCallRef.current.reject();
      updateStatusMessage("Call rejected");

      setCallState({
        state: "none",
        call: null,
        from: "",
        duration: 0,
        quality: "excellent",
        isConnected: false,
      });

      currentCallRef.current = null;
    } catch (err) {
      console.error("Failed to reject call:", err);
      updateStatusMessage("Failed to reject call", "error");
    }
  }, [updateStatusMessage]);

  const endCall = useCallback(async () => {
    if (!currentCallRef.current) return;

    try {
      await currentCallRef.current.disconnect();
      updateStatusMessage("Call ended");

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "status_update",
            data: { agent_id: user.id, status: "free" },
          })
        );
      }

      setCallState({
        state: "none",
        call: null,
        from: "",
        duration: 0,
        quality: "excellent",
        isConnected: false,
      });
      currentCallRef.current = null;
    } catch (err) {
      console.error("Failed to end call:", err);
      updateStatusMessage("Failed to end call", "error");
    } finally {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (qualityCheckRef.current) clearInterval(qualityCheckRef.current);
      if (callAcceptTimeoutRef.current)
        clearTimeout(callAcceptTimeoutRef.current);
    }
  }, [updateStatusMessage, user.id]);

  const toggleMute = useCallback(async () => {
    if (!currentCallRef.current) return;

    try {
      const newMutedState = !audioState.isMuted;
      currentCallRef.current.mute(newMutedState);

      setAudioState((prev) => ({ ...prev, isMuted: newMutedState }));
      updateStatusMessage(newMutedState ? "Muted" : "Unmuted");
    } catch (err) {
      console.error("Failed to toggle mute:", err);
      updateStatusMessage("Failed to toggle mute", "error");
    }
  }, [audioState.isMuted, updateStatusMessage]);

  // Main initialization flow
  const initializeSystem = useCallback(async () => {
    try {
      updateStatusMessage("Requesting microphone permission...");
      await initializeAudioMonitoring();

      updateStatusMessage("Fetching access token...");
      const accessToken = await fetchToken();

      updateStatusMessage("Initializing device...");
      const device = await initializeDevice(accessToken);

      updateStatusMessage("Registering device...");
      await registerDevice();

      scheduleTokenRefresh();

      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch (err: any) {
      console.error("System initialization failed:", err);
      updateStatusMessage(`Initialization failed: ${err.message}`, "error");
    }
  }, [
    initializeAudioMonitoring,
    fetchToken,
    initializeDevice,
    registerDevice,
    scheduleTokenRefresh,
    updateStatusMessage,
  ]);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log("Cleaning up resources...");

    [
      reconnectTimeoutRef,
      heartbeatIntervalRef,
      callTimerRef,
      qualityCheckRef,
      tokenRefreshRef,
      connectionCheckRef,
      callAcceptTimeoutRef,
    ].forEach((ref) => {
      if (ref.current) {
        clearTimeout(ref.current);
        clearInterval(ref.current);
      }
    });

    if (wsRef.current) {
      wsRef.current.close(1000, "Component unmounting");
      wsRef.current = null;
    }

    if (deviceRef.current) {
      try {
        deviceRef.current.destroy();
      } catch (e) {
        console.warn("Error destroying device:", e);
      }
      deviceRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // Effect hooks
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    if (user?.id && token) {
      connectWebSocket();
    }
  }, [user?.id, token, connectWebSocket]);

  useEffect(() => {
    const checkConnection = () => {
      if (!isMountedRef.current) return;

      const now = new Date();
      const lastHeartbeat = connectionState.lastHeartbeat;

      if (lastHeartbeat) {
        const timeSinceHeartbeat = now.getTime() - lastHeartbeat.getTime();

        if (timeSinceHeartbeat > CONFIG.HEARTBEAT_INTERVAL * 3) {
          setConnectionState((prev) => ({ ...prev, isHealthy: false }));
          updateStatusMessage("Connection may be unhealthy", "warning");
        }
      }
    };

    connectionCheckRef.current = setInterval(
      checkConnection,
      CONFIG.CONNECTION_STATE_CHECK_INTERVAL
    );

    return () => {
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, [connectionState.lastHeartbeat, updateStatusMessage]);

  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Audio device management
  const setInputDevice = useCallback(
    async (deviceId: string) => {
      if (!deviceRef.current?.audio) return;

      try {
        await deviceRef.current.audio.setInputDevice(deviceId);
        setAudioState((prev) => ({ ...prev, selectedInput: deviceId }));
        updateStatusMessage("Input device updated");
      } catch (err) {
        console.error("Failed to set input device:", err);
        updateStatusMessage("Failed to update input device", "error");
      }
    },
    [updateStatusMessage]
  );

  const setOutputDevice = useCallback(
    async (deviceId: string) => {
      if (!deviceRef.current?.audio) return;

      try {
        await deviceRef.current.audio.speakerDevices.set([deviceId]);
        setAudioState((prev) => ({ ...prev, selectedOutput: deviceId }));
        updateStatusMessage("Output device updated");
      } catch (err) {
        console.error("Failed to set output device:", err);
        updateStatusMessage("Failed to update output device", "error");
      }
    },
    [updateStatusMessage]
  );

  const testAudioDevices = useCallback(async () => {
    if (!deviceRef.current?.audio) return;

    try {
      await deviceRef.current.audio.speakerDevices.test();
      updateStatusMessage("Audio test completed");
    } catch (err) {
      console.error("Failed to test audio devices:", err);
      updateStatusMessage("Audio test failed", "error");
    }
  }, [updateStatusMessage]);

  // Connection status indicator
  const ConnectionStatusIndicator = useMemo(() => {
    const { websocket, device, isHealthy } = connectionState;

    let status: "connected" | "warning" | "error";
    let icon: React.ReactNode;
    let message: string;

    if (websocket === "connected" && device === "registered" && isHealthy) {
      status = "connected";
      icon = <Wifi className="w-4 h-4 text-green-400" />;
      message = "Connected";
    } else if (websocket === "connecting" || device === "initializing") {
      status = "warning";
      icon = <Signal className="w-4 h-4 text-yellow-400 animate-pulse" />;
      message = "Connecting...";
    } else {
      status = "error";
      icon = <WifiOff className="w-4 h-4 text-red-400" />;
      message = "Disconnected";
    }

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          status === "connected"
            ? "bg-green-900/20 text-green-400"
            : status === "warning"
            ? "bg-yellow-900/20 text-yellow-400"
            : "bg-red-900/20 text-red-400"
        }`}
      >
        {icon}
        <span>{message}</span>
      </div>
    );
  }, [connectionState]);

  // Notification system
  const NotificationSystem = useMemo(
    () => (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border backdrop-blur-sm animate-in slide-in-from-right duration-300 ${
              notification.type === "error"
                ? "bg-red-900/80 border-red-500 text-red-100"
                : notification.type === "warning"
                ? "bg-yellow-900/80 border-yellow-500 text-yellow-100"
                : "bg-blue-900/80 border-blue-500 text-blue-100"
            }`}
          >
            <div className="flex items-start gap-2">
              {notification.type === "error" && (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              {notification.type === "warning" && (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              {notification.type === "info" && (
                <Settings className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    [notifications]
  );

  // Main call interface component
  const CallInterface = useMemo(() => {
    if (callState.state === "none") {
      return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              {ConnectionStatusIndicator}
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
            {audioState.inputLevel > CONFIG.AUDIO_LEVEL_THRESHOLD && (
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
                onClick={() => {
                  if (callState.call) {
                    callState.call.ignore();
                  }
                }}
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
  }, [
    callState,
    connectionState,
    statusMessage,
    identity,
    audioState,
    showSettings,
    formatTime,
    ConnectionStatusIndicator,
    acceptCall,
    rejectCall,
    toggleMute,
    endCall,
  ]);

  // Settings panel
  const SettingsPanel = useMemo(() => {
    if (!showSettings) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Audio Settings</h4>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Microphone
            </label>
            <select
              value={audioState.selectedInput || ""}
              onChange={(e) => setInputDevice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              {audioState.inputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(audioState.inputLevel * 100, 100)}%`,
                  }}
                  className="h-full bg-green-500 transition-all duration-100 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {audioState.hasPermission
                  ? "Microphone level"
                  : "Microphone permission required"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speaker
            </label>
            <select
              value={audioState.selectedOutput || ""}
              onChange={(e) => setOutputDevice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Default</option>
              {audioState.outputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Speaker ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
            <button
              onClick={testAudioDevices}
              className="mt-2 text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
            >
              Test Speaker
            </button>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3">Connection Status</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">WebSocket:</span>
              <span
                className={`ml-2 font-medium ${
                  connectionState.websocket === "connected"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {connectionState.websocket}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Device:</span>
              <span
                className={`ml-2 font-medium ${
                  connectionState.device === "registered"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {connectionState.device}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Reconnect attempts:</span>
              <span className="ml-2 font-medium text-gray-900">
                {connectionState.reconnectAttempts}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Health:</span>
              <span
                className={`ml-2 font-medium ${
                  connectionState.isHealthy ? "text-green-600" : "text-red-600"
                }`}
              >
                {connectionState.isHealthy ? "Healthy" : "Unhealthy"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            {connectionState.device !== "registered" && (
              <button
                onClick={initializeSystem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Initialize System
              </button>
            )}
            <button
              onClick={connectWebSocket}
              disabled={connectionState.websocket === "connected"}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Reconnect
            </button>
          </div>
        </div>
      </div>
    );
  }, [
    showSettings,
    audioState,
    connectionState,
    setInputDevice,
    setOutputDevice,
    testAudioDevices,
    initializeSystem,
    connectWebSocket,
  ]);

  return (
    <div className="space-y-6">
      {NotificationSystem}

      {connectionState.device !== "registered" && (
        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Call Center Setup
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Status: <span className="font-medium">{statusMessage}</span>
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Server: {API_BASE_URL} | Identity: {identity}
          </p>
          <div className="flex gap-2">
            <button
              onClick={initializeSystem}
              disabled={connectionState.device === "initializing"}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              {connectionState.device === "initializing"
                ? "Initializing..."
                : "Initialize System"}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      )}
      {CallInterface}
      {SettingsPanel}
    </div>
  );
};

export default TwilioInboundAgent;
