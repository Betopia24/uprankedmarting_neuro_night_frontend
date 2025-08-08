import ActiveLink from "../ActiveLink";
import Button from "../Button";
import Link from "next/link";
import MobileNavigation from "./MobileNavigation";
import navbarData from "@/data/navbarData";
import Logo from "../Logo";

export default function Navbar() {
  return (
    <header className="bg-grey-100 px-6">
      <nav className="flex items-center justify-between relative w-full xl:max-w-[95%] mx-auto">
        <div className="lg:flex-1">
          <Logo />
        </div>
        <div className="hidden md:flex">
          <DesktopNavigation />
        </div>
        <div className="lg:flex-1 flex justify-end">
          <div className="hidden md:flex gap-4 lg:gap-6">
            <Button size="sm" variant="secondary" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
        <div className="flex md:hidden">
          <MobileNavigation />
        </div>
      </nav>
    </header>
  );
}

function DesktopNavigation() {
  return (
    <ul className="flex items-center gap-6 lg:gap-10">
      {navbarData.map((item) => (
        <li key={item.name}>
          <ActiveLink className="text-lg" href={item.href()}>
            {item.name}
          </ActiveLink>
        </li>
      ))}
    </ul>
  );
}
