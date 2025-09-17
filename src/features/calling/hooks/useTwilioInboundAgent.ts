// useTwilioInboundAgent.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import { useAuth } from "@/components/AuthProvider";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { CONFIG, getWebSocketUrl } from "../utils/twilioUtils";
import type { AudioState, CallState, ConnectionState } from "../types/types";

/**
 * Hook: useTwilioInboundAgent
 * - Contains all logic from the monolith extracted as-is.
 * - Returns state + actions + small UI helpers (ConnectionStatusIndicator, NotificationSystem).
 *
 * NOTE: The hook preserves original behavior. I applied useCallback/useMemo and safer cleanup
 * to avoid unnecessary re-renders and possible memory leaks.
 */

export function useTwilioInboundAgent(identity: string) {
  const { token, user } = useAuth();

  // States
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

  // Refs
  const deviceRef = useRef<Device | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentCallRef = useRef<any | null>(null);
  const isMountedRef = useRef(true);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const callTimerRef = useRef<number | null>(null);
  const qualityCheckRef = useRef<number | null>(null);
  const tokenRefreshRef = useRef<number | null>(null);
  const connectionCheckRef = useRef<number | null>(null);
  const callAcceptTimeoutRef = useRef<number | null>(null);

  // Audio monitoring refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_CALL_CENTER_API_URL || "http://127.0.0.1:9050";

  // Helper: add notification
  const addNotification = useCallback(
    (type: "error" | "warning" | "info", message: string) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev.slice(-4), { id, type, message }]);

      const timeout = type === "error" ? 10000 : 5000;
      window.setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, timeout);
    },
    []
  );

  const updateStatusMessage = useCallback(
    (message: string, type?: "error" | "warning" | "info") => {
      setStatusMessage(message);
      if (type) addNotification(type, message);
    },
    [addNotification]
  );

  // Audio permission & monitoring
  const initializeAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // create audio context only once
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let rafId = 0;
      const updateAudioLevel = () => {
        if (!isMountedRef.current || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const level = average / 255;
        setAudioState((prev) => ({ ...prev, inputLevel: level }));
        rafId = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();

      setAudioState((prev) => ({ ...prev, hasPermission: true }));
      updateStatusMessage("Audio monitoring initialized");
      // keep analyser running until cleanup
    } catch (err) {
      console.error("Failed to initialize audio monitoring:", err);
      setAudioState((prev) => ({ ...prev, hasPermission: false }));
      updateStatusMessage("Microphone permission required", "error");
    }
  }, [updateStatusMessage]);

  // Device enumeration
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

      // preserve previous behavior: no further action required
      if (device?.audio) {
        // original code created maps, but didn't use them for setting state
        // keep that side effect-free
      }
    } catch (err) {
      console.error("Failed to update audio devices:", err);
    }
  }, []);

  // Token fetch
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

  // Token refresh scheduling
  const scheduleTokenRefresh = useCallback(() => {
    if (tokenRefreshRef.current) {
      clearTimeout(tokenRefreshRef.current);
      tokenRefreshRef.current = null;
    }

    tokenRefreshRef.current = window.setTimeout(async () => {
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

        window.setTimeout(async () => {
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
  const startCallQualityMonitoring = useCallback((call: any) => {
    if (qualityCheckRef.current) {
      clearInterval(qualityCheckRef.current);
      qualityCheckRef.current = null;
    }

    qualityCheckRef.current = window.setInterval(() => {
      if (
        !call ||
        typeof call.status !== "function" ||
        call.status() !== "open"
      ) {
        if (qualityCheckRef.current) {
          clearInterval(qualityCheckRef.current);
          qualityCheckRef.current = null;
        }
        return;
      }

      setCallState((prev) => ({
        ...prev,
        quality: "good", // preserve original simplified logic
      }));
    }, CONFIG.CALL_QUALITY_CHECK_INTERVAL);
  }, []);

  // Attach call handlers (kept same as original)
  const attachCallHandlers = useCallback(
    (call: any) => {
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
        if (callTimerRef.current) {
          clearInterval(callTimerRef.current);
          callTimerRef.current = null;
        }
        callTimerRef.current = window.setInterval(() => {
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
              data: { agent_id: user?.id, status: "free" },
            })
          );
        }

        if (callTimerRef.current) {
          clearInterval(callTimerRef.current);
          callTimerRef.current = null;
        }
        if (qualityCheckRef.current) {
          clearInterval(qualityCheckRef.current);
          qualityCheckRef.current = null;
        }
        if (callAcceptTimeoutRef.current) {
          clearTimeout(callAcceptTimeoutRef.current);
          callAcceptTimeoutRef.current = null;
        }
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
          callAcceptTimeoutRef.current = null;
        }
      });

      call.on("error", (err: { message: string }) => {
        if (!isMountedRef.current) return;

        console.error("Call error:", err);
        updateStatusMessage(
          `Call error: ${err?.message || "Unknown error"}`,
          "error"
        );

        window.setTimeout(() => {
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

      call.on("warning", (name: string, data: { message: string }) => {
        console.warn("Call quality warning:", name, data);
        setCallState((prev) => ({ ...prev, quality: "poor" }));
        updateStatusMessage(`Call quality warning: ${name}`, "warning");
      });

      call.on("warning-cleared", (name: string) => {
        console.log("Call quality warning cleared:", name);
        setCallState((prev) => ({ ...prev, quality: "good" }));
      });
    },
    [startCallQualityMonitoring, updateStatusMessage, user?.id]
  );

  // Initialize Twilio Device
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

      device.on("error", (err: { message: string }) => {
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

      device.on("incoming", (call: any) => {
        if (!isMountedRef.current) return;

        console.log("Incoming call received:", call.parameters);

        const from = call.parameters?.From || "Unknown";

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
          // keep same behavior as original
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          new Notification("Incoming Call", {
            body: `Call from ${from}`,
            icon: "/phone-icon.png",
            tag: "incoming-call",
          });
        }

        if (callAcceptTimeoutRef.current) {
          clearTimeout(callAcceptTimeoutRef.current);
          callAcceptTimeoutRef.current = null;
        }
        callAcceptTimeoutRef.current = window.setTimeout(() => {
          // Use latest callState via ref? preserve original behavior: check state variable closure
          // We'll use currentCallRef to check if still incoming
          if (currentCallRef.current && currentCallRef.current === call) {
            try {
              call.reject();
            } catch (e) {
              // ignore
            }
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
    [attachCallHandlers, fetchToken, updateAudioDevices, updateStatusMessage]
  );

  // Register device
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
      window.setTimeout(async () => {
        if (isMountedRef.current) {
          try {
            const newToken = await fetchToken();
            deviceRef?.current?.updateToken(newToken);
            await registerDevice();
          } catch (retryErr) {
            console.error("Retry registration failed:", retryErr);
            updateStatusMessage("Retry registration failed", "error");
          }
        }
      }, retryDelay);
    }
  }, [updateStatusMessage, fetchToken, connectionState.reconnectAttempts]);

  // WebSocket connect
  const connectWebSocket = useCallback(() => {
    if (!user?.id || !token || !isMountedRef.current) {
      console.log("Waiting for authentication...");
      return;
    }

    console.log("Connecting WebSocket for user:", user.id);

    const wsUrl = getWebSocketUrl(API_BASE_URL, user.id);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const connectionTimeout = window.setTimeout(() => {
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
        try {
          ws.send(
            JSON.stringify({
              type: "agent_register",
              data: { agent_id: user.id, token },
            })
          );
        } catch (e) {
          // ignore send errors
        }
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
  }, [user?.id, token, API_BASE_URL, updateStatusMessage]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionState((prev) => {
      const attempts = prev.reconnectAttempts + 1;
      const delay = Math.min(
        CONFIG.WEBSOCKET_RECONNECT_INTERVAL * Math.pow(2, attempts),
        60000
      );

      reconnectTimeoutRef.current = window.setTimeout(() => {
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
      heartbeatIntervalRef.current = null;
    }

    heartbeatIntervalRef.current = window.setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      } else {
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      }
    }, CONFIG.HEARTBEAT_INTERVAL);
  }, []);

  const handleWebSocketMessage = useCallback(
    (message: { type: string; data: { message?: string } }) => {
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
        callAcceptTimeoutRef.current = null;
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
            data: { agent_id: user?.id, status: "free" },
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
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      if (qualityCheckRef.current) {
        clearInterval(qualityCheckRef.current);
        qualityCheckRef.current = null;
      }
      if (callAcceptTimeoutRef.current) {
        clearTimeout(callAcceptTimeoutRef.current);
        callAcceptTimeoutRef.current = null;
      }
    }
  }, [updateStatusMessage, user?.id]);

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

  const initializeSystem = useCallback(async () => {
    try {
      updateStatusMessage("Requesting microphone permission...");
      await initializeAudioMonitoring();

      updateStatusMessage("Fetching access token...");
      const accessToken = await fetchToken();

      updateStatusMessage("Initializing device...");
      await initializeDevice(accessToken);

      updateStatusMessage("Registering device...");
      await registerDevice();

      scheduleTokenRefresh();

      if ("Notification" in window && Notification.permission === "default") {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Notification.requestPermission();
      }
    } catch (err: unknown) {
      console.error("System initialization failed:", err);

      const message = getErrorMessage(err, "System initialization failed");
      updateStatusMessage(`Initialization failed: ${message}`, "error");
    }
  }, [
    initializeAudioMonitoring,
    fetchToken,
    initializeDevice,
    registerDevice,
    scheduleTokenRefresh,
    updateStatusMessage,
  ]);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Set input/output devices
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

  // Connection health check effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;

      // cleanup
      const refs = [
        reconnectTimeoutRef,
        heartbeatIntervalRef,
        callTimerRef,
        qualityCheckRef,
        tokenRefreshRef,
        connectionCheckRef,
        callAcceptTimeoutRef,
      ] as Array<React.MutableRefObject<number | null>>;

      refs.forEach((r) => {
        if (r.current) {
          clearTimeout(r.current);
          clearInterval(r.current);
          r.current = null;
        }
      });

      if (wsRef.current) {
        try {
          wsRef.current.close(1000, "Component unmounting");
        } catch (e) {
          // ignore
        }
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
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    connectionCheckRef.current = window.setInterval(
      checkConnection,
      CONFIG.CONNECTION_STATE_CHECK_INTERVAL
    );

    return () => {
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
        connectionCheckRef.current = null;
      }
    };
  }, [connectionState.lastHeartbeat, updateStatusMessage]);

  // ConnectionStatusIndicator (memoized UI node)
  const ConnectionStatusIndicator = useMemo(() => {
    const { websocket, device, isHealthy } = connectionState;

    let status: "connected" | "warning" | "error";
    let icon: React.ReactNode;
    let message: string;

    // These icons were part of the original code's UI; caller can render them
    // We do not import lucide icons here to keep hook UI-neutral; return descriptor instead.
    if (websocket === "connected" && device === "registered" && isHealthy) {
      status = "connected";
      message = "Connected";
    } else if (websocket === "connecting" || device === "initializing") {
      status = "warning";
      message = "Connecting...";
    } else {
      status = "error";
      message = "Disconnected";
    }

    return { status, message };
  }, [connectionState]);

  // NotificationSystem: keep data structure only (UI rendering belongs to component)
  const NotificationSystem = useMemo(() => notifications, [notifications]);

  // Expose everything needed by the component
  return {
    // states
    callState,
    connectionState,
    audioState,
    statusMessage,
    showSettings,
    notifications,

    // set/show
    setShowSettings,

    // actions
    initializeSystem,
    connectWebSocket,
    registerDevice,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    setInputDevice,
    setOutputDevice,
    testAudioDevices,

    // utilities
    formatTime,

    // small ui descriptors
    ConnectionStatusIndicator,
    NotificationSystem,
  } as const;
}
