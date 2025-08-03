import sheetIcon from "@/images/sheet.png";
import dynamicsIcon from "@/images/dynamics.png";
import hubSpotIcon from "@/images/hubspot.png";
import boulevardIcon from "@/images/boulevard.png";
import calenderIcon from "@/images/calender.png";
import zapierIcon from "@/images/zapier.png";
import teamsIcon from "@/images/teams.png";
import Heading from "../Heading";
import Image from "next/image";
import Container from "../Container";



const tools = [{ name: "Sheet", icon: sheetIcon }, { name: "Dynamics", icon: dynamicsIcon }, { name: "HubSpot", icon: hubSpotIcon }, { name: "Boulevard", icon: boulevardIcon }, { name: "Calender", icon: calenderIcon }, { name: "Zapier", icon: zapierIcon }, { name: "Teams", icon: teamsIcon }]


export default function BusinessTools() {
    return <Container className="text-center">
        <Heading>Work With Business Tools</Heading>
        <div className="flex flex-wrap justify-center gap-10 lg:gap-10 max-w-4xl mx-auto py-12">
            {tools.map((tool, index) => (
                <div key={index} className="flex-1text-center">
                    <Image className="size-20 object-contain" src={tool.icon} alt={tool.name} />
                    <p className="mt-2 font-light text-sm">{tool.name}</p>
                </div>
            ))}
        </div>
    </Container>
}