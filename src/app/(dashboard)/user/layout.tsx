import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "../_components";
import SidebarContent, {
  SidebarItemType,
} from "../_components/DashboardSidebarContent";
import {
  LucidePhoneCall,
  LucideHatGlasses,
  LucideBookText,
  LucideMic,
  LucideGitMerge,
  LucideGitFork,
  LucideCommand,
  LucideMessageSquare,
} from "lucide-react";

const clientRoutes = [
  { name: "Call Manage & Logs", href: "/dashboard", icon: <LucidePhoneCall /> },
  {
    name: "Agent Management",
    href: "/dashboard/users",
    icon: <LucideHatGlasses />,
  },
  {
    name: "Document Upload",
    href: "/dashboard/roles",
    icon: <LucideBookText />,
  },
  { name: "Voice Upload", href: "/dashboard/roles", icon: <LucideMic /> },
  {
    name: "Call Flows & Logic",
    href: "/dashboard/roles",
    icon: <LucideGitMerge />,
  },
  { name: "Tools", href: "/dashboard/roles", icon: <LucideGitFork /> },
  { name: "Performance", href: "/dashboard/roles", icon: <LucideCommand /> },
  { name: "Feedback", href: "/dashboard/roles", icon: <LucideMessageSquare /> },
] as SidebarItemType[];

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
