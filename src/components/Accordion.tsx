"use client";

import { useState } from "react";
import { LucideChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type AccordionItem = {
  id: number | string;
  title: string;
  content: React.ReactNode;
};

type Props<T extends AccordionItem> = {
  accordionData: T[];
  defaultOpenIndex?: number;
};

export default function Accordion<T extends AccordionItem>({
  accordionData,
  defaultOpenIndex = 0,
}: Props<T>) {
  const [activeIndex, setActiveIndex] = useState<number | string | null>(
    defaultOpenIndex < accordionData.length
      ? accordionData[defaultOpenIndex].id
      : accordionData[0]?.id ?? null
  );

  const toggle = (id: number | string) => {
    setActiveIndex((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-4">
      {accordionData.map((item) => {
        const isActive = activeIndex === item.id;
        return (
          <div
            className="space-y-2.5 border-b border-gray-300 pb-2"
            key={item.id}
          >
            <div
              onClick={() => toggle(item.id)}
              className="text-xl cursor-pointer font-medium flex justify-between items-start gap-2 select-none"
            >
              {item.title}
              <motion.span
                animate={{
                  rotate: isActive ? 180 : 0,
                  opacity: !isActive ? 0.5 : 1,
                }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="inline-block"
              >
                <LucideChevronDown />
              </motion.span>
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isActive ? "auto" : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="pt-2">{item.content}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
