"use client";
import { Container } from "@/components";
import DashboardHeader from "./DashboardHeader";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
  sidebar,
  header,
}: {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
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
          "--_sidebar-icon-sm": "1.5rem",
          "--_sidebar-icon-lg": "1.7rem",
          "--_sidebar-header-height": "4.5rem",
          "--_sidebar-footer-height": "2.5rem",
          gridTemplateColumns: `var(${sidebarWidth}) 1fr`,
          gridTemplateAreas: `'sidebar main'`,
        } as React.CSSProperties
      }
      className={cn(`grid transition-[grid] duration-300`)}
    >
      <div className="[grid-area:sidebar]">{sidebar}</div>
      <div className="[grid-area:main] pr-6 -mr-6 overflow-x-scroll">
        <div className="sticky top-0 z-50 px-4">
          {header && <DashboardHeader />}
        </div>
        <div className="px-4">
          <div
            style={{
              minHeight: "calc(100vh - var(--_sidebar-header-height))",
            }}
            className="bg-gray-50  border-l border-l-gray-100 shadow-xs p-4"
          >
            <Container>{children}</Container>
          </div>
        </div>
      </div>
    </div>
  );
}
