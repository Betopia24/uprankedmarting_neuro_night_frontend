"use client";

import Embla, { useEmblaContext } from "@/components/Carousel";
import { Section, Container, Heading } from "@/components";
import Image from "next/image";
import { useEffect, useState } from "react";
import { env } from "@/env";
import RatingViewer from "@/components/RatingViewer";

type TestimonialData = {
  id: string;
  author: string;
  content: string;
  image: string;
  rating: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    data: {
      id: string;
      feedbackText: string;
      rating?: number;
      client?: {
        name?: string;
        image?: string;
      };
    }[];
  };
};

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/service-feedback/testimonial-feedback`
        );
        const json: ApiResponse = await res.json();

        if (json.success && json.data?.data) {
          const mapped: TestimonialData[] = json.data.data.map((item) => ({
            id: item.id,
            author: item.client?.name || "Anonymous",
            content: item.feedbackText,
            image: item.client?.image || "",
            rating: item.rating || 0,
          }));

          setTestimonials(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading)
    return <div className="text-center py-10">Loading testimonials...</div>;
  if (!testimonials.length)
    return <div className="text-center py-10">No testimonials found.</div>;

  return (
    <Embla>
      <Section bg="bg-warning">
        <Container size="xl">
          <div className="text-center">
            <Section.Name className="text-orange-500">Testimonial</Section.Name>
            <Section.Heading>
              <div className="text-violet-950">
                What our clients say about us.
              </div>
            </Section.Heading>
          </div>

          <Embla data={testimonials} delay={6000} slidesPerView={3}>
            <div className="relative group/embla mt-10">
              <div className="px-4">
                <Embla.Container>
                  <Carousel />
                </Embla.Container>
              </div>
              <Embla.NavigationControls />
            </div>
          </Embla>
        </Container>
      </Section>
    </Embla>
  );
}

function TestimonialCard({ data }: { data: TestimonialData }) {
  return (
    <blockquote className="border border-warning-500 rounded-3xl p-2 md:p-6 lg:p-10 h-full space-y-4 text-center">
      {data.image ? (
        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border">
          <Image src={data.image} alt={data.author} width={96} height={96} />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full mx-auto border flex items-center justify-center text-xl font-bold bg-gray-200">
          {data.author.charAt(0)}
        </div>
      )}

      <Heading size="h4" className="text-violet-900">
        {data.author}
      </Heading>
      <div className="flex justify-center">
        <RatingViewer rating={data.rating} />
      </div>
      <p className="text-sm break-words">
        {data.content.slice(0, 200)}
        {data.content.length > 200 && "..."}
      </p>
    </blockquote>
  );
}

function Carousel() {
  const context = useEmblaContext();
  const data = (context?.data ?? []).map((item) => item as TestimonialData);

  return data.map((item) => (
    <Embla.Slide key={item.id} index={0}>
      <TestimonialCard data={item} />
    </Embla.Slide>
  ));
}
