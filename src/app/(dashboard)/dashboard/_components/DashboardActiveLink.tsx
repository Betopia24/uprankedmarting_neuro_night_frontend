"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ActiveLinkProps = {
  exact?: boolean;
} & React.ComponentProps<"a">;

export default function DashboardActiveLink({
  href = "",
  className,
  children,
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "block w-full hover:bg-blue-300 rounded whitespace-nowrap truncate",
        isActive && "is-active-link bg-blue-300",
        className
      )}
    >
      {children}
    </Link>
  );
}
