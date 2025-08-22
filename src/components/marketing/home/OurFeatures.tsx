import { Section, Container } from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";
import shakeImage from "@/images/shake.png";
import Image from "next/image";

export default function OurFeatures() {
  return (
    <Section>
      <Container>
        <ParallaxEffect>
          <StaggerFadeUp>
            <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row text-xl overflow-hidden">
              <div className="bg-warning space-y-4 flex-1 p-6 text-lg order-2 lg:order-1 rounded">
                <Section.Heading className="italic">
                  AI Phone Agent & Virtual Receptionist for Smarter CX
                </Section.Heading>
                <p>
                  Harness the power of Autoawnser.ai to deliver seamless,
                  natural-sounding phone support that operates 24/7.
                </p>
                <p>
                  Born from Google&apos;s pioneering Duplex tech in Area 120,
                  Autoawnser.ai equips your business with a local-number phone
                  AI that:
                </p>
                <div className="text-base leading-relaxed space-y-2">
                  <ul className="list-disc list-inside space-y-2.5 font-medium pl-4">
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
                  </ul>
                </div>
              </div>
              <Image
                className="max-w-sm mx-auto scale-150 object-contain order-1 lg:order-2"
                src={shakeImage}
                alt="shake"
              />
            </div>
          </StaggerFadeUp>
        </ParallaxEffect>
      </Container>
    </Section>
  );
}
