import {
  BusinessTools,
  Stats,
  Testimonial,
  Greetings,
  OurFeatures,
  OurOffer,
  FAQ,
  Hero,
} from "@/components/landing/home";

export default async function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <BusinessTools />
      <Testimonial />
      <Greetings />
      <OurFeatures />
      <OurOffer />
      <FAQ />
    </>
  );
}
