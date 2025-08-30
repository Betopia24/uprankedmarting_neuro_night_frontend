import ProfileButton from "@/components/ProfileButton";
import { DashboardHeader, DashboardHeaderTitle } from "../../_components";

export default function CallManagementLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="space-y-4">
      <DashboardHeader>
        <div className="flex justify-between items-center gap-2 flex-1">
          <DashboardHeaderTitle>Call Management</DashboardHeaderTitle>
          <ProfileButton />
        </div>
      </DashboardHeader>
      {children}
    </div>
  );
}
