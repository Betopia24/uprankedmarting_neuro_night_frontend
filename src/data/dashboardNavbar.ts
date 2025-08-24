import * as paths from "@/paths";

export const dashboardNavigation = {
  admin: [
    {
      name: "Dashboard",
      icon: "layoutDashboard",
      href: paths.adminDashboardPath(),
    },
    {
      name: "Agent Management",
      icon: "users",
      href: paths.adminAgentManagementPath(),
    },
  ],
  organization: [
    {
      name: "Call Logs & Management",
      icon: "phoneCall",
      href: "#",
    },
    {
      name: "Agent Management",
      icon: "userCog",
      href: "#",
    },
    {
      name: "Document Uploads",
      icon: "fileUp",
      href: "#",
    },
    {
      name: "Voice Uploads",
      icon: "mic",
      href: "#",
    },
    {
      name: "Call Flows & Logic",
      icon: "workflow",
      href: "#",
    },
    {
      name: "Tools",
      icon: "settings",
      href: "#",
    },
    {
      name: "Performance Analytics",
      icon: "barChart3",
      href: "#",
    },
    {
      name: "Feedback & Reports",
      icon: "messageSquare",
      href: "#",
    },
  ],
  agent: [
    {
      name: "Dashboard",
      icon: "layout-dashboard",
      href: "#",
    },
    {
      name: "Call Management",
      icon: "phone",
      href: "#",
    },
  ],
};
