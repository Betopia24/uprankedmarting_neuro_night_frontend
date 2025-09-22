"use client";

import { Section, Container } from "@/components";
import { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import Player from "lottie-react";
import uploadCloud from "./_animation/upload-cloud.json";
import ScrollAnimation from "@/components/animations/ScrollAnimation";

export default function AiAgentQuickStart() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3);
    }
  }, []);

  return (
    <Section bg="bg-success-500 p-0">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-14 overflow-hidden">
          <div className="overflow-hidden order-1 lg:order-1">
            <ScrollAnimation className="scale-125 pointer-events-none">
              <Player
                lottieRef={lottieRef}
                animationData={uploadCloud}
                loop={true}
                autoplay={true}
              />
            </ScrollAnimation>
          </div>
          <ScrollAnimation className="order-2 lg:order-2 space-y-4 text-xl">
            <Section.Heading>
              Launch your AI agent in just minutes—no developers needed.
            </Section.Heading>
            <p className="leading-relaxed">
              Quickly connect knowledge sources like PDFs, Docs, business tools,
              and databases to activate your agent. With an intuitive,
              user-friendly interface, you have complete control to customize
              how your agent thinks, responds, and operates—without writing a
              single line of code. No limited demos, no tech team required—just
              fast, effective results.
            </p>
          </ScrollAnimation>
        </div>
      </Container>
    </Section>
  );
}
