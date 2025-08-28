"use client";

import { apiClient } from "@/lib/api";
import { useEffect } from "react";

export default function page() {
  useEffect(() => {
    apiClient
      .get("/auth/me")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return <div>page</div>;
}
