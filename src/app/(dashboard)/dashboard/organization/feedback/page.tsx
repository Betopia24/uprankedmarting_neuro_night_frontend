"use client";

import AgentFeedback from "@/features/feedback/AgentFeedback";
import ServiceFeedback from "@/features/feedback/ServiceFeedback";

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <ServiceFeedback />
      <AgentFeedback />
    </div>
  );
}
