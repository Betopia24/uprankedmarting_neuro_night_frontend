"use client";

import { cn } from "@/lib/utils";
import { ViewType } from "@/types/agent";

const TAB_ITEMS: { key: ViewType; label: string }[] = [
  { key: "unassigned", label: "View Agent List" },
  { key: "my-agents", label: "View My Agent List" },
];

interface TabsProps {
  selectedTab: ViewType;
  onTabChange: (tab: ViewType) => void;
}

export default function Tabs({ selectedTab, onTabChange }: TabsProps) {
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
          <button
            key={tab.key}
            className={cn(
              "px-3 py-1 border border-gray-300 flex items-center gap-2 transition-all duration-200",
              roundedClass,
              selectedTab === tab.key && "bg-primary text-white"
            )}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
