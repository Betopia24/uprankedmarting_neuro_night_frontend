"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { InputField } from "@/components";
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputField type="hidden" name="callbackUrl" />
          <fieldset className="space-y-6">
            <InputField
              label="Email"
              name="email"
              placeholder="Enter your email"
            >
              <LucideMail className="size-9 p-2.5 absolute right-0 bottom-0" />
            </InputField>
          </fieldset>
        </form>
      </Form>
    </>
  );
}
