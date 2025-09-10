import { LucideCircleArrowRight } from "lucide-react";
import Button, { ButtonProps } from "./Button";

type Props = {} & React.PropsWithChildren & ButtonProps;

export default function ButtonWithIcon({ children, ...props }: Props) {
  return (
    <Button {...props}>
      {children} <LucideCircleArrowRight />
    </Button>
  );
}
