import { cn } from "@/lib/utils";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type FontWeight = "semibold" | "bold" | "regular" | "medium" | "light";
type FontSize = "6.5xl" | 48 | 40 | 30 | 22 | 18 | 16 | 12;

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: Variant;
  size?: FontSize;
  weight?: FontWeight;
  tracking?: string; // like 'tracking-wide', or custom class
};

const fontSizeClasses: Record<FontSize, string> = {
  "6.5xl": "text-[clamp(24px,3.5vw,64px)]",
  48: "text-[48px]",
  40: "text-[40px]",
  30: "text-[30px]",
  22: "text-[22px]",
  18: "text-[18px]",
  16: "text-[16px]",
  12: "text-[12px]",
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
  size = 22,
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
        "font-sans text-black leading-none",
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
