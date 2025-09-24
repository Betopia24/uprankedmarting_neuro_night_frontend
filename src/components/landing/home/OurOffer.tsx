import { Section, Container } from "@/components";
import ScrollAnimation from "@/components/animations/ScrollAnimation";
import handsImage from "@/images/hands.png";
import Image from "next/image";

export default function OurOffer() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row">
          <ScrollAnimation>
            <Image
              className="max-w-[300px] mx-auto object-contain"
              src={handsImage}
              alt="shake"
            />
          </ScrollAnimation>
          <div className="bg-warning space-y-4 flex-1 p-6 text-[20px]">
            <ScrollAnimation>
              <Section.Heading className="italic">
                What We Offer
              </Section.Heading>
            </ScrollAnimation>
            <div className="text-base leading-relaxed space-y-2">
              <ul className="list-disc list-inside">
                <ScrollAnimation className="space-y-2.5">
                  <li>
                    24/7 Call Handling: Answer every call, day or night, with AI
                    or live receptionists.
                  </li>
                  <li>
                    Smart Lead Qualification: Screen and prioritize leads based
                    on your unique needs.
                  </li>
                  <li>
                    Appointment Scheduling: Book meetings directly into your
                    calendar with tools like Calendly or Google Calendar.
                  </li>
                  <li>
                    Seamless Integrations: Connect with over 5,000 apps,
                    including HubSpot, Salesforce, Slack, and Zapier.
                  </li>
                  <li>
                    Free Spam Blocking: Stop junk calls to focus on real
                    customers.
                  </li>
                  <li>
                    Custom AI Responses: Train your AI to answer FAQs or handle
                    complex queries with your brand’s voice.
                  </li>
                  <li>
                    Bilingual Support: Serve customers in English and Spanish
                    with ease.
                  </li>
                  <li>
                    Real-Time Analytics: Track call performance and customer
                    insights in an easy-to-use dashboard.
                  </li>
                </ScrollAnimation>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
