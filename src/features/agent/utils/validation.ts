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
    password: z
      .string()
      .min(8)
      .max(100)
      .refine(
        (val) =>
          /[A-Z]/.test(val) && // uppercase
          /[a-z]/.test(val) && // lowercase
          /\d/.test(val) && // number
          /[!@#$%^&*(),.?":{}|<>]/.test(val), // special char
        {
          message:
            "Password must have at least 8 characters, uppercase, lowercase, number and special character",
        }
      ),
  }),
  agentData: z
    .object({
      dateOfBirth: z.string(), // YYYY-MM-DD
      sip_domain: z.string().min(5).max(100),
      sip_password: z
        .string()
        .min(12)
        .max(100)
        .refine(
          (val) =>
            /[A-Z]/.test(val) &&
            /[a-z]/.test(val) &&
            /\d/.test(val) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(val),
          {
            message:
              "SIP password must have at least 12 characters, uppercase, lowercase, number and special character",
          }
        ),
      gender: z.enum(genderOptions),
      address: z.string().trim().min(5).max(200),
      emergencyPhone: z.string().min(5).max(20),
      ssn: z.string().trim().min(3).max(64),
      skills: z
        .array(z.string().min(1))
        .min(1, "At least one skill is required"),
      officeHours: z.number().min(1).max(24).default(8),
      isAvailable: z.boolean().default(true),
    })
    .refine(
      (data) =>
        !data.workStartTime ||
        !data.workEndTime ||
        (() => {
          const [sh, sm] = data.workStartTime.split(":").map(Number);
          const [eh, em] = data.workEndTime.split(":").map(Number);
          return eh * 60 + em - (sh * 60 + sm) >= 480;
        })(),
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
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+[]{}|;:,.<>?";
  const all = upper + lower + numbers + special;
  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password;
}

// --- Helper: convert comma-separated skills to array ---
export function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
