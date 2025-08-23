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

import { auth } from "@/auth";

export default async function Home() {
  const aa = await auth();
  console.log(aa);
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
