import * as paths from "@/paths";

export const dashboardNavbar = {
  admin: [
    {
      name: "Dashboard",
      icon: "dashboard",
      href: paths.adminDashboardPath(),
    },
    {
      name: "Agent Management",
      icon: "agent",
      href: paths.adminAgentManagementPath(),
    },
  ],
};
