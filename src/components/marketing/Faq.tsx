"use client";

import { useState } from "react";
import Container from "../Container";
import Heading from "../Heading";
import { LucideChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeIndex, setActiveIndex] = useState(1);
  const isActive = (index: number) => activeIndex === index;

  return (
    <section className="py-10 lg:py-16">
      <Container>
        <Heading className="text-center" size={40}>
          FAQ
        </Heading>
        <div className="mt-16 space-y-4">
          {accordionData.map((item) => (
            <div
              className="space-y-2 border-b border-grey-300 pb-2"
              key={item.id}
            >
              <div
                onClick={() => setActiveIndex(item.id)}
                className="text-2xl cursor-pointer font-medium flex justify-between items-center"
              >
                {item.title}
                <button>
                  <LucideChevronDown
                    className={cn("rotate-180", {
                      "rotate-0": !isActive(item.id),
                    })}
                  />
                </button>
              </div>
              {isActive(item.id) && <p>{item.content}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
