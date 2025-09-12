import { Loading } from "@/components";

export default function PageLoader() {
  return (
    <div
      style={{
        height: "calc(100vh - var(--_sidebar-header-height))",
      }}
      className="grid place-items-center -mt-12"
    >
      <Loading />
    </div>
  );
}
