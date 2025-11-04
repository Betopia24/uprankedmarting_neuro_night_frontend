"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField, SelectDropdown } from "@/components";
import { z } from "zod";
import { AgentUpdateFormData, UpdateAgentUser } from "@/types/agent";
import { env } from "@/env";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

// --- Options ---
const genderOptions = ["male", "female", "others"] as const;
const employmentTypes = ["full_time", "part_time", "contract"] as const;
const shiftTypes = ["morning", "evening", "night"] as const;

// --- Helper Functions ---
function inferShiftFromTimes(
  start?: string,
  end?: string
): (typeof shiftTypes)[number] {
  if (start === "06:00:00" && end === "14:00:00") return "morning";
  if (start === "14:00:00" && end === "22:00:00") return "evening";
  return "night";
}

function getShiftTimes(shift?: (typeof shiftTypes)[number]) {
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

// --- Zod Schema (all optional) ---
const agentUpdateSchema = z.object({
  userData: z
    .object({
      name: z.string().trim().min(2).max(80).optional(),
      phone: z.string().min(5).max(20).optional(),
      bio: z.string().optional().nullable(),
    })
    .optional(),
  agentData: z
    .object({
      dateOfBirth: z.string().optional(),
      gender: z.enum(genderOptions).optional(),
      address: z.string().trim().min(5).max(200).optional(),
      emergencyPhone: z.string().min(5).max(20).optional(),
      ssn: z.string().trim().min(3).max(64).optional(),
      skills: z.string().optional(),
      jobTitle: z.string().trim().min(2).max(80).optional(),
      employmentType: z.enum(employmentTypes).optional(),
      department: z.string().trim().min(2).max(80).optional(),
      shift: z.enum(shiftTypes).optional(),
      startWorkDateTime: z.string().optional(),
      endWorkDateTime: z.string().nullable().optional(),
    })
    .optional(),
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

// --- Component ---
export default function UpdateAgentForm({
  agent,
  agentId,
}: UpdateAgentFormProps) {
  const defaultValues: AgentUpdateFormInput = {
    userData: {
      name: agent.name ?? "",
      phone: agent.phone ?? "",
      bio: agent.bio ?? "",
    },
    agentData: {
      skills: agent.Agent?.skills?.join(", ") ?? "",
      shift: inferShiftFromTimes(
        agent.Agent?.workStartTime,
        agent.Agent?.workEndTime
      ),
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
      values.agentData?.shift
    );

    const payload: AgentUpdateFormData = {
      userData: {
        name: values.userData?.name ?? "",
        bio: values.userData?.bio ?? "",
      },
      agentData: {
        skills:
          values.agentData?.skills
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) ?? [],
        workStartTime: workStartTime,
        workEndTime: workEndTime,
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
        env.NEXT_PUBLIC_APP_ENV === "development" &&
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
      env.NEXT_PUBLIC_APP_ENV === "development" &&
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
            {/* <InputField label="Phone" name="userData.phone" type="tel" /> */}
            <InputField label="Bio" name="userData.bio" type="text" />
          </div>
        </FormGroup>

        <FormGroup title="Agent Information">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Skills" name="agentData.skills" type="text" />

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
            disabled={form.formState.isSubmitting}
            size="sm"
            type="submit"
          >
            {form.formState.isSubmitting ? "Updating..." : "Update"}
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
