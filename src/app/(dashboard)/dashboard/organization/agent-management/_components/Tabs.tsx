import { cn } from "@/lib/utils";
import Link from "next/link";
import { ViewType } from "@/types/agent";

export default function Tabs({ selectedTab }: { selectedTab: ViewType }) {
  return (
    <div className="flex">
      <Link
        className={cn(
          "px-3 py-1 rounded-tl rounded-bl border border-gray-300",
          selectedTab === "unassigned" && "bg-primary text-white"
        )}
        href={{ pathname: "agent-management", query: { view: "unassigned" } }}
      >
        View Agent List
      </Link>

      <Link
        className={cn(
          "px-3 py-1 rounded-tr rounded-br border border-gray-300",
          selectedTab === "my-agents" && "bg-primary text-white"
        )}
        href={{ pathname: "agent-management", query: { view: "my-agents" } }}
      >
        View My Agent List
      </Link>
    </div>
  );
}
