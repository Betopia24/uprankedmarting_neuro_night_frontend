"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField, SelectDropdown } from "@/components";
import { toast } from "sonner";
import { env } from "@/env";
import { z } from "zod";
import { cn } from "@/lib/utils";

// --- Options ---
export const shiftTypes = ["morning", "evening", "night"] as const;

// --- Zod Schema ---
const agentSchema = z.object({
  userData: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .refine(
        (val) =>
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /\d/.test(val) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(val),
        {
          message:
            "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
        }
      ),
    phone: z.string().min(5).max(20),
    bio: z.string({
      message: "Bio must be at least 5 characters long",
    }),
  }),
  agentData: z.object({
    sip_domain: z.string().min(5).max(100),
    sip_password: z
      .string()
      .min(12)
      .refine(
        (val) =>
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /\d/.test(val) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(val),
        {
          message:
            "Password must be at least 12 characters, include uppercase, lowercase, number, and special character",
        }
      ),
    skills: z.string(),
    shift: z.enum(shiftTypes).default("morning"),
  }),
});

// --- Types ---
type AgentFormInput = z.input<typeof agentSchema>;

function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const shiftTimeMap: Record<
  (typeof shiftTypes)[number],
  { start: string; end: string; label: string }
> = {
  morning: { start: "06:00:00", end: "14:00:00", label: "06:00 AM – 02:00 PM" },
  evening: { start: "14:00:00", end: "22:00:00", label: "02:00 PM – 10:00 PM" },
  night: { start: "22:00:00", end: "06:00:00", label: "10:00 PM – 06:00 AM" },
};

function getShiftStartEnd(shift: (typeof shiftTypes)[number]) {
  return shiftTimeMap[shift];
}

// --- Default Values ---
const defaultValues: AgentFormInput = {
  userData: {
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
  },
  agentData: {
    sip_domain: "production-answersmart.sip.twilio.com",
    sip_password: "",
    skills: "",
    shift: "morning",
  },
};

export default function AgentForm() {
  const form = useForm<AgentFormInput>({
    mode: "onChange",
    resolver: zodResolver(agentSchema),
    defaultValues,
  });

  const onSubmit = async (data: AgentFormInput) => {
    try {
      const payload = {
        userData: data.userData,
        agentData: {
          ...data.agentData,
          workStartTime: getShiftStartEnd(data?.agentData?.shift ?? "morning")
            .start,
          workEndTime: getShiftStartEnd(data?.agentData?.shift ?? "morning")
            .end,
          sip_password: data?.agentData?.sip_password,
          skills: parseSkills(data?.agentData?.skills),
        },
      };
      delete payload?.agentData?.shift;

      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/register-agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        toast.error("Failed to create agent: " + err.message);
        return;
      }

      toast.success("Agent created successfully!");
      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Server error: " + err.message);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* User Info */}
        <FormGroup title="User Information">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="userData.name" type="text" />
            <InputField
              label="Email"
              name="userData.email"
              type="email"
              placeholder="example@domain.com"
            />
            <InputField
              label="Password"
              name="userData.password"
              type="password"
              placeholder="Strong password"
            />
            <InputField
              label="Phone"
              name="userData.phone"
              type="tel"
              placeholder="+14155552671"
            />
            <InputField
              label="Bio"
              name="userData.bio"
              type="text"
              placeholder="Update your bio"
            />
          </div>
        </FormGroup>

        {/* Agent Info */}
        <FormGroup title="Agent Information">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Skills (comma separated)"
              name="agentData.skills"
              type="text"
              placeholder="customer service, sales"
            />
            <InputField
              label="SIP Domain"
              name="agentData.sip_domain"
              type="text"
              placeholder="test-sip.sip.twilio.com"
            />
            <InputField
              label="SIP Password"
              name="agentData.sip_password"
              type="password"
              placeholder="Strong password"
            />
            <SelectDropdown
              label="Work Shift"
              name="agentData.shift"
              options={[
                { label: "Morning (06:00 AM – 02:00 PM)", value: "morning" },
                { label: "Evening (02:00 PM – 10:00 PM)", value: "evening" },
                { label: "Night (10:00 PM – 06:00 AM)", value: "night" },
              ]}
            />
          </div>
        </FormGroup>

        <div className="text-right">
          <Button
            className={cn(
              form.formState.isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// --- FormGroup Component ---
type FormGroupProps = { children: React.ReactNode; title: string };
function FormGroup({ children, title }: FormGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-lg md:text-xl font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
