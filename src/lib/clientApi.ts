import axios from "axios";
import accessTokenMemory from "./accessTokenMemory";

const clientApi = axios.create({ baseURL: "/" });

clientApi.interceptors.request.use((config) => {
  const tokenRaw = accessTokenMemory.get();
  let token: { accessToken?: string } = {};
  try {
    token = typeof tokenRaw === "string" ? JSON.parse(tokenRaw) : tokenRaw;
  } catch {
    token = {};
  }
  if (token?.accessToken)
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  return config;
});

clientApi.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401) {
      const tokenRes = await fetch("/api/token", { method: "POST" });
      if (!tokenRes.ok) throw new Error("Refresh failed");

      const data = await tokenRes.json();
      accessTokenMemory.set(data);

      err.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return clientApi(err.config);
    }
    return Promise.reject(err);
  }
);

export default clientApi;
