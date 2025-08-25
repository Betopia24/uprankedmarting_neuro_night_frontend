import {
  AGENT_ROLE,
  ORGANIZATION_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from "@/constants";

type TokenData = {
  accessToken: string;
  role:
    | typeof SUPER_ADMIN_ROLE
    | typeof ORGANIZATION_ADMIN_ROLE
    | typeof AGENT_ROLE;
};

let tokenData: TokenData | null = null;

const accessTokenMemory = {
  get: () => tokenData,
  set: (data: TokenData) => {
    tokenData = data;
  },
  clear: () => {
    tokenData = null;
  },
};

export default accessTokenMemory;
