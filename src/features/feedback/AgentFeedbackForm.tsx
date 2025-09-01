import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FeedbackForm } from "./FeedbackForm";
import { Button, Heading } from "@/components";
import FeedbackRating from "./FeedbackRating";
import { useState } from "react";

export default function AgentFeedbackForm() {
  const form = useForm();
  const [rating, setRating] = useState(4);

  return (
    <>
      <Form {...form}>
        <FeedbackForm name="message" label="Agent Feedback" />
      </Form>
      <div className="space-y-4">
        <Heading size="h6" as="h3" weight="regular">
          Agent Ratings
        </Heading>
        <FeedbackRating rating={rating} setRating={setRating} />
        <div className="flex justify-end">
          <Button size="sm">Submit</Button>
        </div>
      </div>
    </>
  );
}
