import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import documentPlaceholderImage from "@/images/how-it-work/document-placeholder.png";
import Image from "next/image";

export default function AiAgentQuickStart() {
  return (
    <section className="bg-success-500 py-10 lg:py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
          <Image
            className="max-w-lg w-full mx-auto block object-contain -translate-y-8"
            src={documentPlaceholderImage}
            alt="recording"
          />
          <div className="space-y-4">
            <div className="space-y-4 text-fluid-20">
              <Heading size={40}>
                Launch your AI agent in just minutes—no developers needed.
              </Heading>
              <p className="leading-relaxed">
                Quickly connect knowledge sources like PDFs, Docs, business
                tools, and databases to activate your agent. With an intuitive,
                user-friendly interface, you have complete control to customize
                how your agent thinks, responds, and operates—without writing a
                single line of code. No limited demos, no tech team
                required—just fast, effective results.
              </p>
            </div>
            <div className="mt-10 ml-auto w-fit text-center">
              <Button>Get Started For Free</Button>
              <span className="text-sm block">No credit card required*</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
