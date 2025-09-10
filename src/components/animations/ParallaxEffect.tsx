"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxProps {
  children: ReactNode;
  yOffset?: number;
  scaleOffset?: number;
  opacityOffset?: number;
}

export default function ParallaxElastic({
  children,
  yOffset = 50,
  scaleOffset = 0.05,
  opacityOffset = 0.2,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Elastic spring transforms
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, yOffset]), {
    stiffness: 120,
    damping: 20,
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1 + scaleOffset]),
    {
      stiffness: 120,
      damping: 20,
    }
  );

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 1], [1 - opacityOffset, 1]),
    {
      stiffness: 120,
      damping: 20,
    }
  );

  return (
    <motion.div ref={ref} style={{ y, scale, opacity }}>
      {children}
    </motion.div>
  );
}
