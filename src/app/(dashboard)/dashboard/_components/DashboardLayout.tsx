"use client";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
  sidebar,
  header,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
} & React.PropsWithChildren) {
  const { isCollapsedSidebar } = useSidebar();
  const sidebarWidth = isCollapsedSidebar
    ? "--_sidebar-collapsed"
    : "--_sidebar-expanded";
  return (
    <div
      style={
        {
          "--_sidebar-spacing": "1rem",
          "--_sidebar-collapsed": "4rem",
          "--_sidebar-expanded": "16.25rem",
          "--_sidebar-icon-container": "2rem",
          "--_sidebar-icon-sm": "1rem",
          "--_sidebar-icon-lg": "1.5rem",
          "--_sidebar-header-height": "4.5rem",
          "--_sidebar-footer-height": "4.5rem",
          gridTemplateColumns: `var(${sidebarWidth}) 1fr`,
          gridTemplateAreas: `'sidebar main'`,
        } as React.CSSProperties
      }
      className={cn(`grid transition-[grid] duration-300`)}
    >
      <div className="[grid-area:sidebar]">{sidebar}</div>
      <div className="[grid-area:main] px-10">
        {header}
        {children}
      </div>
    </div>
  );
}
