"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ActiveLinkProps = {
  exact?: boolean;
} & React.ComponentProps<"a">;

export default function ActiveLink({
  href = "",
  exact = false,
  className,
  children,
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn("block w-full", isActive && "is-active-link", className)}
    >
      {children}
    </Link>
  );
}
