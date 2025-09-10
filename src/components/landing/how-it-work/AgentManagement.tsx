import { Section, Container } from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";
import agentManagementImage from "@/images/how-it-work/agent-management.png";
import Image from "next/image";

export default function AgentManagement() {
  return (
    <Section>
      <Container>
        <ParallaxEffect>
          <StaggerFadeUp>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="space-y-4 text-xl order-2 lg:order-1">
                <div className="space-y-8 text-xl">
                  <Section.Heading>
                    Know Out What Your AI Agent Can Do for You
                  </Section.Heading>
                  <p>
                    Our AI-powered Call Center comes with a powerful Agent
                    Management System that gives you complete control over both
                    human and AI agents. Whether you&apos;re managing a small
                    team or scaling operations, our system ensures you stay
                    organized, efficient, and flexible.
                  </p>
                </div>
                <ul className="list-disc space-y-2 pl-8">
                  <li>
                    View agent details like name, role, activity logs, and
                    Review — all in one dashboard.
                  </li>
                  <li>
                    Add or assign agents to specific call flows, departments, or
                    queues with just a few clicks.
                  </li>
                  <li>
                    Remove or replace agents instantly when needed, helping you
                    adapt quickly to staffing needs.
                  </li>
                  <li>
                    Set custom roles and permissions so every team member
                    accesses exactly what they need — nothing more, nothing
                    less.
                  </li>
                </ul>
                <div className="mt-6">
                  Designed for simplicity and built for performance, our Agent
                  Management System ensures smooth operations and maximized team
                  productivity.
                </div>
              </div>
              <Image
                className="h-full mx-auto block object-contain order-1 lg:order-2"
                src={agentManagementImage}
                alt="recording"
              />
            </div>
          </StaggerFadeUp>
        </ParallaxEffect>
      </Container>
    </Section>
  );
}
