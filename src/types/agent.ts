export interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  Agent: Agent;
}

export interface Agent {
  AgentFeedbacks: Record<string, string>[];
  skills: string[];
  totalCalls: number;
  isAvailable: boolean;
  status: string;
  assignTo: string;
  assignments: Assignment[];
  organization: Organization;
  avgRating: number;
  totalFeedbacks: number;
}

export interface Assignment {
  id: string;
  status: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ViewType = "unassigned" | "my-agents";
export type StatusType = "approval" | "removal";
