import logoImage from "@/images/logo.svg";
import Image from "next/image";
import Container from "../Container";
import { homePath, howItWork, pricingPath } from "@/paths";
import ActiveLink from "../ActiveLink";
import Button from "../Button";
import Link from "next/link";


const navbarData = [
  { name: "Home", href: homePath },
  { name: "How It Work", href: howItWork },
  { name: "Pricing", href: pricingPath },
]


export default function Navbar() {
  return <header className="bg-grey-100 px-6">
    <nav className="flex items-center relative xl:max-w-[95%] mx-auto">
      <div className="flex-1">
        <Image src={logoImage} alt="logo" />
      </div>
      <div className="hidden lg:flex"> <DesktopNavigation /></div>
      <div className="flex-1 flex justify-end">
        <div className="hidden lg:flex gap-6">
          <Button size="sm" variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  </header>
};

function DesktopNavigation() {
  return <ul className="flex items-center gap-16">
    {navbarData.map((item) => (
      <li key={item.name}>
        <ActiveLink href={item.href()}>{item.name}</ActiveLink>
      </li>
    ))}
  </ul>
}


function MobileNavigation() {

}