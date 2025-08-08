import {
  BusinessTools,
  Stats,
  Testimonial,
  Greetings,
  OurFeatures,
  OurOffer,
  FAQ,
  Hero,
} from "@/components/marketing/home";

export default function Home() {
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
