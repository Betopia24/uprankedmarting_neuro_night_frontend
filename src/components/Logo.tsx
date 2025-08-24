import logoImage from "@/images/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/">
      <Image className={cn(className)} src={logoImage} alt="logo" />
    </Link>
  );
}
