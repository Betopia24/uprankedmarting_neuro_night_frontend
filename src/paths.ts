export const homePath = () => "/";
export const howItWork = () => "/how-it-work";
export const pricingPath = () => "/pricing";
export const servicePath = () => "/service";
export const aboutUsPath = () => "/about-us";
export const privacyPolicyPath = () => "/privacy-policy";
export const termsAndConditionsPath = () => "/terms-of-use";
export const supportPath = () => "/support";
export const contactPath = () => "/contact-us";

// auth paths
const AUTH_PREFIX = "/auth";
export const loginPath = () => `${AUTH_PREFIX}/login`;
export const signupPath = () => `${AUTH_PREFIX}/signup`;
export const forgotPasswordPath = () => `${AUTH_PREFIX}/forgot-password`;
export const newPasswordPath = () => `${AUTH_PREFIX}/new-password`;
export const unauthorizedPath = () => `/unauthorized`;

const DASHBOARD_PREFIX = "/dashboard";
// admin dashboard paths
export const adminDashboardPath = () => `${DASHBOARD_PREFIX}/admin`;
export const adminAgentManagementPath = () =>
  `${adminDashboardPath()}/agent-management`;
export const adminOrganizationManagementPath = () =>
  `${adminDashboardPath()}/organization-management`;
export const adminNumberManagementPath = () =>
  `${adminDashboardPath()}/number-management`;
export const adminApprovalPath = () => `${adminDashboardPath()}/approval`;

// organization dashboard paths
export const organizationDashboardPath = () =>
  `${DASHBOARD_PREFIX}/organization`;
//
export const organizationExploreNumbersPath = () =>
  `${organizationDashboardPath()}/explore-numbers`;
export const organizationBuyNumberPath = () =>
  `${organizationExploreNumbersPath()}/buy-number`;
export const organizationCallLogsPath = () =>
  `${organizationDashboardPath()}/call-manage-and-logs`;
export const organizationAgentManagementPath = () =>
  `${organizationDashboardPath()}/agent-management`;
export const organizationAIManagementPath = () =>
  `${organizationDashboardPath()}/ai-management`;
export const organizationVoiceUpload = () =>
  `${organizationDashboardPath()}/voice-upload`;
export const organizationDocumentsPath = () =>
  `${organizationDashboardPath()}/document-upload`;
export const organizationLeadQuestionsPath = () =>
  `${organizationDashboardPath()}/lead-questions`;
export const organizationToolsPath = () =>
  `${organizationDashboardPath()}/tools`;
export const organizationPerformancePath = () =>
  `${organizationDashboardPath()}/performance`;
export const organizationFeedbackPath = () =>
  `${organizationDashboardPath()}/feedback`;

export const organizationPaymentsPath = () =>
  `${organizationDashboardPath()}/payments`;

export const organizationSettingsPath = () =>
  `${organizationDashboardPath()}/settings`;

// agent dashboard paths
export const agentDashboardPrefix = () => `${DASHBOARD_PREFIX}/agent`;
export const agentDashboardPath = () => `${agentDashboardPrefix()}`;
export const agentCallManagementPath = () =>
  `${agentDashboardPath()}/call-management`;
export const agentSettingsPath = () => `${agentDashboardPath()}/settings`;

// API paths
export const API_PREFIX = "/api";
export const ORGANIZATION_LOGIN_API = `${API_PREFIX}/auth/organization/login`;
export const TOKEN_API = `${API_PREFIX}/token`;
