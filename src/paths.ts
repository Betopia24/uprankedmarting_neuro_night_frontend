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
export const loginPath = () => `${AUTH_PREFIX}/organization/login`;
export const signupPath = () => `${AUTH_PREFIX}/signup`;
export const forgotPasswordPath = () => `${AUTH_PREFIX}/forgot-password`;
export const newPasswordPath = () => `${AUTH_PREFIX}/new-password`;

const DASHBOARD_PREFIX = "/dashboard";
// admin dashboard paths
export const adminDashboardPath = () => `${DASHBOARD_PREFIX}/admin`;
export const adminAgentManagementPath = () =>
  `${adminDashboardPath()}/agent-management`;

// API paths
export const API_PREFIX = "/api";
export const ORGANIZATION_LOGIN_API = `${API_PREFIX}/auth/organization/login`;
export const TOKEN_API = `${API_PREFIX}/token`;
