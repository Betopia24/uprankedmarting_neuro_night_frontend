import { env } from "@/env";
import UpdateAgentForm from "@/features/agent/UpdateAgent";
import { getServerAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { type UpdateAgentUser } from "@/types/agent";

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
  const auth = await getServerAuth();

  let agent: UpdateAgentUser | null = null;

  try {
    const response = await fetch(
      `${env.API_BASE_URL}/auth/get-user/${agentId}`,
      {
        headers: {
          Authorization: auth?.accessToken || "",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Fetch failed:", response.status, response.statusText);
      return notFound();
    }

    const json: ApiResponse<UpdateAgentUser> = await response.json();

    if (!json.success || !json.data) {
      console.error("Invalid API response:", json);
      return notFound();
    }

    agent = json.data;
  } catch (error) {
    console.error("Error fetching agent:", error);
    return notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Agent Details</h1>
      {agent ? (
        <UpdateAgentForm agent={agent} />
      ) : (
        <p className="text-gray-500">No agent data available</p>
      )}
    </div>
  );
}
