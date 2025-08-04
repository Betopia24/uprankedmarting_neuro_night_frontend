import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import recordingImage from "@/images/how-it-work/recording.png";
import Image from "next/image";

export default function AiCallExperienceSection() {
  return (
    <section className="bg-success-500 py-10 lg:py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="space-y-4 text-fluid-24 order-2 lg:order-1">
            <Heading size={40}>
              Easily automate real customer calls without any coding.
            </Heading>
            <p>
              Launch your phone AI agent in just minutes by using your existing
              business information through voice. As it continuously speaks with
              customers, the agent learns and improves—helping you build a more
              efficient and smarter experience. No more missed calls—turn every
              opportunity into action.
            </p>
            <p>
              Our AI Call Center blends automation and human empathy. Callers
              are greeted by a smart AI Agent that talks in a real human voice.
              If the AI detects the need for a human, it instantly passes the
              call to a Human Agent — without disruption.
            </p>
            <p>
              And yes, the voice you hear from our AI isn&apos;t robotic —
              it&apos;s powered by recorded human voices, trained and guided by
              smart instructions.
            </p>
          </div>
          <Image
            className="max-w-lg w-full mx-auto block object-contain order-1 lg:order-2"
            src={recordingImage}
            alt="recording"
          />
        </div>
        <div className="text-center mt-10">
          <Button>Get Started For Free</Button>
          <span className="block text-sm">No credit card required*</span>
        </div>
      </Container>
    </section>
  );
}
