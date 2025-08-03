"use client";

import Embla, { useEmblaContext } from "../Carousel";
import Container from "../Container";
import Heading from "../Heading";
import starFullImage from "@/images/star-full.svg";
import Image from "next/image";

type TestimonialData = {
  id: number;
  author: string;
  content: string;
  image: string;
  rating: number;
};

const testimonialsData = [
  {
    id: 1,
    author: "Owner",
    content:
      "Autoawnser.ai completely transformed how we handle incoming calls. Our AI receptionist is friendly, natural-sounding, and always available — it’s like having a 24/7 superstar at the front desk!",
    image: "",
    rating: 4,
  },
  {
    id: 2,
    author: "Owner",
    content:
      "Autoawnser.ai blends AI with live agents so seamlessly that most of our clients don’t even notice the difference. The scheduling and lead qualification features saved us hours every week.",
    image: "",
    rating: 4,
  },
  {
    id: 3,
    author: "Owner",
    content:
      "Autoawnser.ai helped automate our initial screening process and drastically reduced the time-to-hire. Candidates love the AI’s smooth voice and interaction flow.",
    image: "",
    rating: 4,
  },
];

export default function Testimonial() {
  return (
    <Embla>
      <section className="bg-warning py-8 md:py16 lg:py-24">
        <Container size="xl">
          <div className="text-center">
            <Heading size={12} className="text-warning-500">
              Testimonial
            </Heading>
            <Heading size={30} className="text-accent-500">
              What our clients say about us.
            </Heading>
          </div>

          <Embla data={testimonialsData} delay={6000} slidesPerView={3}>
            <div className="relative group/embla mt-10">
              <div className="px-10">
                <Embla.Container>
                  <Carousel />
                </Embla.Container>
              </div>
              <Embla.NavigationControls />
            </div>
          </Embla>
        </Container>
      </section>
    </Embla>
  );
}

function TestimonialCard({ data }: { data: TestimonialData }) {
  return (
    <blockquote className="border border-warning-500 rounded-3xl p-10 h-full space-y-2 text-center">
      <div className="size-32 rounded-full mx-auto border"></div>
      <Heading size={22}>{data.author}</Heading>
      <StarRating />
      <p>{data.content}</p>
    </blockquote>
  );
}

function Carousel() {
  const { data } = useEmblaContext();
  return data.map((item, index) => (
    <Embla.Slide key={index}>
      <TestimonialCard key={index} data={item as TestimonialData} />
    </Embla.Slide>
  ));
}

function StarRating() {
  return (
    <div className="flex gap-1 justify-center">
      <Image src={starFullImage} alt="star" />
      <Image src={starFullImage} alt="star" />
      <Image src={starFullImage} alt="star" />
      <Image src={starFullImage} alt="star" />
      <Image src={starFullImage} alt="star" />
    </div>
  );
}
