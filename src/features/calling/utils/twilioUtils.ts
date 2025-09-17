// twilioUtils.ts
export const CONFIG = {
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

export function getWebSocketUrl(apiBase: string, userId: string) {
  let baseUrl = apiBase.replace(/^https?:\/\//, "");
  baseUrl = baseUrl.replace(/\/+$/, "");
  const protocol = apiBase.startsWith("https") ? "wss" : "ws";
  return `${protocol}://${baseUrl}/ws/${userId}`;
}
