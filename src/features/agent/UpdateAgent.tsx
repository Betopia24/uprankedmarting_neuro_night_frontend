"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField, SelectDropdown } from "@/components";
import { z } from "zod";
import { UpdateAgentUser } from "@/types/agent";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

// --- Options ---
const genderOptions = ["male", "female", "others"] as const;
const employmentTypes = ["full_time", "part_time", "contract"] as const;
const shiftTypes = ["morning", "evening", "night"] as const;

function inferShiftFromTimes(
  start: string,
  end: string
): (typeof shiftTypes)[number] {
  if (start === "06:00:00" && end === "14:00:00") return "morning";
  if (start === "14:00:00" && end === "22:00:00") return "evening";
  return "night";
}

function getShiftTimes(shift: (typeof shiftTypes)[number]) {
  switch (shift) {
    case "morning":
      return { workStartTime: "06:00:00", workEndTime: "14:00:00" };
    case "evening":
      return { workStartTime: "14:00:00", workEndTime: "22:00:00" };
    case "night":
    default:
      return { workStartTime: "22:00:00", workEndTime: "06:00:00" };
  }
}

// --- Schema ---
const agentUpdateSchema = z.object({
  userData: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().min(5).max(20),
    bio: z.string().optional(),
  }),
  agentData: z.object({
    dateOfBirth: z.string(),
    gender: z.enum(genderOptions),
    address: z.string().trim().min(5).max(200),
    emergencyPhone: z.string().min(5).max(20),
    ssn: z.string().trim().min(3).max(64),
    skills: z.string(), // input as string, parse later
    jobTitle: z.string().trim().min(2).max(80),
    employmentType: z.enum(employmentTypes),
    department: z.string().trim().min(2).max(80),
    shift: z.enum(shiftTypes),
    startWorkDateTime: z.string(),
    endWorkDateTime: z.string().nullable().optional(),
  }),
});

type AgentUpdateFormInput = z.input<typeof agentUpdateSchema>;

type UpdateAgentFormProps = {
  agent: UpdateAgentUser;
  agentId: string;
};

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T | null;
};

export default function UpdateAgentForm({
  agent,
  agentId,
}: UpdateAgentFormProps) {
  const defaultValues: AgentUpdateFormInput = {
    userData: {
      name: agent.userData?.name ?? "",
      phone: agent.userData?.phone ?? "",
      bio: agent.userData?.bio ?? "",
    },
    agentData: {
      dateOfBirth: agent.agentData?.dateOfBirth
        ? agent.agentData.dateOfBirth.split("T")[0]
        : "",
      gender:
        (agent.agentData?.gender?.toLowerCase() as (typeof genderOptions)[number]) ??
        "male",
      address: agent.agentData?.address ?? "",
      emergencyPhone: agent.agentData?.emergencyPhone ?? "",
      ssn: agent.agentData?.ssn ?? "",
      skills: agent.agentData?.skills?.join(", ") ?? "",
      jobTitle: agent.agentData?.jobTitle ?? "",
      employmentType:
        (agent.agentData?.employmentType as (typeof employmentTypes)[number]) ??
        "full_time",
      department: agent.agentData?.department ?? "",
      shift: inferShiftFromTimes(
        agent.agentData?.workStartTime ?? "",
        agent.agentData?.workEndTime ?? ""
      ),
      startWorkDateTime: agent.agentData?.startWorkDateTime
        ? agent.agentData.startWorkDateTime.split("T")[0]
        : "",
      endWorkDateTime: agent.agentData?.endWorkDateTime
        ? agent.agentData.endWorkDateTime.split("T")[0]
        : null,
    },
  };

  const form = useForm<AgentUpdateFormInput>({
    mode: "onChange",
    resolver: zodResolver(agentUpdateSchema),
    defaultValues,
  });

  const auth = useAuth();

  const onSubmit = async (values: AgentUpdateFormInput) => {
    const { workStartTime, workEndTime } = getShiftTimes(
      values.agentData.shift
    );

    const payload: UpdateAgentUser = {
      userData: {
        name: values.userData.name,
        bio: values.userData.bio ?? "",
        phone: values.userData.phone,
      },
      agentData: {
        dateOfBirth: values.agentData.dateOfBirth,
        gender: values.agentData.gender,
        address: values.agentData.address,
        emergencyPhone: values.agentData.emergencyPhone,
        ssn: values.agentData.ssn,
        skills: values.agentData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        jobTitle: values.agentData.jobTitle,
        employmentType: values.agentData.employmentType,
        department: values.agentData.department,
        workStartTime,
        workEndTime,
        startWorkDateTime: values.agentData.startWorkDateTime,
        endWorkDateTime: values.agentData.endWorkDateTime || null,
      },
    };

    const url = `${env.NEXT_PUBLIC_API_URL}/users/agent-info/update/${agentId}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token || "",
        },
        cache: "no-cache",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed:", response.status, errorText);
        toast.error(`Failed: ${response.status} ${response.statusText}`);
        return;
      }

      const json: ApiResponse = await response.json();
      if (!json.success) {
        toast.error(json.message || "Update failed. Please try again.");
        return;
      }

      toast.success(json.message || "Agent updated successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred. Please check your connection.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormGroup title="User Information">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="userData.name" type="text" />
            <InputField label="Phone" name="userData.phone" type="tel" />
            <InputField label="Bio" name="userData.bio" type="text" />
          </div>
        </FormGroup>

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
            <InputField
              label="End Work Date"
              name="agentData.endWorkDateTime"
              type="date"
            />
          </div>
        </FormGroup>

        <div className="text-right">
          <Button size="sm" type="submit">
            Update Agent
          </Button>
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
