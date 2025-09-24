import { Loading } from "@/components";

export default function PageLoader() {
  return (
    <div
      style={{ height: "calc(100vh - 15rem)" }}
      className="grid place-items-center"
    >
      <Loading />
    </div>
  );
}
