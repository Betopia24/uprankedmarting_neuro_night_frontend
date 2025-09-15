"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as paths from "@/paths";
import { useAuth } from "@/components/AuthProvider";

type DashboardButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const adminPaths = {
  super_admin: paths.adminDashboardPath(),
  organization_admin: paths.organizationDashboardPath(),
  agent: paths.agentDashboardPrefix(),
};

export default function DashboardButton({
  children,
  className,
  variant,
  size,
  ...props
}: DashboardButtonProps) {
  const { user } = useAuth();
  console.log(user);
  return (
    <Button
      className={cn("rounded-full", className)}
      variant={variant}
      size={size}
      {...props}
      asChild
    >
      <Link href={adminPaths[user?.role as keyof typeof adminPaths]}>
        Dashboard
      </Link>
    </Button>
  );
}
