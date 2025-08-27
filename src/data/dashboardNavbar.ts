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
      icon: "userCog",
      href: paths.adminAgentManagementPath(),
    },
    {
      name: "Organization Management",
      icon: "users",
      href: paths.adminOrganizationManagementPath(),
    },
  ],
  organization: [
    {
      name: "Call Logs & Management",
      icon: "phoneCall",
      href: paths.organizationCallLogsPath(),
    },
    {
      name: "Agent Management",
      icon: "userCog",
      href: paths.organizationAgentManagementPath(),
    },
    {
      name: "Document Uploads",
      icon: "fileUp",
      href: paths.organizationDocumentsPath(),
    },
    {
      name: "Voice Uploads",
      icon: "mic",
      href: paths.organizationVoiceUpload(),
    },
    {
      name: "Call Flows & Logic",
      icon: "workflow",
      href: paths.organizationCallFlowsPath(),
    },
    {
      name: "Tools",
      icon: "settings",
      href: paths.organizationToolsPath(),
    },
    {
      name: "Performance",
      icon: "barChart3",
      href: paths.organizationPerformancePath(),
    },
    {
      name: "Feedback & Reports",
      icon: "messageSquare",
      href: paths.organizationFeedbackPath(),
    },
  ],
  agent: [
    {
      name: "Dashboard",
      icon: "blocks",
      href: paths.agentDashboardPath(),
    },
    {
      name: "Call Management",
      icon: "phone",
      href: paths.agentCallManagementPath(),
    },
  ],
  subItems: {
    organization: [
      {
        name: "Settings",
        icon: "settings",
        href: paths.organizationSettingsPath(),
      },
      {
        name: "Payments",
        icon: "creditCard",
        href: paths.organizationPaymentsPath(),
      },
    ],
    agent: [
      {
        name: "Settings",
        icon: "settings",
        href: paths.agentSettingsPath(),
      },
    ],
  },
};
