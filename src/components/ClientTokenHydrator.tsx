"use client";
import { useEffect, useState } from "react";
import accessTokenMemory from "@/lib/accessTokenMemory";

export default function ClientTokenHydrator() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function init() {
      const tokenRes = await fetch("/api/token", { method: "POST" });
      if (!tokenRes.ok) return;
      const tokenData = await tokenRes.json();
      accessTokenMemory.set(tokenData);
      setHydrated(true);
    }
    init();
  }, []);

  if (!hydrated) return null;
  return null;
}
