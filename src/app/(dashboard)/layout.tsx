import {
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  SidebarProvider,
} from "./_components";

export default function AdminDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <SidebarProvider>
        <DashboardLayout
          header={<DashboardHeader />}
          sidebar={<DashboardSidebar />}
        >
          {children}
        </DashboardLayout>
      </SidebarProvider>
    </>
  );
}
