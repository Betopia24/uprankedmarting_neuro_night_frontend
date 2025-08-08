import logoImage from "@/images/logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image src={logoImage} alt="logo" />
    </Link>
  );
}
