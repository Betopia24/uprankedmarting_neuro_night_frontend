import { Heading } from "@/components";
import { DashboardHeader, DashboardHeaderTitle } from "../../_components";

export default function FeedbackLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="space-y-4">
      <DashboardHeader>
        <DashboardHeaderTitle>Feedback</DashboardHeaderTitle>
      </DashboardHeader>
      {children}
    </div>
  );
}
