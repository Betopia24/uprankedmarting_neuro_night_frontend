import Link from "next/link";
import SocialLogins from "./SocialLogins";
import robotImage from "@/images/robot.png";
import Image from "next/image";
import Heading from "../Heading";
import logoImage from "@/images/logo.svg";
import { homePath } from "@/paths";

interface AuthFormLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
  showSocialLogins?: boolean;
}

export default function AuthFormLayout({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkText,
  showSocialLogins = true,
}: AuthFormLayoutProps) {
  return (
    <div className="flex gap-20 items-center justify-center h-screen">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="lg:flex-1 max-w-md p-8 bg-white rounded-lg shadow-lg space-y-10">
          <Link href={homePath()}>
            <Image className="mx-auto" src={logoImage} alt="Logo" />
          </Link>
          <div className="space-y-4 text-center">
            <Heading className="text-fluid-40">{title}</Heading>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>
          {children}

          <div>
            {showSocialLogins && (
              <div className="space-y-4">
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-sm text-gray-500">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <SocialLogins />
              </div>
            )}
            <p className="mt-6 text-sm text-center text-gray-600">
              {footerText}
              <Link
                href={footerLink}
                className="font-medium text-primary hover:text-primary"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
        <div className="lg:flex-1 hidden lg:block">
          <Image src={robotImage} alt="Robot Image" />
        </div>
      </div>
    </div>
  );
}
