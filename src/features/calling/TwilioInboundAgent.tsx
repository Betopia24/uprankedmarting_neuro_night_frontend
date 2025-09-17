// TwilioInboundAgent.tsx
"use client";

import React from "react";
import {
  Wifi,
  WifiOff,
  Signal,
  AlertTriangle,
  Settings,
  Phone,
  PhoneOff,
  PhoneCall,
  MessageCircle,
  User,
  Mic,
  MicOff,
  Clock,
  Volume2,
} from "lucide-react";
import CallInterface from "@/features/calling/CallInterface";
import SettingsPanel from "@/features/calling/SettingsPanel"; // if you have settings panel as a component
import { useTwilioInboundAgent } from "./hooks/useTwilioInboundAgent";

import type { TwilioInboundAgentProps } from "./types/types";

/**
 * TwilioInboundAgent component:
 * - consumes the useTwilioInboundAgent hook
 * - renders UI exactly as original monolith did
 * - uses returned state + functions
 *
 * I kept the UI markup and classNames unchanged (except for icon placements where necessary)
 */

const TwilioInboundAgent: React.FC<TwilioInboundAgentProps> = ({
  identity,
}) => {
  const {
    callState,
    connectionState,
    audioState,
    statusMessage,
    showSettings,
    notifications,
    setShowSettings,
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
    formatTime,
    ConnectionStatusIndicator,
    NotificationSystem,
  } = useTwilioInboundAgent(identity);

  // Notification rendering (exact same markup)
  const NotificationNodes = (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {NotificationSystem.map((notification) => (
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
  );

  // Connection status indicator (map to original UI)
  const ConnectionIndicatorNode = (() => {
    const { status, message } = ConnectionStatusIndicator;
    let icon = <WifiOff className="w-4 h-4 text-red-400" />;
    if (status === "connected")
      icon = <Wifi className="w-4 h-4 text-green-400" />;
    if (status === "warning")
      icon = <Signal className="w-4 h-4 text-yellow-400 animate-pulse" />;

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
  })();

  return (
    <div className="space-y-6">
      {NotificationNodes}

      {connectionState.device !== "registered" && (
        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Call Center Setup
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Status: <span className="font-medium">{statusMessage}</span>
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Server:{" "}
            {process.env.NEXT_PUBLIC_CALL_CENTER_API_URL ||
              "http://127.0.0.1:9050"}{" "}
            | Identity: {identity}
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

      {/* Keep the CallInterface usage identical to your original code */}
      <CallInterface
        callState={
          callState.state === "none"
            ? { state: "none" }
            : callState.state === "incoming"
            ? { state: "incoming", from: callState.from, call: callState.call }
            : {
                state: "active",
                from: callState.from,
                duration: callState.duration,
                quality: callState.quality,
              }
        }
        connectionState={{
          device: connectionState.device,
          isHealthy: connectionState.isHealthy,
          lastHeartbeat: connectionState.lastHeartbeat
            ? connectionState.lastHeartbeat.getTime()
            : undefined,
        }}
        audioState={{
          inputLevel: audioState.inputLevel,
          outputLevel: audioState.outputLevel,
          isMuted: audioState.isMuted,
        }}
        identity={identity}
        statusMessage={statusMessage}
        showSettings={showSettings}
        connectWebSocket={connectWebSocket}
        registerDevice={registerDevice}
        acceptCall={acceptCall}
        rejectCall={rejectCall}
        endCall={endCall}
        toggleMute={toggleMute}
        setShowSettings={setShowSettings}
      />

      {/* Settings panel: if you have an existing SettingsPanel component you can pass props exactly */}
      {showSettings && (
        <div className="mt-4">
          {/* If you extracted the SettingsPanel earlier, render it here.
              Otherwise keep your original inline markup. */}
          {/*
            <SettingsPanel
              show={showSettings}
              audioState={audioState}
              connectionState={{
                websocket: connectionState.websocket,
                device: connectionState.device,
                isHealthy: connectionState.isHealthy,
                reconnectAttempts: connectionState.reconnectAttempts,
              }}
              setShow={setShowSettings}
              setInputDevice={setInputDevice}
              setOutputDevice={setOutputDevice}
              testAudioDevices={testAudioDevices}
              initializeSystem={initializeSystem}
              connectWebSocket={connectWebSocket}
            />
          */}
          {/* Fallback: render minimal settings inline if SettingsPanel not available */}
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
                      {device.label ||
                        `Microphone ${device.deviceId.slice(0, 8)}`}
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
              <h5 className="font-medium text-gray-900 mb-3">
                Connection Status
              </h5>
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
                      connectionState.isHealthy
                        ? "text-green-600"
                        : "text-red-600"
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
        </div>
      )}
    </div>
  );
};

export default TwilioInboundAgent;
