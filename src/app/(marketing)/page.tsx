import BusinessTools from "@/components/marketing/BusinessTools";
import FAQ from "@/components/marketing/Faq";
import Footer from "@/components/marketing/Footer";
import Greetings from "@/components/marketing/Greetings";
import Hero from "@/components/marketing/Hero";
import OurFeatures from "@/components/marketing/OurFeatures";
import OurOffer from "@/components/marketing/OurOffer";
import Stats from "@/components/marketing/Stats";
import Testimonial from "@/components/marketing/Testimonial";

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
      <Footer />
    </>
  );
}
