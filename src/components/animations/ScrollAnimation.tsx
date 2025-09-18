"use client";

import { ReactNode, useRef } from "react";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollAnimationProps {
  children: ReactNode;
  yOffset?: number; // vertical parallax offset in px
  scaleOffset?: number; // scale effect
  opacityOffset?: number; // fade effect
  stagger?: number; // stagger between children
  duration?: number; // duration of child animation
  className?: string; // optional wrapper class
}

// ------------------------
// Variants for container & children
// ------------------------
const containerVariants = (stagger: number = 0.2): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

const childVariants = (duration: number = 0.7): Variants => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
});

// ------------------------
// Component
// ------------------------
export default function ScrollAnimation({
  children,
  yOffset = 30,
  scaleOffset = 0.03,
  opacityOffset = 0.2,
  stagger = 0.2,
  duration = 0.7,
  className = "",
}: ScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer: triggers animation only when in view
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Merge refs
  const setRefs = (node: HTMLDivElement) => {
    containerRef.current = node;
    inViewRef(node);
  };

  // Motion values for parallax
  const yMotion = useMotionValue(0);
  const ySpring = useSpring(useTransform(yMotion, [0, 1], [yOffset, 0]), {
    stiffness: 50,
    damping: 25,
    mass: 1,
  });

  const scaleSpring = useSpring(
    useTransform(yMotion, [0, 1], [1 - scaleOffset, 1]),
    {
      stiffness: 50,
      damping: 25,
      mass: 1,
    }
  );

  const opacitySpring = useSpring(
    useTransform(yMotion, [0, 1], [1 - opacityOffset, 1]),
    {
      stiffness: 50,
      damping: 25,
      mass: 1,
    }
  );

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      ref={setRefs}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={containerVariants(stagger)}
      style={{ y: ySpring, scale: scaleSpring, opacity: opacitySpring }}
    >
      {childrenArray.map((child, idx) => (
        <motion.div key={idx} variants={childVariants(duration)}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
