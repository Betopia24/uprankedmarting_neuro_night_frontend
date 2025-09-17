// import { env } from "@/env";
// import AgentForm from "./_components/Form";
// import { getServerAuth } from "@/lib/auth";
// import { Button } from "@/components/ui/button";

// export default async function AIManagement() {
//   const auth = await getServerAuth();

//   if (!auth?.accessToken) {
//     console.error("Missing access token from getServerAuth()");
//     return <div className="text-red-500">Unauthorized: No access token</div>;
//   }

//   if (!env.API_BASE_URL) {
//     console.error("Missing API_BASE_URL in environment variables");
//     return (
//       <div className="text-red-500">
//         Configuration error: Missing API_BASE_URL
//       </div>
//     );
//   }

//   let agentId: string | undefined;
//   let orgId: string | undefined;

//   try {
//     const response = await fetch(`${env.API_BASE_URL}/agents/ai-agents`, {
//       headers: { Authorization: auth.accessToken },
//       cache: "no-store", // avoid stale data in Next.js
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch agents. Status: ${response.status}`);
//     }

//     const data = await response.json();

//     agentId = data?.data?.aiAgents?.[0]?.agentId;
//     orgId = auth?.data?.ownedOrganization?.id;

//     if (!orgId) {
//       console.error("Organization ID missing in auth response:", auth);
//     }
//   } catch (err) {
//     console.error("Error fetching AI agents:", err);
//     return <div className="text-red-500">Failed to load AI agents</div>;
//   }

//   if (!orgId) {
//     return <div className="text-red-500">Missing organization ID</div>;
//   }

//   if (!orgId) {
//     return <div className="text-red-500">
//       <h1>Your uses plan enable for access to this feature.</h1>
//       <Button variant={"link"} className="mt-4">
//         <a href="/dashboard/organization/explore-numbers">Upgrade your plan</a>
//       </Button >

//     </div>
//   };

//   return <AgentForm orgId={orgId} agentId={agentId} />;
// }


//! Try - 2
import { env } from "@/env";
import AgentForm from "./_components/Form";
import { getServerAuth } from "@/lib/auth";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";

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

    planLevel =
      subscription?.data?.planLevel ||
      subscription?.data?.plan?.planLevel;

    if (!planLevel) {
      const subs = subscription?.data?.organization?.subscriptions || [];
      const activeSub = Array.isArray(subs)
        ? subs.find((s: any) => s.status === "ACTIVE")
        : null;
      planLevel = activeSub?.planLevel;
    }
  } catch (err) {
    console.error("Error fetching subscription:", err);
  }

  if (planLevel === "only_real_agent") {
    return (
      <div
        style={{
          height: "calc(100vh - var(--_sidebar-header-height))",
        }}
        className="flex flex-col items-center justify-center  bg-gray-50 px-4 text-center -mt-20"
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700 mb-6">Your current plan does not allow uploading documents for AI Management.</p>
          <Button variant="link" className="mt-4">
            <a href="/dashboard/organization/explore-numbers">
              Upgrade your plan
            </a>
          </Button>
        </div>
      </div>
    );
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
    return (
      <div className="text-red-500">
        Missing organization ID
      </div>
    );
  }

  return <AgentForm orgId={orgId} agentId={agentId} />;
}

