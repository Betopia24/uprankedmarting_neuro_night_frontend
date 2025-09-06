import { cn } from "@/lib/utils";
import Link from "next/link";
import { StatusType } from "@/types/agent";

export default function Tabs({ selectedTab }: { selectedTab: StatusType }) {
  return (
    <div className="flex">
      <Link
        className={cn(
          "px-3 py-1 rounded-tl rounded-bl border border-gray-300",
          selectedTab === "APPROVED" && "bg-primary text-white"
        )}
        href={{ pathname: "approval", query: { status: "APPROVED" } }}
      >
        Approved
      </Link>

      <Link
        className={cn(
          "px-3 py-1 rounded-tr rounded-br border border-gray-300",
          selectedTab === "REJECTED" && "bg-primary text-white"
        )}
        href={{ pathname: "approval", query: { status: "REJECTED" } }}
      >
        Rejected
      </Link>
    </div>
  );
}
