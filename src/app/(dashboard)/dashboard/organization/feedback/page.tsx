"use client";

import AgentFeedback from "@/features/feedback/AgentFeedbackForm";
import ServiceFeedback from "@/features/feedback/ServiceFeedbackForm";

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <ServiceFeedback />
      <AgentFeedback />
    </div>
  );
}
