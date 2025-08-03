import Container from "@/components/Container";
import Heading from "@/components/Heading";
import Pricing from "@/components/marketing/Pricing";

export default function PricingPage() {
  return (
    <section className="bg-success-500  py-8 lg:py-20">
      <Container>
        <div className="text-center space-y-4">
          <div className="max-w-3xl mx-auto">
            <Heading size={48} weight="bold">
              A Cost-Effective Solution That Grows with Your Business
            </Heading>
          </div>
          <div className="max-w-5xl mx-auto">
            <p className="text-2xl">
              Get smart support without the high costs. Designed to adapt as
              your business expands, our solution offers flexibility,
              efficiency, and value — no matter your size.
            </p>
          </div>
        </div>
        <Pricing />
      </Container>
    </section>
  );
}
