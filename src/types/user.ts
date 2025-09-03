export type UserToken = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "organization_admin" | "agent";
  isVerified: boolean;
  iat: number;
  exp: number;
};

type OrganizationInfo = {
  id: string;
  name: string;
  industry: string;
  address: string;
  websiteLink: string;
  organizationNumber: any;
  ownerId: string;
  agentVoiceUrl: any;
  leadQuestions: any[];
  createdAt: string;
  updatedAt: string;
};

export type AuthMe = {
  success: boolean;
  message: string;
  accessToken: string;
  data: {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string | null;
    phone: string;
    isDeleted: boolean;
    passwordChangedAt: string | null;
    isVerified: boolean;
    isResetPassword: boolean;
    canResetPassword: boolean;
    isResentOtp: boolean;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    role: "super_admin" | "organization_admin" | "agent";
    createdAt: string;
    updatedAt: string;
    Agent: unknown | null;
    ownedOrganization: OrganizationInfo | null;
  };
};

export type AuthMe2 = {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string | null;
    phone: string;
    isDeleted: boolean;
    passwordChangedAt: string | null;
    isVerified: boolean;
    isResetPassword: boolean;
    canResetPassword: boolean;
    isResentOtp: boolean;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    role: "super_admin" | "organization_admin" | "agent";
    createdAt: string;
    updatedAt: string;
    Agent: unknown | null;
    ownedOrganization: OrganizationInfo | null;
  };
};

export type TokenPayload = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type Me = {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string | null;
  phone: string;
  isDeleted: boolean;
  passwordChangedAt: string | null;
  isVerified: boolean;
  isResetPassword: boolean;
  canResetPassword: boolean;
  isResentOtp: boolean;
  otp: number;
  otpExpiresAt: string;
  status: "ACTIVE" | "INACTIVE" | string;
  role: "organization_admin" | "agent" | "super_admin";
  createdAt: string;
  updatedAt: string;
  Agent: unknown | null;
  ownedOrganization?: {
    id: string;
    name: string;
    industry: string;
    address: string;
    websiteLink: string;
    organizationNumber: string;
    ownerId: string;
    agentVoiceUrl: string | null;
    leadQuestions: unknown[];
    createdAt: string;
    updatedAt: string;
  };
};
