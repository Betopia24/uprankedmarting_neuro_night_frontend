import logoImage from "@/images/logo.svg";
import Image from "next/image";

export default function Logo() {
  return <Image src={logoImage} alt="logo" />;
}
