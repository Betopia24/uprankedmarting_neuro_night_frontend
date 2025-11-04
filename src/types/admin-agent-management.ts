export interface AgentInfo {
  id: string;
  userId: string;
  status: string;
  sip_address: string;
  sip_username: string;
  sip_password: string;
  dateOfBirth: string | null;
  gender: string;
  address: string;
  emergencyPhone: string;
  ssn: string;
  skills: string[];
  employeeId: string | null;
  isAvailable: boolean;
  assignTo: string | null;
  jobTitle: string;
  employmentType: string;
  department: string;
  workStartTime: string | null;
  workEndTime: string | null;
  startWorkDateTime: string | null;
  endWorkDateTime: string | null;
  totalCalls: number;
  successCalls: number;
  droppedCalls: number;
  bio: string;
  role: string;
  organizationId: string;
}

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  Agent: AgentInfo;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AgentsApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: Metadata;
    data: AgentUser[];
  };
}
