import { Heading } from "@/components";

export default function DashboardHeaderTitle({
  children,
}: React.PropsWithChildren) {
  return (
    <Heading as="h2" size="h5" className="capitalize">
      {children}
    </Heading>
  );
}
