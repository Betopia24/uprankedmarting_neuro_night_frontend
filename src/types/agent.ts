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
  organization: Organization;
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

export type UpdateAgentUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  Agent: {
    id: string;
    userId: string;
    status: string;
    sip_address: string;
    sip_username: string;
    sip_password: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    emergencyPhone: string;
    ssn: string;
    skills: string[];
    employeeId: string;
    isAvailable: boolean;
    jobTitle: string;
    employmentType: string;
    department: string;
    workEndTime: string;
    workStartTime: string;
    startWorkDateTime: string;
    endWorkDateTime: string | null;
    successCalls: number;
    droppedCalls: number;
  } | null;
};

export type ViewType = "unassigned" | "my-agents";
export type StatusType = "approval" | "removal";
