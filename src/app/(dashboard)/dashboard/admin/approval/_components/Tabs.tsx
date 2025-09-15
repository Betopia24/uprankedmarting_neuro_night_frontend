"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { StatusType } from "@/types/agent";
import { useState, useTransition } from "react";

// Only approval and removal
const TAB_ITEMS: { key: StatusType; label: string }[] = [
  { key: "approval", label: "Approval" },
  { key: "removal", label: "Removal" },
];

export default function Tabs({ selectedTab }: { selectedTab: StatusType }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<StatusType>(selectedTab);

  const handleTabClick = (tabKey: StatusType) => {
    if (tabKey === activeTab) return;
    setActiveTab(tabKey);
    startTransition(() => {
      router.push(`?status=${tabKey}`, { scroll: false });
    });
  };

  return (
    <div className="flex items-center gap-2">
      {TAB_ITEMS.map((tab, idx) => {
        const roundedClass =
          idx === 0
            ? "rounded-l"
            : idx === TAB_ITEMS.length - 1
            ? "rounded-r"
            : "";

        return (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            disabled={isPending && activeTab === tab.key}
            className={cn(
              "px-4 py-2 border hover:text-blue-500 border-gray-300 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-100",
              roundedClass,
              selectedTab === tab.key && "bg-primary text-white",
              isPending && activeTab === tab.key ? "opacity-80 cursor-wait" : ""
            )}
          >
            {tab.label}
            {/* Animated Spinner */}
            {isPending && activeTab === tab.key && (
              <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
