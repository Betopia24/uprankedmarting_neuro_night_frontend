import Link from "next/link";
import SocialLogins from "./SocialLogins";

interface AuthFormLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthFormLayout({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthFormLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-10">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>

        {children}

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div>
          <SocialLogins />
          <p className="mt-6 text-sm text-center text-gray-600">
            {footerText}{" "}
            <Link
              href={footerLink}
              className="font-medium text-primary hover:text-primary"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
