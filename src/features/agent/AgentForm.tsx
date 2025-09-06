"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField, SelectDropdown } from "@/components";
import { toast } from "sonner";
import { env } from "@/env";
import { useEffect } from "react";
import { z } from "zod";

// --- Options ---
const genderOptions = ["male", "female", "others"] as const;
const employmentTypes = ["full_time", "part_time", "contract"] as const;

// --- Zod Schema ---
const agentSchema = z.object({
  userData: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: z
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
    phone: z.string().min(5).max(20),
  }),
  agentData: z.object({
    dateOfBirth: z.string(),
    sip_domain: z.string().min(5).max(100),
    sip_password: z.string().min(12).max(100),
    gender: z.enum(genderOptions),
    address: z.string().trim().min(5).max(200),
    emergencyPhone: z.string().min(5).max(20),
    ssn: z.string().trim().min(3).max(64),
    skills: z.string(),
    jobTitle: z.string().trim().min(2).max(80),
    employmentType: z.enum(employmentTypes),
    department: z.string().trim().min(2).max(80),
    officeHours: z.number().default(8),
    isAvailable: z.boolean().default(true),
  }),
});

// --- Types ---
type AgentFormSchema = z.infer<typeof agentSchema>;
type AgentFormInput = z.input<typeof agentSchema>;

// --- Helpers ---
function generateStrongSipPassword() {
  return "Aa1!" + Math.random().toString(36).slice(2, 10) + "X!";
}

function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- Default Values ---
const defaultValues: AgentFormInput = {
  userData: { name: "", email: "", password: "", phone: "" },
  agentData: {
    dateOfBirth: "",
    sip_domain: "",
    sip_password: "",
    gender: "male",
    address: "",
    emergencyPhone: "",
    ssn: "",
    skills: "",
    jobTitle: "",
    employmentType: "full_time",
    department: "",
    officeHours: 8,
    isAvailable: true,
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
          sip_password:
            data.agentData.sip_password || generateStrongSipPassword(),
          skills: parseSkills(data.agentData.skills),
        },
      };

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
      form.reset(); // optional: reset form
    } catch (err: any) {
      toast.error("Server error: " + err.message);
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
          </div>
        </FormGroup>

        {/* Agent Info */}
        <FormGroup title="Agent Information">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Date of Birth"
              name="agentData.dateOfBirth"
              type="date"
            />
            <SelectDropdown
              label="Gender"
              name="agentData.gender"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "others" },
              ]}
            />
            <InputField
              label="Address"
              name="agentData.address"
              type="text"
              placeholder="Street, City, State"
            />
            <InputField
              label="Emergency Phone"
              name="agentData.emergencyPhone"
              type="tel"
              placeholder="+13105551234"
            />
            <InputField
              label="SSN"
              name="agentData.ssn"
              type="text"
              placeholder="123-45-6789"
            />
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
              type="text"
              placeholder="Strong password"
            />
            <InputField
              label="Job Title"
              name="agentData.jobTitle"
              type="text"
              placeholder="Software Engineer"
            />
            <SelectDropdown
              label="Employment Type"
              name="agentData.employmentType"
              options={[
                { label: "Full-time", value: "full_time" },
                { label: "Part-time", value: "part_time" },
                { label: "Contract", value: "contract" },
              ]}
            />
            <InputField
              label="Department"
              name="agentData.department"
              type="text"
              placeholder="Engineering"
            />
          </div>
        </FormGroup>

        <div className="text-right">
          <Button type="submit">Create Agent</Button>
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
      <legend className="text-lg md:text-xl lg:text-2xl font-medium">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
