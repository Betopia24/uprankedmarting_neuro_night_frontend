import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent from "../_components/DashboardSidebarContent";
import {
  LucideBlocks,
  LucideBox,
  LucideCreditCard,
  LucideSettings,
} from "lucide-react";

const agentRoutes = [
  { name: "Dashboard", href: "/dashboard", icon: <LucideBlocks /> },
  {
    name: "Call Management",
    href: "/dashboard/roles",
    icon: <LucideBox />,
  },
];

const agentSubRoutes = [
  { name: "Settings", href: "/dashboard", icon: <LucideSettings /> },
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
                mainItems={agentRoutes}
                subItems={agentSubRoutes}
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
