// import { env } from "@/env";
// import AgentForm from "./_components/Form";
// import { getServerAuth } from "@/lib/auth";
// import { getSubscriptionType } from "@/app/api/subscription/subscription";
// import { Button } from "@/components/ui/button";

// export default async function AIManagement() {
//   const auth = await getServerAuth();
//   // const userData = await getSubscriptionType(auth.accessToken);

//   // console.log("userData:", userData);

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
  // 1️⃣ Get auth info
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

  let subscription;
  try {
    subscription = await getSubscriptionType(auth.accessToken);
  } catch (err) {
    console.error("Error loading subscription:", err);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 flex flex-col items-center">
          <h1 className="text-2xl font-semibold">Buy a number first</h1>
          <Button variant={"link"} className="mt-4">
            <a href="/dashboard/organization/explore-numbers">Explore Numbers</a>
          </Button>
        </div>
      </div>
    );
  }


  if (subscription.planLevel === "only_real_agent") {
    return (
      <div className="text-red-500 text-center my-auto">
        <h1 className="text-2xl font-semibold">Your plan doesn&apos;t allow access to this feature.</h1>
        <Button variant={"link"} className="mt-4">
          <a href="/dashboard/organization/explore-numbers">Upgrade your plan</a>
        </Button >
      </div>
    );
  }

  let agentId: string | undefined;
  let orgId: string | undefined;

  try {
    const response = await fetch(`${env.API_BASE_URL}/agents/ai-agents`, {
      headers: { Authorization: `${auth.accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents. Status: ${response.status}`);
    }

    const data = await response.json();

    agentId = data?.data?.aiAgents?.[0]?.agentId;

    // Adjust according to your auth shape
    orgId =
      auth?.accessToken

    if (!orgId) {
      return <div className="text-red-500">Missing organization ID</div>;
    }
  } catch (err) {
    console.error("Error fetching AI agents:", err);
    return <div className="text-red-500">Failed to load AI agents</div>;
  }


  return <AgentForm orgId={orgId} agentId={agentId} />;
}
