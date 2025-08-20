"use client";

import { useState } from "react";
import { Container, Section } from "@/components";
import { Accordion } from "@/components";

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
      <Section.Header>
        <Section.Heading>FAQ</Section.Heading>
      </Section.Header>
      <Container>
        <Accordion accordionData={accordionData} />
      </Container>
    </Section>
  );
}
