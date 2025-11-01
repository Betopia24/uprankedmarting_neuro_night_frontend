"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef, createContext, useContext } from "react";

type AnimationContextType = {
  progress: MotionValue<number>;
};

const AnimationContext = createContext<null | AnimationContextType>(null);

export default function CardAnimationWrapper({
  children,
}: React.PropsWithChildren) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const mappedProgress = useTransform(scrollYProgress, [0, 0.75], [0, 1]);
  return (
    <AnimationContext.Provider value={{ progress: mappedProgress }}>
      <motion.div ref={containerRef} className="lg:h-[300vh] flex items-start">
        <div className="sticky top-4">{children}</div>
      </motion.div>
    </AnimationContext.Provider>
  );
}

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context)
    throw Error("useAnimation must be used within an AnimationProvider");
  return context;
};
