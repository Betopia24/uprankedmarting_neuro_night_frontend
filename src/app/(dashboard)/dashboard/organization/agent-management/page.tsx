import Button from "@/components/Button";
import Heading from "@/components/Heading";
import RatingViewer from "@/components/RatingViewer";
import { getServerAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import AgentsList from "./_components/AgentsList";

// -----------------------------
// Types
// -----------------------------

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  Agent: Agent;
}

export interface Agent {
  AgentFeedbacks: any[];
  skills: string[];
  totalCalls: number;
  isAvailable: boolean;
  status: string;
  assignTo: string;
  assignments: Assignment[];
  organization: Organization;
  avgRating: number;
  totalFeedbacks: number;
}

export interface Assignment {
  id: string;
  status: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type ViewType = "unassigned" | "my-agents";

type Props = {
  searchParams: Promise<{ view?: ViewType }>;
};

// -----------------------------
// Page Component
// -----------------------------

export default async function AgentManagementPath({ searchParams }: Props) {
  const auth = await getServerAuth();

  const params = await searchParams;
  const viewParam: ViewType = params.view ?? "unassigned";

  const response = await fetch(
    `${process.env.API_BASE_URL}/agents?viewType=${viewParam}`,
    {
      headers: {
        Authorization: `${auth?.accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  const agents = await response.json();
  const users: AgentUser[] = agents.data.users ?? [];
  const metadata: Metadata = agents.data.metadata;

  return (
    <div className="space-y-4">
      <Tabs selectedTab={viewParam} />
      <AgentsList users={users} viewParam={viewParam} />
    </div>
  );
}

// -----------------------------
// Tabs
// -----------------------------

function Tabs({ selectedTab }: { selectedTab: ViewType }) {
  return (
    <div className="flex gap-4">
      <Link
        className={cn(
          "px-3 py-1 rounded",
          selectedTab === "unassigned" && "bg-primary text-white"
        )}
        href={{ pathname: "agent-management", query: { view: "unassigned" } }}
      >
        View Agent List
      </Link>

      <Link
        className={cn(
          "px-3 py-1 rounded",
          selectedTab === "my-agents" && "bg-primary text-white"
        )}
        href={{ pathname: "agent-management", query: { view: "my-agents" } }}
      >
        View My Agent List
      </Link>
    </div>
  );
}
