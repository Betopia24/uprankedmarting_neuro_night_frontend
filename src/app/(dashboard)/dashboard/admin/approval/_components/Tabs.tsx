"use client";

import Link from "next/link";
import { StatusType } from "@/types/agent";
import { cn } from "@/lib/utils";

interface TabsProps {
  selectedTab: StatusType;
}

// Define tabs once, outside component to avoid recreating array every render
const TAB_ITEMS: { key: StatusType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "approval", label: "Approval" },
  { key: "removal", label: "Removal" },
];

export default function Tabs({ selectedTab }: TabsProps) {
  return (
    <div className="flex">
      {TAB_ITEMS.map((tab, idx) => {
        // Determine rounded corners for first and last items
        const roundedClass =
          idx === 0
            ? "rounded-tl rounded-bl"
            : idx === TAB_ITEMS.length - 1
            ? "rounded-tr rounded-br"
            : "";

        return (
          <Link
            key={tab.key}
            href={{ pathname: "approval", query: { status: tab.key } }}
            className={cn(
              "px-3 py-1 border border-gray-300",
              roundedClass,
              selectedTab === tab.key && "bg-primary text-white"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
