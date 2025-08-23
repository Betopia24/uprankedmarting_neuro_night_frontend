import { Heading } from "@/components";
import AgentForm from "@/features/agent/AgentForm";

export default function CreateAgent() {
  return (
    <div className="px-4 space-y-10">
      <Heading size="h3">Add Agent Information</Heading>
      <AgentForm />
    </div>
  );
}
