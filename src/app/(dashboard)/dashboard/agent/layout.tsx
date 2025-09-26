"use client";

import { redirect } from "next/navigation";
import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent from "../_components/DashboardSidebarContent";
import { dashboardNavigation } from "@/data/dashboardNavbar";
import { requireAuth } from "@/lib/auth";
import { unauthorizedPath } from "@/paths";
import { useAuth } from "@/components/AuthProvider";

export default function AgentDashboardLayout({
  children,
}: React.PropsWithChildren) {
  const { user } = useAuth();
  if (user?.role !== "agent") return redirect(unauthorizedPath());
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          header={<DashboardHeader />}
          sidebar={
            <DashboardSidebar>
              <SidebarContent
                mainItems={dashboardNavigation.agent}
                subItems={dashboardNavigation?.subItems?.agent}
              />
            </DashboardSidebar>
          }
        >
          <div className="mt-4">{children}</div>
        </DashboardLayout>
      </SidebarProvider>
    </>
  );
}
