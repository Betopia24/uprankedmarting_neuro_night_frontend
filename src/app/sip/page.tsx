"use client";

import { apiClient } from "@/lib/api";
import { useEffect } from "react";

export default function page() {
  useEffect(() => {
    apiClient.get("/auth/me").then((res) => console.log(res));
  }, []);
  return <div>page</div>;
}
