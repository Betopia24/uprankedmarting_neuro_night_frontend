"use client";

import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Container } from "@/components";
import Section from "@/components/Section";

const statsData = [
  { value: 1500, suffix: "+", label: "Organization" },
  { value: 98.99, suffix: "%", label: "AI success rate" },
  { value: 1500, suffix: "+", label: "Total Call handle" },
];

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    return value % 1 === 0
      ? Math.round(latest).toLocaleString()
      : latest.toFixed(2);
  });

  const [displayValue, setDisplayValue] = React.useState("0");

  React.useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: "easeOut",
    });

    return controls.stop;
  }, [motionValue, value]);

  React.useEffect(() => {
    const unsubscribe = rounded.onChange((latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.span>
      {displayValue}
      {suffix}
    </motion.span>
  );
}

export default function Stats() {
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap gap-6 lg:gap-10 max-w-4xl mx-auto py-12">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white flex-1 p-10 rounded-xl shadow text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <p className="text-4xl lg:text-[32px] font-bold">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-gray-600 mt-2 font-light text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
