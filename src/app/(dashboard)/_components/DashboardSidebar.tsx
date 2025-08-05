"use client";

import { ChevronsRight, LucideUser } from "lucide-react";
import { motion } from "framer-motion";
import React, { createElement } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { Logo } from "@/components";

export default function Sidebar({ children }: React.PropsWithChildren) {
  const { handlePointerEnter, handlePointerLeave, isCollapsedSidebar } =
    useSidebar();

  return (
    <motion.nav
      className={cn(
        "h-screen flex flex-col bg-[#ECF1F8] gap-4 z-50 sticky top-0 text-sm whitespace-nowrap relative"
      )}
      style={{
        width: isCollapsedSidebar
          ? "var(--_sidebar-collapsed)"
          : "var(--_sidebar-expanded)",
      }}
      animate={{
        width: isCollapsedSidebar
          ? "var(--_sidebar-collapsed)"
          : "var(--_sidebar-expanded)",
      }}
      whileHover={{
        width: "var(--_sidebar-expanded)",
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute right-0 top-0 z-10">
        <SidebarToggleButton />
      </div>
      <SidebarHeader />

      <div className="flex-1 space-y-[var(--_sidebar-spacing)]">{children}</div>

      <SidebarFooter />
    </motion.nav>
  );
}

function SidebarHeader() {
  return (
    <div className="p-[var(--_sidebar-spacing)] flex gap-2 items-center relative h-[var(--_sidebar-header-height)] after:absolute after:bottom-0 after:inset-x-2 after:h-px after:bg-border">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-2 shrink-0 flex w-full justify-center"
      >
        <Logo />
      </motion.div>
    </div>
  );
}

function SidebarFooter() {
  const { isExpanded } = useSidebar();

  return (
    <div className="p-4 flex gap-2 items-start h-[var(--_sidebar-footer-height)]">
      <span className="bg-accent text-primary rounded">
        <SidebarIcon icon={LucideUser} size="lg" />
      </span>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2"
        ></motion.div>
      )}
    </div>
  );
}

function SidebarIcon({
  icon,
  size = "sm",
}: {
  icon: React.ComponentType<{ className: string }>;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={
        "size-[var(--_sidebar-icon-container)] leading-0 flex items-center justify-center shrink-0"
      }
    >
      {createElement(icon, {
        className: cn({
          "size-[var(--_sidebar-icon-sm)]": size === "sm",
          "size-[var(--_sidebar-icon-lg)]": size === "lg",
        }),
      })}
    </span>
  );
}

export function SidebarToggleButton() {
  const { isExpanded, toggleSidebarCollapse } = useSidebar();
  return (
    <button className="p-1 cursor-pointer" onClick={toggleSidebarCollapse}>
      <ChevronsRight
        className={cn(
          "size-4 text-gray-500",
          isExpanded ? "-scale-100" : "scale-100"
        )}
      />
    </button>
  );
}
