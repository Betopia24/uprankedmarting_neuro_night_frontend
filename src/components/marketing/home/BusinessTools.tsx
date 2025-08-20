import sheetIcon from "@/images/sheet.png";
import dynamicsIcon from "@/images/dynamics.png";
import hubSpotIcon from "@/images/hubspot.png";
import boulevardIcon from "@/images/boulevard.png";
import calenderIcon from "@/images/calender.png";
import zapierIcon from "@/images/zapier.png";
import teamsIcon from "@/images/teams.png";
import Image from "next/image";
import { Section, Container, Marquee } from "@/components";

const tools = [
  { name: "Sheet", icon: sheetIcon },
  { name: "Dynamics", icon: dynamicsIcon },
  { name: "HubSpot", icon: hubSpotIcon },
  { name: "Boulevard", icon: boulevardIcon },
  { name: "Calender", icon: calenderIcon },
  { name: "Zapier", icon: zapierIcon },
  { name: "Teams", icon: teamsIcon },
];

export default function BusinessTools() {
  return (
    <Section>
      <Section.Header>
        <Section.Heading>Work With Business Tools</Section.Heading>
      </Section.Header>
      <Container className="text-center">
        <Marquee>
          <div className="overflow-hidden relative w-full mt-14">
            <div className="flex w-max animate-marquee">
              {[...tools, ...tools].map((tool, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[120px] shrink-0 px-6 whitespace-nowrap"
                >
                  <Image
                    className="w-20 h-20 object-contain"
                    src={tool.icon}
                    alt={tool.name}
                  />
                  <p className="mt-2 font-light text-sm">{tool.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Marquee>
      </Container>
    </Section>
  );
}
