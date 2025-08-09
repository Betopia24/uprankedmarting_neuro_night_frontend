"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ParallaxTextProps {
  children: React.ReactNode;
  className?: string;
  parallaxAmount?: number;
}

const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  className = "",
  parallaxAmount = 50,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxAmount, -parallaxAmount]
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
      }}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxText;
