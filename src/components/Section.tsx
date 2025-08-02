import { cn } from "@/lib/utils";

type SectionProps = {} & React.ComponentProps<"section">;

export default function Section({
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("relative overflow-x-hidden", className)} {...props}>
      {children}
    </section>
  );
}