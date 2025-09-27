import React from "react";
import { cn } from "@/lib/utils";
import Heading from "./Heading";

type SectionProps = {
  size?: "sm" | "md" | "lg";
  bg?: string;
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<"section">;

const paddingVariants = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

export default function Section({
  size = "md",
  bg,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("relative", paddingVariants[size], bg, className)}
      {...props}
    >
      {children}
    </section>
  );
}

function SectionHeader({ children }: React.PropsWithChildren) {
  return (
    <div className="text-center space-y-4 px-6 sm:px-8 lg:px-12 overflow-x-clip">
      {children}
    </div>
  );
}

function SectionHeading({ children, className }: React.ComponentProps<"h2">) {
  return (
    <Heading className={className} as="h2" size="h3">
      {children}
    </Heading>
  );
}

function SectionName({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-gray-600 text-base text-center max-w-xl mx-auto",
        className
      )}
    >
      {children}
    </p>
  );
}

Section.Header = SectionHeader;
Section.Heading = SectionHeading;
Section.Name = SectionName;
