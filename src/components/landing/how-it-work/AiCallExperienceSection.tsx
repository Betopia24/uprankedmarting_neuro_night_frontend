import { Section, Container, ButtonWithIcon } from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";
import recordingImage from "@/images/how-it-work/recording.webp";
import Image from "next/image";

export default function AiCallExperienceSection() {
  return (
    <Section bg="bg-success-500">
      <Container>
        <ParallaxEffect>
          <StaggerFadeUp>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="space-y-4 text-xl order-2 lg:order-1">
                <Section.Heading>
                  Easily automate real customer calls without any coding.
                </Section.Heading>
                <p>
                  Launch your phone AI agent in just minutes by using your
                  existing business information through voice. As it
                  continuously speaks with customers, the agent learns and
                  improves—helping you build a more efficient and smarter
                  experience. No more missed calls—turn every opportunity into
                  action.
                </p>
                <p>
                  Our AI Call Center blends automation and human empathy.
                  Callers are greeted by a smart AI Agent that talks in a real
                  human voice. If the AI detects the need for a human, it
                  instantly passes the call to a Human Agent — without
                  disruption.
                </p>
                <p>
                  And yes, the voice you hear from our AI isn&apos;t robotic —
                  it&apos;s powered by recorded human voices, trained and guided
                  by smart instructions.
                </p>
              </div>
              <Image
                className="max-w-lg w-full mx-auto block object-contain order-1 lg:order-2"
                src={recordingImage}
                alt="recording"
              />
            </div>
            <div className="text-center mt-10 space-y-0.5">
              <ButtonWithIcon size="sm">Get Started</ButtonWithIcon>
            </div>
          </StaggerFadeUp>
        </ParallaxEffect>
      </Container>
    </Section>
  );
}
