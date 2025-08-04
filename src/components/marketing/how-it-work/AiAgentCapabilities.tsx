import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import shakeImage from "@/images/how-it-work/shake.png";
import Image from "next/image";

export default function AiAgentCapabilities() {
  return (
    <section className="bg-grey-100 py-10 lg:py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="space-y-4 text-fluid-24 order-2 lg:order-1">
            <div className="space-y-4 text-fluid-20">
              <Heading size={40}>
                Know Out What Your AI Agent Can Do for You
              </Heading>
              <p>
                Harness the power of Autoawnser.ai to deliver seamless,
                natural-sounding phone support that operates 24/7.
              </p>
              <p>
                Born from Google&apos;s pioneering Duplex tech in Area 120,
                Autoawnser.ai equips your business with a local-number phone AI
                that:
              </p>
            </div>
            <ul className="list-disc space-y-4 pl-8">
              <li>
                Automates customer service, scheduling, and lead capture with
                intuitive “skills” and logic-driven flows{" "}
              </li>
              <li>
                Integrates effortlessly with your CRM, calendars, and tools like
                Google Voice, Salesforce, Boulevard, Zendesk—and counts unique
                customer calls for transparent billing.
              </li>
              <li>
                Demonstrates lightning-fast response times (under 500ms),
                personalized greetings based on CRM lookup, and smart call
                routing for high-intent callers.
              </li>
              <li>
                Delivers impactful analytics—call transcripts, intent detection,
                sentiment, and customer insights—to help optimize performance
                and ROI.
              </li>
              <li>
                Offers setup in minutes via website, Google listing integration,
                or CRM plugins; scalable across solos to enterprise-level
                operations.
              </li>
            </ul>
            <div className="mt-10 inline-block text-center">
              <Button>Get Started For Free</Button>
              <span className="block text-sm">No credit card required*</span>
            </div>
          </div>
          <Image
            className="max-w-lg w-full mx-auto block object-contain order-1 lg:order-2"
            src={shakeImage}
            alt="recording"
          />
        </div>
        <div className="text-center"></div>
      </Container>
    </section>
  );
}
