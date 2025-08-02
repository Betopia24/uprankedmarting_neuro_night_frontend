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
                'rounded-md p-4 hover:bg-grey-300 transition-colors duration-300',
                isActive && "bg-grey-300",
                className
            )}
        >
            {children}
        </Link>
    );
}