"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const step1 = {
  hidden: { opacity: [1, 1, 0, 0, 0, 0] },
};

const step2 = {
  hidden: (custom: "top" | "bottom" | "left" | "right" | "none") => {
    const baseStyles = {
      opacity: [0, 0, 1, 1, 0, 0],
      y:
        custom === "top"
          ? [20, 20, 0, 0, 20, 20]
          : custom === "bottom"
          ? [20, 20, 0, 0, 20, 20]
          : [0, 0, 0, 0, 0, 0],
      x:
        custom === "left"
          ? [-20, -20, 0, 0, -20, -20]
          : custom === "right"
          ? [20, 20, 0, 0, 20, 20]
          : [0, 0, 0, 0, 0, 0],
    };
    return custom === "none" ? { ...baseStyles, y: 0, x: 0 } : baseStyles;
  },
};

const variants = {
  step1: step1,
  step2: step2,
};

type IntroAnimationProps = {
  variant: "step1" | "step2";
  duration?: number;
  followUp?: boolean;
  custom?: "top" | "bottom" | "left" | "right" | "none";
} & React.PropsWithChildren;

export default function IntroAnimation({
  variant,
  children,
  duration = 5,
  followUp = false,
  custom = "none",
}: IntroAnimationProps) {
  return (
    <motion.div
      variants={variants[variant]}
      animate="hidden"
      initial={{ opacity: 0, y: 0, x: 0 }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1,
      }}
      className={cn(
        followUp && "absolute inset-0 flex items-center justify-center"
      )}
      custom={custom}
    >
      {children}
    </motion.div>
  );
}
