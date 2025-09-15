import TwilioInboundAgent from "@/components/TwilioClient";

export default function AgentDashboardPage() {
  return (
    <div>
      <TwilioInboundAgent identity={""} />
    </div>
  );
}
