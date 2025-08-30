export default function DashboardHeader({ children }: React.PropsWithChildren) {
  return (
    <div className="px-[var(--_sidebar-spacing)] flex items-center gap-[var(--_sidebar-spacing)] h-[var(--_sidebar-header-height)] bg-gray-50 border-b border-l border-l-gray-100 border-b-gray-100 shadow-xs -mx-4">
      {children}
    </div>
  );
}
