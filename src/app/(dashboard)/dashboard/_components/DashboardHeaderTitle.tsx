import { Heading } from "@/components";

export default function DashboardHeaderTitle({
  children,
}: React.PropsWithChildren) {
  return (
    <Heading as="h2" size="h5" className="capitalize">
      <div className="truncate w-30 md:w-52 lg:w-fit">{children}</div>
    </Heading>
  );
}
