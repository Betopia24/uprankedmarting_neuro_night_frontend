"use client";
import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent from "../_components/DashboardSidebarContent";
import { dashboardNavigation } from "@/data/dashboardNavbar";
import { redirect } from "next/navigation";
import { unauthorizedPath } from "@/paths";
import { useAuth } from "@/components/AuthProvider";

export default function AdminDashboardLayout({
  children,
}: React.PropsWithChildren) {
  const { user } = useAuth();
  if (user?.role !== "super_admin") return redirect(unauthorizedPath());
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          header={<DashboardHeader />}
          sidebar={
            <DashboardSidebar>
              <SidebarContent
                mainItems={dashboardNavigation.admin}
                subItems={dashboardNavigation?.subItems?.admin}
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
