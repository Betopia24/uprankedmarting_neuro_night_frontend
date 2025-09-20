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
    totalCalls: agent?.callStatistics?.totalCalls ?? 0,
    avgCallDuration: agent?.callStatistics?.avgCallDuration,
    todaySuccessCalls: agent?.callStatistics?.todaySuccessCalls,
    totalCallDuration: agent?.callStatistics?.totalCallDuration,
    totalSuccessCalls: agent?.callStatistics?.totalSuccessCalls,
  };

  console.log({ agentInformation });

  return (
    <div className="mb-10 space-y-6">
      <div className="space-y-6">
        {agentInformation.image ? (
          <Image
            src={agentInformation.image}
            alt={agentInformation.name}
            width={176}
            height={176}
            className="mx-auto border rounded-full border-gray-400"
          />
        ) : (
          <div className="size-24 md:32 lg:size-44 border border-gray-400 rounded-full mx-auto flex items-center justify-center text-4xl font-semibold uppercase">
            {agentInformation?.name.slice(0, 1)}
          </div>
        )}
        <Heading size="h5" as="h4" className="capitalize text-center">
          {agentInformation.name}
        </Heading>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stats progress={agentInformation.totalCalls} label="Total Calls" />
        <Stats
          progress={
            agentInformation.totalCalls - agentInformation.totalSuccessCalls
          }
          label="Total Dropped Calls"
        />
        <Stats
          progress={agentInformation.avgCallDuration}
          label="Avg. Call Duration"
        />
        <Stats
          progress={agentInformation.todaySuccessCalls}
          label="Today Success Calls"
        />
      </div>
    </div>
  );
}

function Stats({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="flex flex-col justify-center items-center gap-2 h-20 py-14 bg-gray-200/70 rounded">
      <div className="text-xl">{label}</div>
      <div className="text-md font-bold">{progress}</div>
    </div>
  );
}
