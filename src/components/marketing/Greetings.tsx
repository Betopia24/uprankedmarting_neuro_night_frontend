import Button from "../Button";
import Container from "../Container";
import Heading from "../Heading";

export default function Greetings() {
  return (
    <section className="py-14 lg:py-20">
      <Container className="space-y-6">
        <div className="bg-success-500 p-9">
          <div className="flex items-center">
            <Heading>Welcome to Autoawnser.ai,</Heading>
            <p>where smart technology meets human touch.</p>
          </div>
          <p>
            Our AI-powered phone agents handle calls, qualify leads, and book
            appointments around the clock, while our live receptionists step in
            for complex needs. With seamless integrations, free spam call
            blocking, and customizable workflows, we help small businesses, law
            firms, and enterprises save time and delight customers.
          </p>
        </div>
        <Button size="sm">Start You 14-Day Free Trial</Button>
      </Container>
    </section>
  );
}
