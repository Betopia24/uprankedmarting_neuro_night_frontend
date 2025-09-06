"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField } from "@/components";
import { AgentFormInput, agentSchema } from "./utils/validation";
import { useEffect, useState } from "react";
import { env } from "@/env";
import { toast } from "sonner";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const employmentTypeOptions = [
  { label: "Full-time", value: "full_time" },
  { label: "Part-time", value: "part_time" },
  { label: "Contract", value: "contract" },
];

const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Sales", value: "Sales" },
  { label: "Support", value: "Support" },
  { label: "HR", value: "HR" },
];

const jobTitleOptions = [
  { label: "Software Engineer", value: "Software Engineer" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Sales Associate", value: "Sales Associate" },
  { label: "Manager", value: "Manager" },
];

export const defaultValues: AgentFormInput = {
  userData: {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+14155552671",
  },
  agentData: {
    dateOfBirth: "1995-05-15",
    sip_domain: "test-sip-sajjad.sip.twilio.com",
    sip_password: "StrongPass123!",
    gender: "male",
    address: "123 Main St, New York, NY 10001",
    emergencyPhone: "+13105551234",
    ssn: "123-45-6789",
    skills: "customer service",
    jobTitle: "Software Engineer",
    employmentType: "full_time",
    department: "Engineering",
    workStartTime: "09:00",
    workEndTime: "17:00",
    startWorkDateTime: "2025-08-23T09:00",
    endWorkDateTime: "2025-08-23T17:00",
  },
};

export default function AgentForm() {
  const form = useForm<AgentFormInput>({
    mode: "onChange",
    resolver: zodResolver(agentSchema),
    defaultValues,
  });

  const { watch, setValue, setError, clearErrors } = form;
  const startTime = watch("agentData.workStartTime");
  const endTime = watch("agentData.workEndTime");

  // Auto-suggest End Time = Start + 8 hours
  useEffect(() => {
    if (startTime && !endTime) {
      const [h, m] = startTime.split(":").map(Number);
      const end = new Date();
      end.setHours(h + 8, m, 0);
      const hh = String(end.getHours()).padStart(2, "0");
      const mm = String(end.getMinutes()).padStart(2, "0");
      setValue("agentData.workEndTime", `${hh}:${mm}`);
    }
  }, [startTime, endTime, setValue]);

  // Live validation for 8-hour shift
  useEffect(() => {
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;
      if (endMinutes - startMinutes < 480) {
        setError("agentData.workEndTime", {
          type: "manual",
          message: "Shift must be at least 8 hours long",
        });
      } else {
        clearErrors("agentData.workEndTime");
      }
    }
  }, [startTime, endTime, setError, clearErrors]);

  const onSubmit = async (data: AgentFormInput) => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/register-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // If server returns validation errors
        const message =
          result?.message || "Something went wrong. Please try again.";
        toast.error(message);
        return;
      }

      // Success toast
      toast.success("Agent registered successfully!");
      console.log("Registered agent:", result);

      // Optionally, reset form after success
      // form.reset();
    } catch (error) {
      console.error("Error registering agent:", error);
      toast.error("Network error. Please try again later.");
    }
  };

  // Tailwind-only select dropdown
  const SelectField = ({
    label,
    name,
    options,
  }: {
    label: string;
    name: string;
    options: { label: string; value: string }[];
  }) => {
    const value = watch(name as any);
    const [open, setOpen] = useState(false);

    const handleSelect = (val: string) => {
      setValue(name as any, val, { shouldValidate: true });
      setOpen(false);
    };

    return (
      <div className="relative w-full">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full border rounded px-3 py-2 text-left flex justify-between items-center focus:outline-none focus:ring"
        >
          {value || "Select..."}
          <span className="ml-2">▾</span>
        </button>
        {open && (
          <ul className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
            {options.map((opt) => (
              <li
                key={opt.value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* User Info */}
        <FormGroup title="User Information">
          <div className="grid md:grid-cols-2 gap-4 overflow-visible">
            <InputField label="Full Name" name="userData.name" type="text" />
            <InputField
              label="Email"
              name="userData.email"
              type="email"
              placeholder="example@domain.com"
            />
            <InputField
              label="Phone"
              name="userData.phone"
              type="tel"
              placeholder="+14155552671"
            />
            <InputField
              label="SIP Domain"
              name="agentData.sip_domain"
              type="tel"
              placeholder="+14155552671"
            />
            <InputField
              label="SIP Password"
              name="agentData.sip_password"
              type="tel"
              placeholder="+14155552671"
            />
          </div>
        </FormGroup>

        {/* Agent Info */}
        <FormGroup title="Agent Information">
          <div className="grid md:grid-cols-2 gap-4 overflow-visible">
            <InputField
              label="Date of Birth"
              name="agentData.dateOfBirth"
              type="date"
            />
            <SelectField
              label="Gender"
              name="agentData.gender"
              options={genderOptions}
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
            <SelectField
              label="Skills"
              name="agentData.skills"
              options={[
                { label: "Customer Service", value: "customer service" },
                { label: "Sales", value: "sales" },
                { label: "Technical Support", value: "technical support" },
                { label: "Management", value: "management" },
              ]}
            />
          </div>
        </FormGroup>

        {/* Employment Info */}
        <FormGroup title="Employment Information">
          <div className="grid md:grid-cols-2 gap-4 overflow-visible">
            <SelectField
              label="Job Title"
              name="agentData.jobTitle"
              options={jobTitleOptions}
            />
            <SelectField
              label="Employment Type"
              name="agentData.employmentType"
              options={employmentTypeOptions}
            />
            <SelectField
              label="Department"
              name="agentData.department"
              options={departmentOptions}
            />
            <InputField
              label="Work Start Time"
              name="agentData.workStartTime"
              type="time"
            />
            <InputField
              label="Work End Time"
              name="agentData.workEndTime"
              type="time"
            />
            <InputField
              label="Start Work DateTime"
              name="agentData.startWorkDateTime"
              type="datetime-local"
            />
            <InputField
              label="End Work DateTime"
              name="agentData.endWorkDateTime"
              type="datetime-local"
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

function FormGroup({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-lg md:text-xl lg:text-2xl font-medium">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
