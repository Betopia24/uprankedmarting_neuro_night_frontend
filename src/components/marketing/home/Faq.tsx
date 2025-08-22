"use client";

import { Container, Section } from "@/components";
import { Accordion } from "@/components";
import { ParallaxEffect } from "@/components/animations";

const accordionData = [
  {
    id: 1,
    title: "How does the AI agent handle incoming calls?",
    content:
      "The AI agent automatically answers calls, greets customers with a natural human-like voice, and follows a script based on your uploaded instructions.",
  },
  {
    id: 2,
    title: "How does the AI agent handle incoming calls?",
    content:
      "The AI agent automatically answers calls, greets customers with a natural human-like voice, and follows a script based on your uploaded instructions.",
  },
  {
    id: 3,
    title: "How does the AI agent handle incoming calls?",
    content:
      "The AI agent automatically answers calls, greets customers with a natural human-like voice, and follows a script based on your uploaded instructions.",
  },
];

export default function FAQ() {
  return (
    <Section>
      <ParallaxEffect>
        <Section.Header>
          <Section.Heading className="mb-8">FAQ</Section.Heading>
        </Section.Header>
        <Container>
          <Accordion accordionData={accordionData} />
        </Container>
      </ParallaxEffect>
    </Section>
  );
}
