import {
  Section,
  Container,
  Button,
  Heading,
  ButtonWithIcon,
} from "@/components";
import { ParallaxEffect, StaggerFadeUp } from "@/components/animations";

export default function Greetings() {
  return (
    <Section>
      <Container>
        <ParallaxEffect>
          <StaggerFadeUp>
            <div className="bg-success-500 p-10 rounded">
              <Section.Heading>Welcome to Autoawnser.ai</Section.Heading>
              <Heading as="h3" size="base" className="text-gray-950 mt-2">
                Where smart technology meets human touch.
              </Heading>
              <div className="space-y-2 mt-4">
                <p>
                  Our AI-powered phone agents handle calls, qualify leads, and
                  book appointments around the clock, while our live
                  receptionists step in for complex needs. With seamless
                  integrations, free spam call blocking, and customizable
                  workflows, we help small businesses, law firms, and
                  enterprises save time and delight customers.
                </p>
              </div>
              <div className="mt-4">
                <ButtonWithIcon size="sm">Get started</ButtonWithIcon>
              </div>
            </div>
          </StaggerFadeUp>
        </ParallaxEffect>
      </Container>
    </Section>
  );
}
