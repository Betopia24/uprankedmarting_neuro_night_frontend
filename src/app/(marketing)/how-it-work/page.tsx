import AiCallExperienceSection from "@/components/marketing/how-it-work/AiCallExperienceSection";
import AiAgentCapabilities from "@/components/marketing/how-it-work/AiAgentCapabilities";
import AiAgentQuickStart from "@/components/marketing/how-it-work/AiAgentQuickStart";
import AgentManagement from "@/components/marketing/how-it-work/AgentManagement";
import AutoanswerNumberHighlight from "@/components/marketing/how-it-work/AutoanswerNumberHighlight";

export default function HowItWorksPage() {
  return (
    <>
      <AiCallExperienceSection />
      <AiAgentCapabilities />
      <AiAgentQuickStart />
      <AgentManagement />
      <AutoanswerNumberHighlight />
    </>
  );
}
