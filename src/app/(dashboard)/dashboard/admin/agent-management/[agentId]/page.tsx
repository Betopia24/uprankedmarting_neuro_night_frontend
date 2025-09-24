import { env } from "@/env";
import UpdateAgentForm from "@/features/agent/UpdateAgent";
import { getAccessToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import { type UpdateAgentUser } from "@/types/agent";
import AgentProfile from "@/features/agent/AgentProfile";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T | null;
};

type Props = {
  params: Promise<{ agentId: string }>;
};

export default async function AgentDetailsPage({ params }: Props) {
  const { agentId } = await params;
  const accessToken = await getAccessToken();

  let agent: UpdateAgentUser | null = null;

  try {
    const response = await fetch(
      `${env.API_BASE_URL}/auth/get-user/${agentId}`,
      {
        headers: {
          Authorization: accessToken as string,
        },
      }
    );

    if (!response.ok) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Fetch failed:", response.status, response.statusText);
      return notFound();
    }

    const json: ApiResponse<UpdateAgentUser> = await response.json();

    if (!json.success || !json.data) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Invalid API response:", json);
      return notFound();
    }

    agent = json.data;
  } catch (error) {
    env.NEXT_PUBLIC_APP_ENV === "development" &&
      console.error("Error fetching agent:", error);
    return notFound();
  }

  return (
    <>
      {agent ? (
        <>
          <AgentProfile agentId={agentId} />
          <UpdateAgentForm agent={agent} agentId={agentId} />
        </>
      ) : (
        <p className="text-gray-500">No agent data available</p>
      )}
    </>
  );
}
