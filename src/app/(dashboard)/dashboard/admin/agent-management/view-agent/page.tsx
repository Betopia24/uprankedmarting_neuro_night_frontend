import { Heading } from "@/components";
import AgentForm from "@/features/agent/AgentForm";

export default function ViewAgent() {
  return (
    <div className="px-4 space-y-10">
      <Heading size="h3">Add Agent Information</Heading>
      <AgentForm />
    </div>
  );
}
