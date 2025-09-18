"use client";

import { cn } from "@/lib/utils";

export default function SkeletonSidebar() {
  return (
    <div className="h-full flex flex-col justify-between gap-6 px-2 animate-pulse">
      {/* main skeleton items */}
      <ul className={cn("space-y-2")}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <li key={idx} className="flex items-center whitespace-nowrap h-10">
            <span className="flex h-10 w-12 shrink-0 items-center justify-center">
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
            </span>
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </li>
        ))}
      </ul>
      {/* sub skeleton items */}
      <ul className={cn("space-y-2")}>
        {Array.from({ length: 2 }).map((_, idx) => (
          <li key={idx} className="flex items-center whitespace-nowrap h-10">
            <span className="flex h-10 w-12 shrink-0 items-center justify-center">
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
            </span>
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </li>
        ))}
      </ul>
    </div>
  );
}