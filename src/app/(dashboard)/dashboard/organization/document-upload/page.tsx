// import DocumentUploads from "@/features/organization/DocumentUploads";
// import { env } from "@/env";
// import { getServerAuth } from "@/lib/auth";

// export default async function OrganizationDocumentUploadPage() {
//   const me = await getServerAuth();

//   const AI_AGENT_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;

//   const AI_AGENT_UPLOAD_URL = () =>
//     `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/file`;

//   const AI_AGENT_FETCH_URL = (organizationId: string) =>
//     `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/${organizationId}`;

//   const AI_AGENT_DELETE_URL = `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base`;

//   return (
//     <>
//       <div className="space-y-10">
//         <DocumentUploads
//           organizationId={me?.data?.ownedOrganization?.id || ""}
//           title="Upload Document for AI Agent"
//           uploadUrl={AI_AGENT_UPLOAD_URL()}
//           deleteUrl={AI_AGENT_DELETE_URL}
//           fetchUrl={AI_AGENT_FETCH_URL(me?.data.ownedOrganization?.id || "")}
//         />
//         {/* <DocumentUploads
//           organizationId={me.organizationInfo.id}
//           title="Upload Document for Human Agent"
//           uploadUrl={AI_AGENT_UPLOAD_URL()}
//           deleteUrl={AI_AGENT_DELETE_URL}
//           fetchUrl={AI_AGENT_FETCH_URL(me.organizationInfo.id)}
//         /> */}
//       </div>
//     </>
//   );
// } 

//! Try - 1

import DocumentUploads from "@/features/organization/DocumentUploads";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";

export default async function OrganizationDocumentUploadPage() {

  const auth = await getServerAuth();
  const subscriptionRes = await getSubscriptionType(auth?.accessToken || "");
  const subscription = subscriptionRes?.data;

  if (
    !subscription ||
    subscription.status !== "ACTIVE" ||
    // subscription.planLevel !== "ai_then_real_agent"
    // subscription.planLevel === "only_real_agent"
    subscription.planLevel === "only_ai"
  ) {
    return (
      <div
        style={{
          height: "calc(100vh - var(--_sidebar-header-height))",
        }}
        className="flex flex-col items-center justify-center  bg-gray-50 px-4 text-center -mt-20"
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700 mb-6">Your current plan does not allow uploading documents for Document Upload</p>
          <Button variant="link" className="mt-4">
            <a href="/dashboard/organization/explore-numbers">
              Upgrade your plan
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const AI_AGENT_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;
  const AI_AGENT_UPLOAD_URL = () =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/file`;
  const AI_AGENT_FETCH_URL = (organizationId: string) =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/${organizationId}`;
  const AI_AGENT_DELETE_URL = `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base`;

  return (
    <div className="space-y-10">
      <DocumentUploads
        organizationId={auth?.data?.ownedOrganization?.id || ""}
        title="Upload Document for AI Agent"
        uploadUrl={AI_AGENT_UPLOAD_URL()}
        deleteUrl={AI_AGENT_DELETE_URL}
        fetchUrl={AI_AGENT_FETCH_URL(auth?.data?.ownedOrganization?.id || "")}
      />
    </div>
  );
}
