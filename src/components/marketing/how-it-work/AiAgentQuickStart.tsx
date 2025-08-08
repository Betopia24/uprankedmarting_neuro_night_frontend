import { Section, Container, Button } from "@/components";
import documentPlaceholderImage from "@/images/how-it-work/document-placeholder.png";
import Image from "next/image";

export default function AiAgentQuickStart() {
  return (
    <Section bg="bg-success-500">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <Image
            className="max-w-lg w-full mx-auto block object-contain -translate-y-8"
            src={documentPlaceholderImage}
            alt="recording"
          />
          <div className="space-y-4 text-fluid-20">
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
          </div>
        </div>
      </Container>
    </Section>
  );
}
