import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_BASE_URL: z.url(),
    API_BASE_URL_AI: z.url(),
    API_BASE_URL_LEAD: z.url(),
    CALL_CENTER_API_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "test"]),
    NEXT_PUBLIC_APP_URL: z.url().min(1),
    NEXT_PUBLIC_API_BASE_URL_AI: z.url(),
    NEXT_PUBLIC_API_BASE_URL_LEAD: z.url(),
    NEXT_PUBLIC_CALL_CENTER_API_URL: z.url(),
  },
  runtimeEnv: {
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    API_BASE_URL_AI: process.env.API_BASE_URL_AI,
    API_BASE_URL_LEAD: process.env.API_BASE_URL_LEAD,
    NEXT_PUBLIC_API_BASE_URL_AI: process.env.NEXT_PUBLIC_API_BASE_URL_AI,
    NEXT_PUBLIC_API_BASE_URL_LEAD: process.env.NEXT_PUBLIC_API_BASE_URL_LEAD,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    CALL_CENTER_API_URL: process.env.CALL_CENTER_API_URL,
    NEXT_PUBLIC_CALL_CENTER_API_URL:
      process.env.NEXT_PUBLIC_CALL_CENTER_API_URL,
    
  },
});


