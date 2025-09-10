import * as paths from "@/paths";

export const dashboardNavigation = {
  admin: [
    {
      name: "Dashboard",
      icon: "layoutDashboard",
      href: paths.adminDashboardPath(),
    },
    {
      name: "Number Management",
      icon: "phone",
      href: paths.adminNumberManagementPath(),
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
    { name: "Approval", icon: "userCog", href: paths.adminApprovalPath() },
  ],
  organization: [
    {
      name: "Dashboard",
      icon: "barChart3",
      href: paths.organizationDashboardPath(),
    },
    {
      name: "Explore Numbers",
      icon: "phone",
      href: paths.organizationExploreNumbersPath(),
    },
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
      name: "AI Management",
      icon: "userCog",
      href: paths.organizationAIManagementPath(),
    },
    {
      name: "Document Upload",
      icon: "fileUp",
      href: paths.organizationDocumentsPath(),
    },
    {
      name: "Voice Upload",
      icon: "mic",
      href: paths.organizationVoiceUpload(),
    },
    {
      name: "Lead Questions",
      icon: "workflow",
      href: paths.organizationLeadQuestionsPath(),
    },
    {
      name: "Tools",
      icon: "settings",
      href: paths.organizationToolsPath(),
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
