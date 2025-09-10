"use client";

import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { FeedbackForm } from "./FeedbackForm";
import { Button, Heading } from "@/components";
import FeedbackRating from "./FeedbackRating";
import { useEffect, useState } from "react";
import SelectField from "@/components/SelectField";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";
import { toast } from "sonner";

interface FeedbackFormValues {
  message: string;
  agentId: string;
}

export default function AgentFeedbackForm() {
  const form = useForm({
    defaultValues: {
      agentId: "",
      message: "",
    },
  });
  const [rating, setRating] = useState(4);
  const auth = useAuth();
  const [agentInfos, setAgentInfos] = useState([]);

  useEffect(() => {
    if (!auth?.token) return;

    const fetchAgentIds = async () => {
      try {
        const res = await fetch(`/api/getAgentIds`);

        if (!res.ok) {
          console.error("Failed to fetch agent IDs:", res.statusText);
          return;
        }

        const data = await res.json();
        setAgentInfos(data?.data);
      } catch (err) {
        console.error("Network error fetching agent IDs:", err);
      }
    };

    fetchAgentIds();
  }, [auth?.token]);

  const agents = agentInfos || [];

  const onSubmit: SubmitHandler<FeedbackFormValues> = async () => {
    const { agentId, message } = form.getValues();

    if (!agentId) {
      toast.error("Please select an agent");
      return;
    }

    if (!message) {
      toast.error("Feedback message cannot be empty");
      return;
    }

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/agent-feedback/create-agent-feedback/${agentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth?.token || "",
          },
          body: JSON.stringify({
            feedbackText: message,
            rating,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.json().catch(() => "");
        toast.error(`Failed to submit feedback: ${res.status} ${text.message}`);
        return;
      }

      const data = await res.json();
      toast.success(data.message || "Feedback submitted successfully");
      form.reset(); // optional: reset form
      setRating(4); // reset rating
    } catch (err) {
      toast.error(`Network error: ${(err as Error).message}`);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Heading size="h5" weight="medium" as="h4">
            Agent Feedback
          </Heading>
          <div className="space-y-4 -mt-6">
            <SelectField
              name="agentId"
              defaultValue={""}
              options={agents.map(
                (agentInfo: { user: { name: string; id: string } }) => ({
                  label: agentInfo.user.name,
                  value: agentInfo.user.id,
                })
              )}
            />
            <FeedbackForm name="message" />
          </div>
          <div className="space-y-4">
            <Heading size="h6" as="h3" weight="regular">
              Agent Ratings
            </Heading>
            <FeedbackRating rating={rating} setRating={setRating} />
            <div className="flex justify-end">
              <Button size="sm">Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
