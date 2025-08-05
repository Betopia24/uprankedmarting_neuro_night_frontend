"use client";
import { SidebarToggleButton } from "./DashboardSidebar";

export default function DashboardHeader() {
  return (
    <div className="-mx-[var(--_sidebar-spacing)] px-[var(--_sidebar-spacing)] py-[var(--_sidebar-spacing)] sticky top-0 flex items-center gap-[var(--_sidebar-spacing)] bg-[#F8F8F8 h-[var(--_sidebar-header-height)]">
      <SidebarToggleButton /> <Separator />
    </div>
  );
}

function Separator() {
  return <div className="h-6 w-px bg-secondary"></div>;
}
