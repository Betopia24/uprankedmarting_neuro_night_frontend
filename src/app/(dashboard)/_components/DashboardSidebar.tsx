"use client";

import {
  LucidePackage,
  LucidePanelLeftDashed,
  LucidePanelRightDashed,
  LucideUser,
} from "lucide-react";
import { motion } from "framer-motion";
import { createElement } from "react";

import Heading from "@/components/Heading";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";

import { useSidebar } from "./SidebarProvider";

export default function Sidebar() {
  const { handlePointerEnter, handlePointerLeave, isCollapsedSidebar } =
    useSidebar();

  return (
    <motion.nav
      className={cn(
        "h-screen flex flex-col border-r border-border bg-sidebar gap-4 z-50 sticky top-0 text-sm whitespace-nowrap"
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
      <SidebarHeader />

      <div className="flex-1 overflow-y-scroll space-y-[var(--_sidebar-spacing)]"></div>

      <SidebarFooter />
    </motion.nav>
  );
}

function SidebarHeader() {
  const { isExpanded } = useSidebar();

  return (
    <div className="p-[var(--_sidebar-spacing)] flex gap-2 items-center relative h-[var(--_sidebar-header-height)] after:absolute after:bottom-0 after:inset-x-2 after:h-px after:bg-border">
      <span className="bg-accent text-primary rounded">
        <SidebarIcon icon={LucidePackage} size="lg" />
      </span>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2"
        >
          <Heading as="h4" className="leading-2.5">
            App Name
          </Heading>
          <span className="text-sm text-muted-foreground">
            Enterprise Edition
          </span>
        </motion.div>
      )}
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
        >
          <Heading as="h4" className="leading-2.5">
            Sarah Johnson
          </Heading>
          <span className="text-sm text-muted-foreground">
            Store Administrator
          </span>
        </motion.div>
      )}
    </div>
  );
}

function ActiveLabel({
  children,
  className,
  leftExpanded,
}: { leftExpanded?: boolean } & React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "block relative hover:bg-accent hover:text-accent-foreground rounded-sm [.is-active-link_&]:bg-accent [.is-active-link_&]:text-accent-foreground",
        {
          "-ml-[var(--_sidebar-spacing)] px-[var(--_sidebar-spacing)]":
            leftExpanded,
        },
        className
      )}
    >
      {children}
    </span>
  );
}

function AnimatedLabel({ children }: React.PropsWithChildren) {
  const { isExpanded } = useSidebar();

  return isExpanded ? (
    <motion.span
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="py-1 block"
    >
      {children}
    </motion.span>
  ) : null;
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
    <Button onClick={toggleSidebarCollapse}>
      {isExpanded ? (
        <LucidePanelLeftDashed className="size-4" />
      ) : (
        <LucidePanelRightDashed className="size-4" />
      )}
    </Button>
  );
}
