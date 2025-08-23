"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, InputField, SelectDropdown, SelectField } from "@/components";
import { AgentFormInput, agentSchema } from "./utils/validation";

export const defaultValues: AgentFormInput = {
  full_name: "John Doe",
  date_of_birth: new Date("1995-05-15"),
  gender: "male",
  social_security_number: "123-45-6789",
  email: "johndoe@example.com",
  phone_number: "+14155552671",
  emergency_contact_number: "+13105551234",
  residential_address: "123 Main St, New York, NY 10001",
  job_title: "Software Engineer",
  employment_type: "full_time",
  department: "Engineering",
  work_shift: "9-5",
  start_working_day: new Date("2025-08-23"),
};
export default function AgentForm() {
  const form = useForm<AgentFormInput>({
    mode: "all",
    resolver: zodResolver(agentSchema),
    defaultValues,
  });

  const onSubmit = async () => {};

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormGroup title="Personal Information">
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
              <InputField
                label="Full Name"
                name="full_name"
                placeholder="Enter full name"
                type="text"
                className="flex-1"
              />
              <InputField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                className="flex-1"
              />

              <SelectDropdown
                className="flex-1"
                label="Gender"
                name="gender"
                options={[]}
              />
              <InputField
                label="Social Security Number"
                name="social_security_number"
                type="text"
                className="w-full"
              />
            </div>
          </FormGroup>
          <FormGroup title="Contact Information">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                className="flex-1"
                label="Email"
                name="email"
                type="email"
              />
              <InputField
                className="flex-1"
                label="Phone Number"
                name="phone_number"
                type="tel"
              />
              <InputField
                className="flex-1"
                label="Emergency Contact Number"
                name="emergency_contact_number"
                type="tel"
              />
              <InputField
                className="flex-1"
                label="Residential Address"
                name="residential_address"
                type="text"
              />
            </div>
          </FormGroup>

          <FormGroup title="Employment Information">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Job Title" name="job_title" type="text" />
              <SelectDropdown
                label="Employment Type"
                name="employment_type"
                options={[]}
              />
              <InputField label="Department" name="department" type="text" />
              <SelectDropdown
                label="Work Shift"
                name="work_shift"
                options={[]}
              />
              <InputField
                label="Start Working Day"
                name="start_working_day"
                type="date"
              />
            </div>
          </FormGroup>
          <div className="text-right">
            <Button>Create Agent</Button>
          </div>
        </form>
      </Form>
    </>
  );
}

type FormGroupProps = {
  children: React.ReactNode;
  title: string;
};

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
