
import logoImage from "@/images/logo.svg";
import Image from "next/image";
import ActiveLink from "../ActiveLink";
import Button from "../Button";
import Link from "next/link";

import MobileNavigation from "./MobileNavigation";

import navbarData from "@/data/navbarData";




export default function Navbar() {
  return <header className="bg-grey-100 px-6">
    <nav className="flex items-center justify-between relative xl:max-w-[95%] mx-auto">
      <div className="lg:flex-1">
        <Image src={logoImage} alt="logo" />
      </div>
      <div className="hidden md:flex"><DesktopNavigation /></div>
      <div className="lg:flex-1 flex justify-end">
        <div className="hidden md:flex gap-4 lg:gap-6">
          <Button size="sm" variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <div className="md:hidden">

          <MobileNavigation />
        </div>
      </div>
    </nav>
  </header>
};

function DesktopNavigation() {
  return <ul className="flex items-center gap-6 lg:gap-16">
    {navbarData.map((item) => (
      <li key={item.name}>
        <ActiveLink className="lg:text-2xl" href={item.href()}>{item.name}</ActiveLink>
      </li>
    ))}
  </ul>
}

