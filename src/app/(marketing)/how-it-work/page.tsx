import {
  AiCallExperienceSection,
  AiAgentCapabilities,
  AiAgentQuickStart,
  AgentManagement,
  AutoAnswerNumberHighlight,
} from "@/components/marketing/how-it-work";

export default function HowItWorksPage() {
  return (
    <>
      <AiCallExperienceSection />
      <AiAgentCapabilities />
      <AiAgentQuickStart />
      <AgentManagement />
      <AutoAnswerNumberHighlight />
    </>
  );
}
