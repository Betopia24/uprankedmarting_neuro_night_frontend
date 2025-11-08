import { Loading } from "@/components";

export default function PageLoader() {
  return (
    <div className="grid h-screen place-items-center fixed inset-0 z-50 bg-white">
      <Loading />
    </div>
  );
}
