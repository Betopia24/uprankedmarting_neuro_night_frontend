import { z } from "zod";

// Options
export const genderOptions = ["male", "female", "others"] as const;
export const employmentTypes = ["full_time", "part_time", "contract"] as const;

// --- Zod Schema ---
export const agentSchema = z.object({
  userData: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    phone: z.string().min(5).max(20),
  }),

  agentData: z
    .object({
      dateOfBirth: z.string(), // datetime-local as string
      sip_domain: z.string().min(5).max(100),
      sip_password: z
        .string()
        .min(12)
        .max(100)
        .refine(
          (val) =>
            /[A-Z]/.test(val) && // uppercase
            /[a-z]/.test(val) && // lowercase
            /\d/.test(val) && // number
            /[!@#$%^&*(),.?":{}|<>]/.test(val), // special char
          {
            message:
              "Password must have at least 12 characters, uppercase, lowercase, number and special character",
          }
        ),
      gender: z.enum(genderOptions),
      address: z.string().trim().min(5).max(200),
      emergencyPhone: z.string().min(5).max(20),
      ssn: z.string().trim().min(3).max(64),
      skills: z.string(), // comma separated string; convert to array on submit
      jobTitle: z.string().trim().min(2).max(80),
      employmentType: z.enum(employmentTypes),
      department: z.string().trim().min(2).max(80),
      workStartTime: z.string().optional(), // "HH:mm"
      workEndTime: z.string().optional(), // "HH:mm"
      startWorkDateTime: z.string().nullable(), // datetime-local
      endWorkDateTime: z.string().nullable(),
    })
    .refine(
      (data) => {
        if (!data.workStartTime || !data.workEndTime) return true;
        const [sh, sm] = data.workStartTime.split(":").map(Number);
        const [eh, em] = data.workEndTime.split(":").map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;
        return endMinutes - startMinutes >= 480; // 8 hours
      },
      {
        message: "Work interval must be at least 8 hours",
        path: ["workEndTime"],
      }
    ),
});

// --- Types ---
export type AgentFormSchema = z.infer<typeof agentSchema>;
export type AgentFormInput = z.input<typeof agentSchema>;

// --- Helper: generate strong password ---
export function generateStrongSipPassword() {
  // 12+ chars, upper, lower, number, special
  return "Aa1!" + Math.random().toString(36).slice(2, 10) + "X!";
}

// --- Helper: convert comma-separated skills to array ---
export function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
