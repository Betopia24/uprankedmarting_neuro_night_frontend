import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent, {
  SidebarItemType,
} from "../_components/DashboardSidebarContent";
import { LucideBlocks, LucideBox } from "lucide-react";

const clientRoutes = [
  { name: "Dashboard", href: "/dashboard", icon: <LucideBlocks /> },
  {
    name: "Call Management",
    href: "/dashboard/roles",
    icon: <LucideBox />,
  },
];

export default function AgentDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          header={<DashboardHeader />}
          sidebar={
            <DashboardSidebar>
              <SidebarContent
                mainItems={clientRoutes}
                subItems={clientRoutes}
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
