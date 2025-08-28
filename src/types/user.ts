export type UserToken = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "organization_admin" | "agent";
  isVerified: boolean;
  iat: number;
  exp: number;
};

export type AuthMe = {
  success: boolean;
  message: string;
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
    ownedOrganization: unknown | null;
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
    ownedOrganization: unknown | null;
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
