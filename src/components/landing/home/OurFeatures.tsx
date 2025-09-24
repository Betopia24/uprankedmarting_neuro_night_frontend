"use client";

import { Section, Container } from "@/components";
import ScrollAnimation from "@/components/animations/ScrollAnimation";
import shakeImage from "@/images/shake.png";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Player, { LottieRefCurrentProps } from "lottie-react";
import Robot from "./_animation/robot.json";

export default function OurFeatures() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // 0.5x speed
    }
  }, []);

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row text-xl overflow-hidden">
          <div className="bg-warning space-y-4 flex-1 text-lg order-2 lg:order-1 rounded">
            <ScrollAnimation>
              <Section.Heading className="italic">
                AI Phone Agent & Virtual Receptionist for Smarter CX
              </Section.Heading>
              <p>
                Harness the power of Autoawnser.ai to deliver seamless,
                natural-sounding phone support that operates 24/7.
              </p>
              <p>
                Born from Google&apos;s pioneering Duplex tech in Area 120,
                Autoawnser.ai equips your business with a local-number phone AI
                that:
              </p>
            </ScrollAnimation>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col overflow-hidden justify-center items-center">
                <Player
                  lottieRef={lottieRef}
                  animationData={Robot}
                  loop={true}
                  autoplay={true}
                  className="pointer-events-none scale-125 mt-20"
                />
              </div>
              <div className="text-base leading-relaxed space-y-2">
                <ul className="list-disc list-inside font-medium pl-4">
                  <ScrollAnimation className="space-y-2.5">
                    <li>
                      Automates customer service, scheduling, and lead capture
                      with intuitive “skills” and logic-driven flows.
                    </li>
                    <li>
                      Integrates effortlessly with your CRM, calendars, and
                      tools like Google Voice, Salesforce, Boulevard,
                      Zendesk—and counts unique customer calls for transparent
                      billing.
                    </li>
                    <li>
                      Demonstrates lightning-fast response times (under 500ms),
                      personalized greetings based on CRM lookup, and smart call
                      routing for high-intent callers.
                    </li>
                    <li>
                      Delivers impactful analytics—call transcripts, intent
                      detection, sentiment, and customer insights—to help
                      optimize performance and ROI.
                    </li>
                    <li>
                      Offers setup in minutes via website, Google listing
                      integration, or CRM plug‑ins; scalable across solos to
                      enterprise-level operations.
                    </li>
                  </ScrollAnimation>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
