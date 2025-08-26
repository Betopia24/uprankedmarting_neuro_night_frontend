"use client";

import { useEffect, useState } from "react";

export function useTokenManager(
  initialToken: string | null,
  expiresInMs = 15 * 60 * 1000
) {
  const [accessToken, setAccessToken] = useState(initialToken);

  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/refresh");
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
        }
      } catch (err) {
        console.error("Token refresh failed", err);
      }
    }, expiresInMs - 2 * 60 * 1000); // refresh 2 mins before expiry

    return () => clearInterval(interval);
  }, [accessToken, expiresInMs]);

  return accessToken;
}
