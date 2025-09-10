"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LucideLoader } from "lucide-react";

type AuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    submittingLabel?: string;
    idleLabel?: string;
  };

const transitionVariants = {
  initial: {
    y: "-100%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: "100%",
    opacity: 0,
  },
};

export default function AuthButton({
  children,
  className,
  variant,
  size,
  isLoading = false,
  submittingLabel = "Submitting",
  idleLabel = "Submit",
  ...props
}: AuthButtonProps) {
  return (
    <Button
      className={cn("rounded-full", className)}
      variant={variant}
      size={size}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isLoading ? (
          <motion.span
            key="submitting"
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex gap-1 items-center"
          >
            <LucideLoader className="animate-spin" />
            {submittingLabel}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-block"
          >
            {idleLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
