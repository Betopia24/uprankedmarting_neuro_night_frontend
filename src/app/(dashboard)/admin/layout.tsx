import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent from "../_components/DashboardSidebarContent";
import { type SidebarItemType } from "../_components/DashboardSidebarContent";
import { LucideBlocks, LucideUser, LucideHatGlasses } from "lucide-react";

const adminRoutes = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LucideBlocks /> },
  { name: "Users", href: "/dashboard/users", icon: <LucideHatGlasses /> },
  { name: "Customer", href: "/dashboard/roles", icon: <LucideUser /> },
] as SidebarItemType[];

export default function AdminDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          sidebar={
            <DashboardSidebar>
              <SidebarContent mainItems={adminRoutes} />
            </DashboardSidebar>
          }
        >
          {children}
        </DashboardLayout>
      </SidebarProvider>
    </>
  );
}
