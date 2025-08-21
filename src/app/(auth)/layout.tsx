import { Container, Logo } from "@/components";
import Image from "next/image";
import authIntro from "@/assets/images/robot.webp";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <Container size="lg">
      <div className="flex -mb-14">
        <div className="flex-1 hidden md:flex"></div>
        <div className="flex-1 flex justify-center">
          <Logo />
        </div>
      </div>
      <div className="h-screen flex flex-col md:flex-row items-center gap-4 justify-center">
        <div className="md:flex-1">{children}</div>
        <div className="flex-1 hidden md:flex">
          <Image src={authIntro} alt="auth" className="object-cover" />
        </div>
      </div>
    </Container>
  );
}
