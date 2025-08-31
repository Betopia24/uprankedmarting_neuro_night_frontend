import * as paths from "./paths";

export const SUPER_ADMIN_ROLE = "super_admin";
export const ORGANIZATION_ADMIN_ROLE = "organization_admin";
export const AGENT_ROLE = "agent";

export const adminPaths = {
  super_admin: paths.adminDashboardPath(),
  organization_admin: paths.organizationDashboardPath(),
  agent: paths.agentDashboardPrefix(),
};
