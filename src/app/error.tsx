"use client";

import Link from "next/link";
import { Button } from "@/components";
import { Section, Container } from "@/components";

type Props = {
  error?: string;
};

export default function ErrorPage({ error }: Props) {
  return (
    <Section className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container className="text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[6rem] font-extrabold text-red-200 mb-4">500</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 mb-8">
            {error
              ? error
              : "An unexpected error occurred on the server. Please try again later."}
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => location.reload()}>
              Retry
            </Button>
            <Link href="/">
              <Button size="lg">Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
