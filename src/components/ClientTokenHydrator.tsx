"use client";

import { useEffect, useState } from "react";
import accessTokenMemory from "@/lib/accessTokenMemory";

export default function ClientTokenHydrator() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function init() {
      const tokenRes = await fetch("/api/token", { method: "POST" });
      if (!tokenRes.ok) return;

      const tokenData = await tokenRes.json(); // { accessToken, role }
      accessTokenMemory.set(tokenData);
      setHydrated(true);
    }

    init();
  }, []);

  if (!hydrated) return <>loading</>;
  return null;
}
