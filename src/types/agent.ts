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
  userData: {
    name: string;
    bio: string;
    phone: string;
  };
  agentData: {
    dateOfBirth: string;
    gender: "male" | "female" | "others";
    address: string;
    emergencyPhone: string;
    ssn: string;
    skills: string[];
    jobTitle: string;
    employmentType: "full_time" | "part_time" | "contract";
    department: string;
    workStartTime: string;
    workEndTime: string;
    startWorkDateTime: string;
    endWorkDateTime: string | null;
  };
};

export type ViewType = "unassigned" | "my-agents";
export type StatusType = "approval" | "removal";
