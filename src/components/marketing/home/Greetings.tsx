import { Section, Container, Button } from "@/components";

export default function Greetings() {
  return (
    <Section>
      <Container className="space-y-6">
        <div className="bg-success-500 p-10 space-y-4 rounded">
          <Section.Heading>Welcome to Autoawnser.ai</Section.Heading>
          <div className="space-y-2">
            <p className="text-lg">Where smart technology meets human touch.</p>
            <p>
              Our AI-powered phone agents handle calls, qualify leads, and book
              appointments around the clock, while our live receptionists step
              in for complex needs. With seamless integrations, free spam call
              blocking, and customizable workflows, we help small businesses,
              law firms, and enterprises save time and delight customers.
            </p>
          </div>
        </div>
        <Button size="sm">Start You 14-Day Free Trial</Button>
      </Container>
    </Section>
  );
}
