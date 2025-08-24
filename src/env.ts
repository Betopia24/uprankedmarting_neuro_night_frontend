import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_BASE_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "test"]),
  },
  runtimeEnv: {
    API_BASE_URL: process.env.API_BASE_URL,

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  },
});
