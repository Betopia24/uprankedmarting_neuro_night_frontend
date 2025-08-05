import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Tone = "default" | "outline";
type Weight = "bold" | "medium";
type Size = "sm" | "lg" | "icon";
type Shape = "default" | "pill";

const buttonVariantClasses: Record<Variant, Record<Partial<Tone>, string>> = {
  primary: {
    default: "bg-primary text-white hover:bg-color-primary/80",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  },
  secondary: {
    default: "bg-white text-black hover:opacity-90",
    outline: "border border-grey-300 text-black",
  },
};

const buttonSizeClasses: Record<Size, string> = {
  sm: "px-6 py-2 text-sm rounded-md h-10",
  lg: "px-10 py-3 text-base rounded-lg h-12",
  icon: "size-8",
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
        "font-sans inline-flex items-center justify-center transition-[transform_opacity] focus:outline-none focus:ring focus:ring-offset-px ring-grey-300 tracking-custom cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:text-inherit duration-300 hover:-translate-y-px gap-2.5 [&>svg]:size-5 whitespace-nowrap",
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
