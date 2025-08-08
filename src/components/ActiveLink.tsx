"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function ActiveLink({
  href,
  children,
  className,
  ...props
}: ActiveLinkProps) {
  const isActive = usePathname() === href;
  return (
    <Link
      {...props}
      href={href}
      className={cn(
        "rounded-md px-4 py-2 hover:bg-grey-300 hover:text-black transition-colors duration-300 inline-flex",
        isActive && "bg-grey-300 text-black",
        className
      )}
    >
      {children}
    </Link>
  );
}
