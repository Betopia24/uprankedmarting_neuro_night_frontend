"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode, isValidElement } from "react";

interface StaggerFadeUpProps {
  children: ReactNode;
  stagger?: number;
  y?: number;
  duration?: number;
}

const getContainerVariants = (stagger: number = 0.2): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger },
  },
});

const getChildVariants = (
  y: number = 10,
  duration: number = 0.5
): Variants => ({
  hidden: { y, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration, ease: "easeOut" } },
});

export default function StaggerFadeUp({
  children,
  stagger = 0.5,
  y = 20,
  duration = 0.7,
}: StaggerFadeUpProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      variants={getContainerVariants(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {childrenArray.map((child, idx) =>
        isValidElement(child) ? (
          <motion.div key={idx} variants={getChildVariants(y, duration)}>
            {child}
          </motion.div>
        ) : (
          <motion.div key={idx} variants={getChildVariants(y, duration)}>
            <span>{child}</span>
          </motion.div>
        )
      )}
    </motion.div>
  );
}
