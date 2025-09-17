"use client";

import { Section, Container, ButtonWithIcon } from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";
import recordingAnim from "./_animation/recording-animation.json";
import Player, { LottieRefCurrentProps } from "lottie-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export default function AiCallExperienceSection() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3);
    }
  }, []);

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

              {/* Lottie Animation */}
              <div className="order-1 lg:order-2 flex flex-col justify-center items-center scale-90">
                <Player
                  lottieRef={lottieRef}
                  animationData={recordingAnim}
                  loop={true}
                  autoplay={true}
                  style={{ width: 500, height: 300 }}
                  className="!scale-90"
                />
                <div>
                  <div className="flex justify-center gap-6 mt-10">
                    {/* Delete Audio */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 rounded-md bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition"
                    >
                      Delete audio
                    </motion.button>

                    {/* Recording with time */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-5 py-3 rounded-md bg-gray-200 text-gray-700 font-medium shadow-md"
                    >
                      <Mic className="w-4 h-4" />
                      <span>5:00</span>
                    </motion.div>

                    {/* Confirm Audio */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 rounded-md bg-green-500 text-white font-medium shadow-md hover:bg-green-600 transition"
                    >
                      Confirm audio
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-10">
              <ButtonWithIcon size="sm">Get Started</ButtonWithIcon>
            </div>
          </StaggerFadeUp>
        </ParallaxEffect>
      </Container>
    </Section>
  );
}
