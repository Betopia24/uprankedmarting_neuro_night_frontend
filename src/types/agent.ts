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
  image: string;
  bio: string;
  phone: string;
  isDeleted: boolean;
  passwordChangedAt: string | null;
  isVerified: boolean;
  isResetPassword: boolean;
  canResetPassword: boolean;
  isResentOtp: boolean;
  otp: string | null;
  otpExpiresAt: string | null;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  Agent?: {
    id: string;
    userId: string;
    status: string;
    sip_address: string;
    sip_username: string;
    sip_password: string;
    dateOfBirth: string;
    gender: "male" | "female" | "others";
    address: string;
    emergencyPhone: string;
    ssn: string;
    skills: string[];
    employeeId: string;
    isAvailable: boolean;
    assignTo: string | null;
    jobTitle: string;
    employmentType: "full_time" | "part_time" | "contract";
    department: string;
    workEndTime: string;
    workStartTime: string;
    startWorkDateTime: string;
    endWorkDateTime: string | null;
    successCalls: number;
    droppedCalls: number;
    createdAt: string | null;
    updatedAt: string;
  };
  ownedOrganization: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type AgentUpdateFormData = {
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
    skills: string[]; // converted from comma-separated string
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
