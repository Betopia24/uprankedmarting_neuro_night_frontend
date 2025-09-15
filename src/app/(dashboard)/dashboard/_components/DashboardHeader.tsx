"use client";

import ProfileButton from "@/components/ProfileButton";
import DashboardHeaderTitle from "./DashboardHeaderTitle";
import { usePathname } from "next/navigation";
import { formatUrlSegment } from "@/utils/url";

const config = {
  organization: "Dashboard",
  admin: "Dashboard",
  agent: "Dashboard",
};

function isIdSegment(segment: string) {
  // Detect MongoDB ObjectId (24 hex chars)
  return /^[0-9a-fA-F]{24}$/.test(segment);
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // removes empty strings
  const segment = parts[parts.length - 1];

  let title: string;
  if (config[segment as keyof typeof config]) {
    title = config[segment as keyof typeof config];
  } else if (isIdSegment(segment)) {
    title = "Agent Information";
  } else {
    title = formatUrlSegment(segment);
  }

  return (
    <div className="px-[var(--_sidebar-spacing)] flex items-center gap-[var(--_sidebar-spacing)] h-[var(--_sidebar-header-height)] bg-gray-50 border-b border-l border-l-gray-100 border-b-gray-100 shadow-xs">
      <div className="flex justify-between items-center gap-2 flex-1">
        <DashboardHeaderTitle>{title}</DashboardHeaderTitle>
        <ProfileButton />
      </div>
    </div>
  );
}
