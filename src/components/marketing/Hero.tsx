import Button from "../Button";
import Container from "../Container";
import Heading from "../Heading";
import Image from "next/image";
import robotImage from "@/images/robot.png";
import roboticEarphone from "@/images/robotic-earphone.png";
import roboticPhone from "@/images/robotic-phone.png";
import ZoomIn from "../animations/ZoomIn";

// background: linear-gradient(180deg, #78A4FF 0%, #FFFFFF 34%, #EEF2FF 57%, rgba(1, 87, 255, 0.4) 100%);



export default function Hero() {
    return <div className="bg-gradient-to-b from-[#78A4FF] via-white via-[#EEF2FF] to-[#EEF2FF]">
        <Container>
            <div className="text-center py-12 relative flex flex-col gap-6 items-center">
                <Heading size="6.5xl" weight="bold" className="leading-tight">Your Dynamic AI-Driven Virtual Receptionist & With Human.</Heading>
                <div className="max-w-xl mx-auto space-y-6 lg:-mb-40">
                    <p>Get the #1 rated receptionist service for small business.</p>
                    <p>Never miss a call. Our AI and live receptionists answer 24/7, schedule appointments, and grow your business—all at a fraction of the cost.</p>
                    <div className="space-y-2">
                        <Button>Get Started For Free</Button>
                        <div className="block text-xs">No credit card required*</div>
                    </div>

                </div>
                <div className="flex justify-between w-full -mb-14 lg:-mb-60 pointer-events-none">
                    <ZoomIn><Image className="size-28 lg:size-60 object-contain" src={roboticEarphone} alt="robot" /></ZoomIn>
                    <ZoomIn delay={0.5}><Image className="size-28 lg:size-60 object-contain lg:mt-20" src={roboticPhone} alt="robot" /></ZoomIn>
                </div>
                <div className="mt-20"><ZoomIn delay={1}><Image className="object-contain max-h-84" src={robotImage} alt="robot" /></ZoomIn></div>

            </div>
        </Container>
    </div>
}