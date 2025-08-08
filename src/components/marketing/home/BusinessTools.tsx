import sheetIcon from "@/images/sheet.png";
import dynamicsIcon from "@/images/dynamics.png";
import hubSpotIcon from "@/images/hubspot.png";
import boulevardIcon from "@/images/boulevard.png";
import calenderIcon from "@/images/calender.png";
import zapierIcon from "@/images/zapier.png";
import teamsIcon from "@/images/teams.png";
import Image from "next/image";
import { Section, Container } from "@/components";

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
        <div className="flex flex-wrap justify-center gap-10 lg:gap-10 py-12">
          {tools.map((tool, index) => (
            <div key={index} className="flex-1 flex-col flex items-center">
              <Image
                className="size-20 object-contain"
                src={tool.icon}
                alt={tool.name}
              />
              <p className="mt-2 font-light text-sm">{tool.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
