"use client";


import { Section, Container } from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";
import { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import Player from 'lottie-react';
import ChatBotGreetingPeople from "./_animation/cute-chatbot-greeting-people-with-computer.json";

export default function AiAgentCapabilities() {

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3); // 0.5x speed
    }
  }, []);

  return (
    <Section>
      <Container>
        <ParallaxEffect>
          <StaggerFadeUp>
            <div className="flex flex-col lg:flex-row gap-6 text-xl">
              <div className="space-y-4 order-2 lg:order-1">
                <div className="space-y-4">
                  <Section.Heading>
                    Know Out What Your AI Agent Can Do for You
                  </Section.Heading>
                  <p>
                    Harness the power of Auto answer.ai to deliver seamless,
                    natural-sounding phone support that operates 24/7.
                  </p>
                  <p>
                    Born from Google&apos;s pioneering Duplex tech in Area 120,
                    Auto answer.ai equips your business with a local-number
                    phone AI that:
                  </p>
                </div>
                <ul className="list-disc space-y-4 pl-8">
                  <li>
                    Automates customer service, scheduling, and lead capture
                    with intuitive “skills” and logic-driven flows{" "}
                  </li>
                  <li>
                    Integrates effortlessly with your CRM, calendars, and tools
                    like Google Voice, Salesforce, Boulevard, Zendesk—and counts
                    unique customer calls for transparent billing.
                  </li>
                  <li>
                    Demonstrates lightning-fast response times (under 500ms),
                    personalized greetings based on CRM lookup, and smart call
                    routing for high-intent callers.
                  </li>
                  <li>
                    Delivers impactful analytics—call transcripts, intent
                    detection, sentiment, and customer insights—to help optimize
                    performance and ROI.
                  </li>
                  <li>
                    Offers setup in minutes via website, Google listing
                    integration, or CRM plugins; scalable across solos to
                    enterprise-level operations.
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center items-center scale-90">
                <Player
                  lottieRef={lottieRef}
                  animationData={ChatBotGreetingPeople}
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
