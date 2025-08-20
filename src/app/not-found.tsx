"use client";

import Link from "next/link";
import { Button } from "@/components"; // assuming you have a Button component
import { Section, Container } from "@/components";

export default function NotFound() {
  return (
    <Section className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container className="text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[6rem] font-extrabold text-gray-200 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for does not exist or has been moved. Try
            going back to the homepage.
          </p>
          <Link href="/">
            <Button size="lg">Go to Homepage</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
