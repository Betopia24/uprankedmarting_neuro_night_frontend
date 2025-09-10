import { cn } from "@/lib/utils";
import Link from "next/link";
import { StatusType } from "@/types/agent";

export default function Tabs({ selectedTab }: { selectedTab: StatusType }) {
  return (
    <div className="flex">
      <Link
        className={cn(
          "px-3 py-1 rounded-tl rounded-bl border border-gray-300",
          (selectedTab === "all" || !selectedTab) && "bg-primary text-white"
        )}
        href={{ pathname: "approval", query: { status: "all" } }}
      >
        All
      </Link>
      <Link
        className={cn(
          "px-3 py-1 rounded-tl rounded-bl border border-gray-300",
          selectedTab === "approval" && "bg-primary text-white"
        )}
        href={{ pathname: "approval", query: { status: "approval" } }}
      >
        Approval
      </Link>

      <Link
        className={cn(
          "px-3 py-1 rounded-tr rounded-br border border-gray-300",
          selectedTab === "removal" && "bg-primary text-white"
        )}
        href={{ pathname: "approval", query: { status: "removal" } }}
      >
        Removal
      </Link>
    </div>
  );
}
