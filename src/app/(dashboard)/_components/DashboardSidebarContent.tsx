"use client";

import { useSidebar } from "./SidebarProvider";
import React, { cloneElement } from "react";
import { motion } from "framer-motion";
import DashboardActiveLink from "./DashboardActiveLink";
import { cn } from "@/lib/utils";

export type SidebarItemType = {
  name: string;
  href: string;
  icon: React.ReactElement<{ className?: string }>; // Specify that icon accepts className
};

type SidebarContentType = {
  mainItems: SidebarItemType[];
  subItems?: SidebarItemType[];
};

export default function SidebarContent({
  mainItems,
  subItems,
}: SidebarContentType) {
  const { isCollapsedSidebar, isExpanded } = useSidebar();
  return (
    <div className="h-full flex flex-col justify-between gap-6 px-6">
      <ul className={cn("space-y-2", isCollapsedSidebar && "space-y-4")}>
        {mainItems.map((item) => (
          <li key={item.name}>
            <DashboardActiveLink
              className={cn(
                "flex items-center gap-2 whitespace-nowrap",
                isExpanded && "py-2 px-6"
              )}
              href={item.href}
            >
              {cloneElement(item.icon as React.ReactElement<any>, {
                className: "size-5 text-gray-500 shrink-0",
              })}
              <AnimatedLabel>{item.name}</AnimatedLabel>
            </DashboardActiveLink>
          </li>
        ))}
      </ul>
      <ul className={cn("space-y-2", isCollapsedSidebar && "space-y-4")}>
        {subItems &&
          subItems.map((item) => (
            <li key={item.name}>
              <DashboardActiveLink
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap",
                  isExpanded && "py-2 px-6"
                )}
                href={item.href}
              >
                {cloneElement(item.icon as React.ReactElement<any>, {
                  className: "size-5 text-gray-500 shrink-0",
                })}
                <AnimatedLabel>{item.name}</AnimatedLabel>
              </DashboardActiveLink>
            </li>
          ))}
      </ul>
    </div>
  );
}

const animatedLabelVariants = {
  collapsed: {
    opacity: 0,
  },
  expanded: {
    opacity: 1,
  },
};

function AnimatedLabel({ children }: React.PropsWithChildren) {
  const { isExpanded } = useSidebar();

  return (
    isExpanded && (
      <motion.span
        variants={animatedLabelVariants}
        initial="collapsed"
        animate="expanded"
      >
        {children}
      </motion.span>
    )
  );
}
