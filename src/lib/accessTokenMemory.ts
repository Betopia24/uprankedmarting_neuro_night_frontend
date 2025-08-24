let accessToken: string | null = null;

const accessTokenMemory = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};

export default accessTokenMemory;
