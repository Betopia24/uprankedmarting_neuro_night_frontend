import { env } from "@/env";
import AgentForm from "./Form";
import { getServerAuth } from "@/lib/auth";
import { getSubscriptionType } from "@/app/api/subscription/subscription";

export default async function AIManagement() {
  const auth = await getServerAuth();

  if (!auth?.accessToken) {
    console.error("Missing access token from getServerAuth()");
    return <div className="text-red-500">Unauthorized: No access token</div>;
  }

  if (!env.API_BASE_URL) {
    console.error("Missing API_BASE_URL in environment variables");
    return (
      <div className="text-red-500">
        Configuration error: Missing API_BASE_URL
      </div>
    );
  }

  let planLevel: string | undefined;
  try {
    const subscription = await getSubscriptionType(auth.accessToken);

    planLevel = subscription?.data[0].planLevel;

    console.log({ planLevel });
  } catch (err) {
    console.error("Error fetching subscription:", err);
  }

  let agentId: string | undefined;
  let orgId: string | undefined;

  try {
    const response = await fetch(`${env.API_BASE_URL}/agents/ai-agents`, {
      headers: { Authorization: auth.accessToken },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents. Status: ${response.status}`);
    }

    const data = await response.json();

    agentId = data?.data?.aiAgents?.[0]?.agentId;
    orgId = auth?.data?.ownedOrganization?.id;

    if (!orgId) {
      console.error("Organization ID missing in auth response:", auth);
    }
  } catch (err) {
    console.error("Error fetching AI agents:", err);
    return <div className="text-red-500">Failed to load AI agents</div>;
  }

  if (!orgId) {
    return <div className="text-red-500">Missing organization ID</div>;
  }

  if (planLevel !== "only_ai" && planLevel !== "ai_then_real_agent") {
    return (
      <div className="text-red-500">
        Your current plan does not allow access to AI Management
      </div>
    );
  }

  return <AgentForm orgId={orgId} agentId={agentId} />;
}
