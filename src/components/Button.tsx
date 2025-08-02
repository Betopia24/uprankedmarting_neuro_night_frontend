import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Tone = "default";
type Weight = "bold" | "medium";
type Size = "sm" | "lg";
type Shape = "default" | "pill";

const buttonVariantClasses: Record<Variant, Record<Tone, string>> = {
  primary: {
    default: "bg-primary text-white hover:bg-color-primary/80",
  },
  secondary: {
    default: "bg-white text-black hover:opacity-90",
  },
};

const buttonSizeClasses: Record<Size, string> = {
  sm: "px-6 py-2 text-sm rounded-md h-10",
  lg: "px-10 py-3 text-base rounded-lg h-12",
};

const buttonWeightClasses: Record<Weight, string> = {
  bold: "font-bold",
  medium: "font-medium",
};

const buttonShapeClasses: Record<Shape, string> = {
  default: "rounded-lg",
  pill: "rounded-full",
};

export type ButtonProps = {
  asChild?: boolean;
  variant?: Variant;
  tone?: Tone;
  weight?: Weight;
  size?: Size;
  shape?: Shape;
  className?: string;
} & React.ComponentPropsWithRef<"button">;

export default function Button({
  asChild,
  variant = "primary",
  tone = "default",
  weight = "medium",
  size = "lg",
  shape = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "font-sans inline-flex items-center justify-center transition-[transform_opacity] focus:outline-none focus:ring-2 focus:ring-offset-px tracking-custom cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:text-inherit duration-300 hover:-translate-y-px gap-2.5 [&>svg]:size-5 [&>svg]:fill-current whitespace-nowrap",
        buttonVariantClasses[variant]?.[tone],
        buttonSizeClasses[size],
        buttonWeightClasses[weight],
        buttonShapeClasses[shape],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

Button.displayName = "Button";