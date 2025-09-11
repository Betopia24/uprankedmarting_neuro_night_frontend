"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ViewType } from "@/types/agent";

const TAB_ITEMS: { key: ViewType; label: string }[] = [
  { key: "unassigned", label: "View Agent List" },
  { key: "my-agents", label: "View My Agent List" },
];

export default function Tabs({ selectedTab }: { selectedTab: ViewType }) {
  const pathname = usePathname();
  const [loadingTab, setLoadingTab] = useState<ViewType | null>(null);

  // Reset loader once URL path/query changes
  useEffect(() => {
    if (loadingTab) setLoadingTab(null);
  }, [pathname]);

  return (
    <div className="flex gap-1">
      {TAB_ITEMS.map((tab, idx) => {
        const roundedClass =
          idx === 0
            ? "rounded-tl rounded-bl"
            : idx === TAB_ITEMS.length - 1
            ? "rounded-tr rounded-br"
            : "";

        return (
          <Link
            key={tab.key}
            href={{ pathname: "agent-management", query: { view: tab.key } }}
            className={cn(
              "px-3 py-1 border border-gray-300 flex items-center gap-2 transition-all duration-200",
              roundedClass,
              selectedTab === tab.key && "bg-primary text-white"
            )}
            onClick={() => {
              if (tab.key !== selectedTab) setLoadingTab(tab.key);
            }}
          >
            {tab.label}
            {loadingTab === tab.key && (
              <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
