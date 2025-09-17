"use client";

import { Settings } from "lucide-react";
import React from "react";

export type AudioDevice = {
  deviceId: string;
  label: string;
};

export type AudioState = {
  selectedInput?: string;
  selectedOutput?: string;
  inputDevices: AudioDevice[];
  outputDevices: AudioDevice[];
  inputLevel: number; // 0–1
  hasPermission: boolean;
};

export type ConnectionState = {
  websocket: "connected" | "disconnected" | "error";
  device: "registered" | "unregistered" | "error";
  isHealthy: boolean;
  reconnectAttempts: number;
};

type Props = {
  show: boolean;
  audioState: AudioState;
  connectionState: ConnectionState;

  setShow: (value: boolean) => void;
  setInputDevice: (deviceId: string) => void;
  setOutputDevice: (deviceId: string) => void;

  testAudioDevices: () => void;
  initializeSystem: () => void;
  connectWebSocket: () => void;
};

//
// 2. Standalone component
//
export default function SettingsPanel({
  show,
  audioState,
  connectionState,
  setShow,
  setInputDevice,
  setOutputDevice,
  testAudioDevices,
  initializeSystem,
  connectWebSocket,
}: Props) {
  if (!show) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Audio Settings</h4>
        <button
          onClick={() => setShow(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Microphone */}
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

          {/* Mic Level */}
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

        {/* Speaker */}
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

      {/* Connection Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h5 className="font-medium text-gray-900 mb-3">Connection Status</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <StatusRow
            label="WebSocket"
            value={connectionState.websocket}
            healthy={connectionState.websocket === "connected"}
          />
          <StatusRow
            label="Device"
            value={connectionState.device}
            healthy={connectionState.device === "registered"}
          />
          <StatusRow
            label="Reconnect attempts"
            value={String(connectionState.reconnectAttempts)}
          />
          <StatusRow
            label="Health"
            value={connectionState.isHealthy ? "Healthy" : "Unhealthy"}
            healthy={connectionState.isHealthy}
          />
        </div>
      </div>

      {/* Actions */}
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
}

//
// 3. Small helper component for consistent status rows
//
function StatusRow({
  label,
  value,
  healthy,
}: {
  label: string;
  value: string;
  healthy?: boolean;
}) {
  return (
    <div>
      <span className="text-gray-600">{label}:</span>
      <span
        className={`ml-2 font-medium ${
          healthy === undefined
            ? "text-gray-900"
            : healthy
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
