import { requireAuth } from "@/lib/auth";
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

export default async function AdminDashboardLayout({
  children,
}: React.PropsWithChildren) {
  const data = await requireAuth();
  const user = data?.data || { role: "" };
  if (user.role !== "super_admin") return redirect(unauthorizedPath());
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          header={<DashboardHeader />}
          sidebar={
            <DashboardSidebar>
              <SidebarContent mainItems={dashboardNavigation.admin} />
            </DashboardSidebar>
          }
        >
          <div className="mt-4">{children}</div>
        </DashboardLayout>
      </SidebarProvider>
    </>
  );
}
