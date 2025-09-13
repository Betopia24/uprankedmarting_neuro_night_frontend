"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField, SelectDropdown } from "@/components";
import { z } from "zod";
import { UpdateAgentUser } from "@/types/agent";

// --- Options ---
const genderOptions = ["male", "female", "others"] as const;
const employmentTypes = ["full_time", "part_time", "contract"] as const;
export const shiftTypes = ["morning", "evening", "night"] as const;

// --- Shift Time Map ---
const shiftTimeMap: Record<
  (typeof shiftTypes)[number],
  { start: string; end: string; label: string }
> = {
  morning: { start: "06:00:00", end: "14:00:00", label: "06:00 AM – 02:00 PM" },
  evening: { start: "14:00:00", end: "22:00:00", label: "02:00 PM – 10:00 PM" },
  night: { start: "22:00:00", end: "06:00:00", label: "10:00 PM – 06:00 AM" },
};

function inferShiftFromTimes(
  start: string,
  end: string
): (typeof shiftTypes)[number] {
  if (start === "06:00:00" && end === "14:00:00") return "morning";
  if (start === "14:00:00" && end === "22:00:00") return "evening";
  return "night";
}

// --- Schema ---
const agentUpdateSchema = z.object({
  userData: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    phone: z.string().min(5).max(20),
    bio: z.string().optional(),
  }),
  agentData: z.object({
    dateOfBirth: z.string(),
    sip_domain: z.string().min(5).max(100),
    sip_password: z.string().min(12).max(100),
    gender: z.enum(genderOptions),
    address: z.string().trim().min(5).max(200),
    emergencyPhone: z.string().min(5).max(20),
    ssn: z.string().trim().min(3).max(64),
    skills: z.string(), // we’ll parse into array on submit
    jobTitle: z.string().trim().min(2).max(80),
    employmentType: z.enum(employmentTypes),
    department: z.string().trim().min(2).max(80),
    isAvailable: z.boolean().default(true),
    shift: z.enum(shiftTypes),
    startWorkDateTime: z.string(),
  }),
});

type AgentUpdateFormInput = z.input<typeof agentUpdateSchema>;

// --- Props ---
type UpdateAgentFormProps = {
  agent: UpdateAgentUser; // use your AgentUser type here
};

export default function UpdateAgentForm({ agent }: UpdateAgentFormProps) {
  // map API → form defaults
  const defaultValues: AgentUpdateFormInput = {
    userData: {
      name: agent.name ?? "",
      email: agent.email ?? "",
      phone: agent.phone ?? "",
      bio: agent.bio ?? "",
    },
    agentData: {
      dateOfBirth: agent.Agent?.dateOfBirth
        ? agent.Agent.dateOfBirth.split("T")[0]
        : "",
      sip_domain: agent.Agent?.sip_address?.split("@")[1] ?? "",
      sip_password: agent.Agent?.sip_password ?? "",
      gender:
        (agent.Agent?.gender?.toLowerCase() as "male" | "female" | "others") ??
        "male",
      address: agent.Agent?.address ?? "",
      emergencyPhone: agent.Agent?.emergencyPhone ?? "",
      ssn: agent.Agent?.ssn ?? "",
      skills: agent.Agent?.skills?.join(", ") ?? "",
      jobTitle: agent.Agent?.jobTitle ?? "",
      employmentType:
        (agent.Agent?.employmentType as (typeof employmentTypes)[number]) ??
        "full_time",
      department: agent.Agent?.department ?? "",
      isAvailable: agent.Agent?.isAvailable ?? true,
      shift: inferShiftFromTimes(
        agent.Agent?.workStartTime ?? "",
        agent.Agent?.workEndTime ?? ""
      ),
      startWorkDateTime: agent.Agent?.startWorkDateTime
        ? agent.Agent.startWorkDateTime.split("T")[0]
        : "",
    },
  };

  const form = useForm<AgentUpdateFormInput>({
    mode: "onChange",
    resolver: zodResolver(agentUpdateSchema),
    defaultValues,
  });

  // --- Temporary submit ---
  const onSubmit = async (data: AgentUpdateFormInput) => {
    console.log("PATCH payload →", data);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* User Info */}
        <FormGroup title="User Information">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="userData.name" type="text" />
            <InputField label="Email" name="userData.email" type="email" />
            <InputField label="Phone" name="userData.phone" type="tel" />
            <InputField label="Bio" name="userData.bio" type="text" />
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
            <InputField label="Address" name="agentData.address" type="text" />
            <InputField
              label="Emergency Phone"
              name="agentData.emergencyPhone"
              type="tel"
            />
            <InputField label="SSN" name="agentData.ssn" type="text" />
            <InputField label="Skills" name="agentData.skills" type="text" />
            <InputField
              label="SIP Domain"
              name="agentData.sip_domain"
              type="text"
            />
            <InputField
              label="SIP Password"
              name="agentData.sip_password"
              type="text"
            />
            <InputField
              label="Job Title"
              name="agentData.jobTitle"
              type="text"
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
            <InputField
              label="Start Work Date"
              name="agentData.startWorkDateTime"
              type="date"
            />
          </div>
        </FormGroup>

        <div className="text-right">
          <Button type="submit">Update Agent</Button>
        </div>
      </form>
    </Form>
  );
}

// --- FormGroup ---
type FormGroupProps = { children: React.ReactNode; title: string };
function FormGroup({ children, title }: FormGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-lg md:text-xl font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
