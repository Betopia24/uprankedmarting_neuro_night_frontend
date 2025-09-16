"use client";

import { CallProvider } from "@/contexts/CallContext";

export default function AgentDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CallProvider>{children}</CallProvider>;
}
