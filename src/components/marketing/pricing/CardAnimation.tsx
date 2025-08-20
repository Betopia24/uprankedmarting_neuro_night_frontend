"use client";

import { motion, useTransform, useMotionTemplate } from "framer-motion";
import { useAnimation } from "./CardAnimationWrapper";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  direction: "left" | "right" | "center";
  children: React.ReactNode;
  className?: string;
};

export default function CardAnimation({
  direction,
  children,
  className,
}: Props) {
  const { progress } = useAnimation();

  const [animatedBreakpoint, setAnimatedBreakpoint] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      window.innerWidth >= 1024
        ? setAnimatedBreakpoint(true)
        : setAnimatedBreakpoint(false);
    };

    handleChange();

    window.addEventListener("resize", handleChange);

    return () => {
      window.removeEventListener("resize", handleChange);
    };
  }, [animatedBreakpoint]);

  const xNumber =
    progress &&
    useTransform(
      progress,
      [0, 1],
      [direction === "left" ? 106 : direction === "right" ? -106 : 0, 0]
    );

  const x = xNumber && useMotionTemplate`${xNumber}%`;

  return (
    <motion.div
      style={animatedBreakpoint ? { x } : undefined}
      className={cn(
        "relative",
        direction === "left" ? "z-50" : direction === "right" ? "z-10" : "z-0",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
