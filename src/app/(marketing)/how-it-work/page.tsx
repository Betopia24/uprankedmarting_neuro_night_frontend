import {
  AiCallExperienceSection,
  AiAgentCapabilities,
  AiAgentQuickStart,
  AgentManagement,
  AutoAnswerNumberHighlight,
  FAQ,
} from "@/components/marketing/how-it-work";

export default function HowItWorksPage() {
  return (
    <>
      <AiCallExperienceSection />
      <AiAgentCapabilities />
      <AiAgentQuickStart />
      <AgentManagement />
      {/* <AutoAnswerNumberHighlight /> */}
      <FAQ />
    </>
  );
}
