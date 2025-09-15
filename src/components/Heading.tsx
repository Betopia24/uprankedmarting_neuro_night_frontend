import { cn } from "@/lib/utils";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type FontWeight = "semibold" | "bold" | "regular" | "medium" | "light";
type FontSize =
  | "display-1"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "base"
  | "sm";

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: Variant;
  size?: FontSize;
  weight?: FontWeight;
  tracking?: string;
};

const fontSizeClasses: Record<FontSize, string> = {
  "display-1": "text-4xl lg:text-6xl xl:text-7xl",
  h1: "text-3xl sm:text-4xl md:text-5xl",
  h2: "text-2xl sm:text-3xl md:text-4xl",
  h3: "text-xl sm:text-2xl md:text-3xl",
  h4: "text-xl md:text-2xl",
  h5: "text-lg md:text-xl",
  h6: "text-base",
  base: "text-base",
  sm: "text-sm",
};

const fontWeightClasses: Record<FontWeight, string> = {
  bold: "font-bold",
  semibold: "font-semibold",
  regular: "font-normal",
  medium: "font-medium",
  light: "font-light",
};

export default function Heading({
  as = "h2",
  size = "h2",
  weight = "semibold",
  tracking,
  className,
  children,
  ...props
}: HeadingProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "font-sans text-gray-950 leading-none",
        fontSizeClasses[size],
        fontWeightClasses[weight],
        tracking,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

Heading.displayName = "Heading";
