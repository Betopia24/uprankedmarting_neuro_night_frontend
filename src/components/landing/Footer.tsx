import logoImage from "@/images/logo.svg";
import Image from "next/image";
import Container from "../Container";
import {
  contactPath,
  homePath,
  howItWork,
  pricingPath,
  privacyPolicyPath,
  supportPath,
  termsAndConditionsPath,
} from "@/paths";
import Link from "next/link";
import facebookIcon from "@/images/facebook.svg";
import twitterIcon from "@/images/twitter.svg";
import instagramIcon from "@/images/instagram.svg";
import linkedinIcon from "@/images/linkedin.svg";

const links = [
  { id: 1, name: "Home", href: homePath },
  { id: 2, name: "How It Work", href: howItWork },
  { id: 3, name: "Pricing", href: pricingPath },
];

const socialLinks = [
  { id: 1, name: "Facebook", icon: facebookIcon, href: "#" },
  { id: 2, name: "Twitter", icon: twitterIcon, href: "#" },
  { id: 3, name: "Instagram", icon: instagramIcon, href: "#" },
  { id: 4, name: "Linkedin", icon: linkedinIcon, href: "#" },
];

const externalLinks = [
  { id: 1, name: "Privacy", href: privacyPolicyPath },
  { id: 2, name: "Terms of Service", href: termsAndConditionsPath },
  { id: 3, name: "Support", href: supportPath },
  { id: 4, name: "Contact Us", href: contactPath },
];

export default function Footer() {
  return (
    <footer className="bg-white-20">
      <Container>
        <div className="text-center">
          <Image
            className="size-10 md:size-14 lg:size-20 mx-auto"
            src={logoImage}
            alt="logo"
          />
        </div>
        <ul className="flex flex-wrap gap-4 justify-center">
          {links.map((link) => (
            <li key={link.id}>
              <Link href={link.href()}>{link.name}</Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-4 justify-center mt-4">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <Link href={link.href}>
                <Image src={link.icon} alt={link.name} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 border-t border-primary flex justify-between items-center gap-2 py-4">
          {/* <ul className="flex flex-wrap gap-4 justify-center text-[10px]">
            {externalLinks.slice(0, 2).map((link) => (
              <li key={link.id}>
                <Link href={link.href()}>{link.name}</Link>
              </li>
            ))}
          </ul> */}
          <span className="text-sm">
            &copy;{new Date().getFullYear()} Autoawnser.ai. All rights reserved.
          </span>
          <ul className="flex flex-wrap gap-4 justify-center text-[10px]">
            {externalLinks.slice(2).map((link) => (
              <li key={link.id}>
                <Link href={link.href()}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
