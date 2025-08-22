import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div
        className={cn(
          "border-4 border-muted border-t-primary rounded-full animate-spin",
          sizeClasses[size]
        )}
      ></div>
      {text && (
        <p
          className={cn(
            "text-muted-foreground animate-pulse",
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
