import Button from "@/components/Button";
import Heading from "@/components/Heading";
import RatingViewer from "@/components/RatingViewer";
import { getServerAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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

      <div className="bg-gray-200 p-4 rounded-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <AgentProfileCard
              key={user.id}
              user={user}
              isSelected={viewParam === "my-agents"}
            />
          ))}
        </div>
      </div>
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

// -----------------------------
// Profile Card
// -----------------------------

export function AgentProfileCard({
  user,
  isSelected,
}: {
  user: AgentUser;
  isSelected: boolean;
}) {
  return (
    <div className="bg-white rounded shadow-xl p-4 overflow-hidden">
      <div className="max-w-84 mx-auto space-y-3 text-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto"
            width={96}
            height={96}
          />
        ) : (
          <div className="size-24 border border-gray-400 rounded-full mx-auto flex items-center justify-center text-4xl font-semibold">
            {user.name.slice(0, 1)}
          </div>
        )}

        <div>
          <Heading size="h4" as="h4">
            {user.name}
          </Heading>
          <span className="text-xs text-black/70 leading-none capitalize truncate">
            {user.Agent.skills.slice(0, 2).join(", ")}
          </span>
        </div>

        <div className="flex justify-center">
          <RatingViewer rating={user.Agent.avgRating} />
        </div>

        <p className="text-xs">{user.bio}</p>

        <div className="text-center">
          {!isSelected ? (
            <Button size="sm">Select</Button>
          ) : (
            <Button size="sm" className="bg-yellow-500 px-8">
              Remove
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between flex-wrap border-t border-t-gray-200 py-4 px-8">
          <Stats
            progress={user.Agent.AgentFeedbacks.length}
            label="Feedbacks"
          />
          <Stats progress={user.Agent.totalCalls} label="Total Calls" />
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Stats
// -----------------------------

function Stats({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="flex flex-col text-center">
      <span className="text-base font-semibold">{progress}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}
