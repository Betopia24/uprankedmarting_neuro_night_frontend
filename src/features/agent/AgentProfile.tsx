import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Heading from "@/components/Heading";

type CallStatistics = {
  totalSuccessCalls: number;
  totalCallDuration: number;
  avgCallDuration: number;
  todaySuccessCalls: number;
  totalCalls?: number;
  droppedCalls?: number;
};

export type UpdateAgentUser = {
  name: string;
  image: string;
  callStatistics: CallStatistics;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T | null;
};

export default async function AgentProfile({ agentId }: { agentId: string }) {
  const auth = await getServerAuth();

  let agent: UpdateAgentUser | null = null;

  try {
    const response = await fetch(
      `${env.API_BASE_URL}/auth/get-agent-info/${agentId}`,
      {
        headers: { Authorization: auth?.accessToken || "" },
        cache: "no-store",
      }
    );

    if (!response.ok) return notFound();

    const json: ApiResponse<UpdateAgentUser> = await response.json();

    if (!json.success || !json.data) return notFound();

    agent = json.data;
  } catch {
    return notFound();
  }

  const agentInformation = {
    name: agent.name,
    image: agent.image,
    totalCalls: agent.callStatistics.totalCalls ?? 0,
    avgCallDuration: agent.callStatistics.avgCallDuration,
    todaySuccessCalls: agent.callStatistics.todaySuccessCalls,
    totalCallDuration: agent.callStatistics.totalCallDuration,
    totalSuccessCalls: agent.callStatistics.totalSuccessCalls,
    totalDropCalls: agent.callStatistics.droppedCalls ?? 0,
  };

  return (
    <div className="p-4 mb-10 space-y-6">
      <div className="space-y-6">
        {agentInformation.image ? (
          <Image src={agentInformation.image} alt={agentInformation.name} />
        ) : (
          <div className="size-24 md:32 lg:size-44 border border-gray-400 rounded-full mx-auto flex items-center justify-center text-4xl font-semibold uppercase">
            {agentInformation.name.slice(0, 1)}
          </div>
        )}
        <Heading size="h5" as="h4" className="capitalize text-center">
          {agentInformation.name}
        </Heading>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stats progress={agentInformation.totalCalls} label="Total Calls" />
      </div>
    </div>
  );
}

function Stats({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="flex items-center gap-2 h-20">
      <div className="text-xl font-semibold">{progress}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
