import Button from "../Button";
import Container from "../Container";
import Heading from "../Heading";
import Image from "next/image";
import robotImage from "@/images/robot.png";
import personImage from "@/images/person.png";
import roboticEarphone from "@/images/robotic-earphone.png";
import roboticPhone from "@/images/robotic-phone.png";
import { IntroAnimation } from "../animations/IntroAnimation";

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-[#78A4FF] via-white via-[#EEF2FF] to-[#EEF2FF] overflow-x-hidden">
      <Container>
        <div className="text-center py-12 relative flex flex-col gap-6 items-center">
          <Heading size="6.5xl" weight="bold" className="leading-tight">
            Your Dynamic AI-Driven Virtual Receptionist & With Human.
          </Heading>
          <div className="flex">
            <div className="shrink-0 relative">
              <IntroAnimation variant="step1">
                <Image
                  className="size-28 lg:size-60 object-contain"
                  src={roboticEarphone}
                  alt="robot"
                />
              </IntroAnimation>
              <IntroAnimation
                variant="step2"
                duration={7}
                custom="left"
                followUp
              >
                <Image
                  className="size-28 lg:size-60 object-contain"
                  src={roboticEarphone}
                  alt="robot"
                />
              </IntroAnimation>
            </div>
            <div className="flex-1 text-center space-y-6">
              <p>Get the #1 rated receptionist service for small business.</p>
              <p>
                Never miss a call. Our AI and live receptionists answer 24/7,
                schedule appointments, and grow your business—all at a fraction
                of the cost.
              </p>
              <div className="space-y-2">
                <Button>Get Started For Free</Button>
                <div className="block text-xs">No credit card required*</div>
              </div>
            </div>
            <div className="shrink-0 relative">
              <IntroAnimation variant="step1">
                <Image
                  className="size-28 lg:size-60 object-contain lg:mt-20"
                  src={roboticPhone}
                  alt="robot"
                />
              </IntroAnimation>
              <IntroAnimation
                variant="step2"
                duration={7}
                custom="right"
                followUp
              >
                <Image
                  className="size-28 lg:size-60 object-contain lg:mt-20"
                  src={roboticPhone}
                  alt="robot"
                />
              </IntroAnimation>
            </div>
          </div>
          <div className="lg:-mt-32 relative">
            <IntroAnimation variant="step1">
              <Image
                className="object-contain max-h-84"
                src={robotImage}
                alt="robot"
              />
            </IntroAnimation>
            <IntroAnimation variant="step2" duration={7} custom="top" followUp>
              <Image
                className="object-contain max-h-84"
                src={personImage}
                alt="client"
              />
            </IntroAnimation>
          </div>
        </div>
      </Container>
    </div>
  );
}
