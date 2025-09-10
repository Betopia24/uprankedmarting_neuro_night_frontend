import { LucideCircleArrowRight } from "lucide-react";
import Button, { ButtonProps } from "./Button";
import Link from "next/link";
import { pricingPath } from "@/paths";

type Props = {} & React.PropsWithChildren & ButtonProps;

export default function ButtonWithIcon({ children, ...props }: Props) {
  return (
    <Button {...props} asChild>
      <Link href={pricingPath()}>
        {children} <LucideCircleArrowRight />
      </Link>
    </Button>
  );
}
