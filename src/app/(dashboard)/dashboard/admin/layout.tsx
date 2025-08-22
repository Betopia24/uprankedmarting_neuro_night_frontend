import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent from "../_components/DashboardSidebarContent";
import { dashboardNavbar } from "@/data/dashboardNavbar";

export default function AdminDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          header={<DashboardHeader />}
          sidebar={
            <DashboardSidebar>
              <SidebarContent mainItems={dashboardNavbar.admin} />
            </DashboardSidebar>
          }
        >
          {children}
        </DashboardLayout>
      </SidebarProvider>
    </>
  );
}
