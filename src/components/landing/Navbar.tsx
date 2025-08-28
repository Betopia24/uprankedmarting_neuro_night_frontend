import ActiveLink from "../ActiveLink";
import MobileNavigation from "./MobileNavigation";
import navbarData from "@/data/navbarData";
import Logo from "../Logo";

import AuthActions from "./AuthActions";

export default function Navbar() {
  return (
    <header className="bg-gray-50 px-6">
      <nav className="flex items-center justify-between relative w-full xl:max-w-[95%] mx-auto">
        <div className="lg:flex-1">
          <Logo />
        </div>
        <div className="hidden md:flex">
          <DesktopNavigation />
        </div>
        <div className="lg:flex-1 flex justify-end">
          <div className="hidden md:flex gap-4 lg:gap-6">
            <AuthActions />
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
