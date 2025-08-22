"use client";

import { motion, useScroll, HTMLMotionProps } from "framer-motion";
import { useRef } from "react";

type ScrollOffsetString =
  | "start start"
  | "start end"
  | "end start"
  | "end end"
  | "center start"
  | "center end";

type ScrollOffset = [ScrollOffsetString | number, ScrollOffsetString | number];

type Props = {
  offset?: ScrollOffset;
} & HTMLMotionProps<"div">;

export default function ViewAnimation({
  offset = ["start start", "end end"],
  ...props
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  scrollYProgress.onChange((value) => {
    console.log(value);
  });

  return (
    <motion.div ref={ref} {...props}>
      i
    </motion.div>
  );
}
