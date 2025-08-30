import { redirect } from "next/navigation";
import {
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent from "../_components/DashboardSidebarContent";
import { dashboardNavigation } from "@/data/dashboardNavbar";
import { requireAuth } from "@/lib/auth";
import { unauthorizedPath } from "@/paths";

export default async function AgentDashboardLayout({
  children,
}: React.PropsWithChildren) {
  const data = await requireAuth();
  const user = data?.data || { role: "" };
  if (user.role !== "agent") return redirect(unauthorizedPath());
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          sidebar={
            <DashboardSidebar>
              <SidebarContent
                mainItems={dashboardNavigation.agent}
                subItems={dashboardNavigation.subItems.agent}
              />
            </DashboardSidebar>
          }
        >
          {children}
        </DashboardLayout>
      </SidebarProvider>
    </>
  );
}
