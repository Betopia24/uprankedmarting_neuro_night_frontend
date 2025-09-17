"use client";

import { Section, Container } from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";
import { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import Player from "lottie-react";
import AiRobot from "./_animation/ai-robot-assistant.json";

export default function AgentManagement() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3);
    }
  }, []);

  return (
    <Section>
      <Container>
        <ParallaxEffect>
          <StaggerFadeUp>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="space-y-4 text-xl order-1 lg:order-1">
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
              <div className="order-2 lg:order-2 flex flex-col justify-center items-center">
                <Player
                  lottieRef={lottieRef}
                  animationData={AiRobot}
                  loop={true}
                  autoplay={true}
                  style={{ width: 500, height: 500 }}
                />
              </div>
            </div>
          </StaggerFadeUp>
        </ParallaxEffect>
      </Container>
    </Section>
  );
}
