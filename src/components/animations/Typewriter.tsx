"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[]; // array of texts
  typingSpeed?: number; // seconds per text
  deleteSpeed?: number; // seconds to delete
  pause?: number; // pause at full text in ms
  loop?: boolean;
}

export default function MultiTypewriter({
  texts,
  typingSpeed = 2,
  deleteSpeed = 1,
  pause = 4000,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState(texts[0]);

  const chars = Array.from(currentText);

  // Timing per character
  const totalDuration = isDeleting ? deleteSpeed : typingSpeed;

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: totalDuration / chars.length } },
  };

  const charVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "linear" } },
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Wait after typing full text
      timeout = setTimeout(
        () => setIsDeleting(true),
        typingSpeed * 1000 + pause
      );
    } else {
      // Wait after deleting text
      timeout = setTimeout(() => {
        setIsDeleting(false);
        const nextIndex = (index + 1) % texts.length;
        setIndex(nextIndex);
        setCurrentText(texts[nextIndex]);
      }, deleteSpeed * 1000);
    }

    return () => clearTimeout(timeout);
  }, [isDeleting, index, texts, typingSpeed, deleteSpeed, pause]);

  return (
    <motion.span
      key={`${index}-${isDeleting}`} // force re-render on state change
      style={{ display: "inline-block" }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {chars.map((char, idx) => (
        <motion.span
          key={idx}
          variants={
            isDeleting
              ? { hidden: charVariants.show, show: charVariants.hidden }
              : charVariants
          }
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
