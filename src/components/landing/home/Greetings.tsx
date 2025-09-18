import { Section, Container, Heading, ButtonWithIcon } from "@/components";
import ScrollAnimation from "@/components/animations/ScrollAnimation";

export default function Greetings() {
  return (
    <Section>
      <Container>
        <ScrollAnimation>
          <div className="bg-success-500 p-10 rounded">
            <Section.Heading>Welcome to Autoawnser.ai</Section.Heading>
            <Heading as="h3" size="base" className="text-gray-950 mt-2">
              Where smart technology meets human touch.
            </Heading>
            <div className="space-y-2 mt-4">
              <p>
                Our AI-powered phone agents handle calls, qualify leads, and
                book appointments around the clock, while our live receptionists
                step in for complex needs. With seamless integrations, free spam
                call blocking, and customizable workflows, we help small
                businesses, law firms, and enterprises save time and delight
                customers.
              </p>
            </div>
            <div className="mt-4">
              <ButtonWithIcon size="sm">Get started</ButtonWithIcon>
            </div>
          </div>
        </ScrollAnimation>
      </Container>
    </Section>
  );
}
