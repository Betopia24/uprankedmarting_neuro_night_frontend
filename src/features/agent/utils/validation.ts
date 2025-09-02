import { z } from "zod";
import { shiftKeys } from "./constants";

export const genderOptions = ["male", "female", "others"] as const;
export const employmentTypes = ["full_time", "part_time", "contract"] as const;

// --- Schema ---
export const agentSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  date_of_birth: z.coerce
    .date()
    .refine((d) => d <= new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000), {
      message: "Must be at least 10 years old",
    }),
  gender: z.enum(genderOptions),
  social_security_number: z.string().trim().min(3).max(64),
  email: z.string().email(),
  phone_number: z.string().regex(/^\+1\d{10}$/, "Use US format: +14155552671"),
  emergency_contact_number: z
    .string()
    .regex(/^\+1\d{10}$/, "Use US format: +14155552671"),
  residential_address: z.string().trim().min(5).max(200),
  job_title: z.string().trim().min(2).max(80),
  employment_type: z.enum(employmentTypes),
  department: z.string().trim().min(2).max(80),
  work_shift: z.enum(shiftKeys),
  start_working_day: z.coerce.date().refine((d) => d <= new Date(), {
    message: "Start day cannot be in the future",
  }),
});

// --- Types ---
export type AgentFormSchema = z.infer<typeof agentSchema>;
export type AgentFormInput = z.input<typeof agentSchema>;
