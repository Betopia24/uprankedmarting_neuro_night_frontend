"use client";

import { useEffect } from "react";
import { Loading } from "@/components";

export default function Unauthorized() {
  useEffect(() => {
    window.location.href = "/";
  }, []);

  return (
    <div className="grid h-screen place-items-center fixed inset-0 z-50 bg-white">
      <Loading />
    </div>
  );
}
