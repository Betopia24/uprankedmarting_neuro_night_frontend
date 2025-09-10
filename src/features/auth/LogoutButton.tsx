"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";

type LogoutButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    submittingLabel?: string;
    idleLabel?: string;
  };

export default function LogoutButton({
  children,
  className,
  variant,
  size,
  isLoading = false,
  submittingLabel = "Submitting",
  idleLabel = "Submit",
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const handleLogout = () => logout();
  return (
    <Button
      className={cn(
        "rounded-full bg-red-600 hover:opacity-80 hover:bg-red-600",
        className
      )}
      variant={variant}
      size={size}
      disabled={isLoading || props.disabled}
      {...props}
      onClick={handleLogout}
    >
      {children}
    </Button>
  );
}
