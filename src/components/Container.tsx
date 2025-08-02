import { cn } from "@/lib/utils";

type ContainerProp = {
  size?: "default" | "xl";
} & React.ComponentProps<"div">;

export default function Container({
  size = "default",
  children,
  className,
  ...props
}: ContainerProp) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6",
        {
          "max-w-[74.25rem]": size === "default",
          "max-w-[85.75rem]": size === "xl",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}