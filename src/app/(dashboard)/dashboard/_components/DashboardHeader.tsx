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

export default function DashboardHeader() {
  const pathname = usePathname();
  const segment = pathname
    .split("/")

    .slice(pathname.split("/").length - 1)[0];

  return (
    <div className="px-[var(--_sidebar-spacing)] flex items-center gap-[var(--_sidebar-spacing)] h-[var(--_sidebar-header-height)] bg-gray-50 border-b border-l border-l-gray-100 border-b-gray-100 shadow-xs">
      <div className="flex justify-between items-center gap-2 flex-1">
        <DashboardHeaderTitle>
          {config[segment as keyof typeof config] || formatUrlSegment(segment)}
        </DashboardHeaderTitle>
        <ProfileButton />
      </div>
    </div>
  );
}
