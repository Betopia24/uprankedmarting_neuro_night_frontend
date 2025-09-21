import DocumentUploads from "@/features/organization/DocumentUploads";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";
import HumanDocumentUploads from "@/features/organization/HumanDocumentUpload/HumanDocumentUploads";

export default async function OrganizationDocumentUploadPage() {
  const me = await getServerAuth();
  const subscriptionRes = await getSubscriptionType(me?.accessToken || "");
  const subscription = subscriptionRes?.data;
  const AI_AGENT_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;
  const HUMAN_AGENT_BASE_URL = env.NEXT_PUBLIC_API_URL;
  const AI_AGENT_UPLOAD_URL = () =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/file`;
  const AI_AGENT_FETCH_URL = (organizationId: string) =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/${organizationId}`;
  const AI_AGENT_DELETE_URL = `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base`;

  const HUMAN_AGENT_UPLOAD_URL = () => `${HUMAN_AGENT_BASE_URL}/company-docs`;
  const HUMAN_AGENT_LIST_URL = () =>
    `${HUMAN_AGENT_BASE_URL}/company-docs/organization`;
  const HUMAN_AGENT_DELETE_FILE = () => `${HUMAN_AGENT_BASE_URL}/company-docs`;

  if (!subscription || subscription.status !== "ACTIVE") {
    return (
      <div
        style={{
          height: "calc(100vh - var(--_sidebar-header-height))",
        }}
        className="flex flex-col items-center justify-center  bg-gray-50 px-4 text-center -mt-20"
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your current plan does not allow uploading documents for Document
            Upload
          </p>
          <Button variant="link" className="mt-4">
            <a href="/dashboard/organization/explore-numbers">
              Upgrade your plan
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {subscription.planLevel === "only_real_agent" && (
        <div className="space-y-10">
          <HumanDocumentUploads
            organizationId={me?.data?.ownedOrganization?.id || ""}
            title="Upload Document for Human Agent"
            uploadUrl={HUMAN_AGENT_UPLOAD_URL()}
            deleteUrl={HUMAN_AGENT_DELETE_FILE()}
            fetchUrl={HUMAN_AGENT_LIST_URL()}
          />
        </div>
      )}

      {subscription.planLevel === "only_ai" && (
        <div className="space-y-10">
          <DocumentUploads
            organizationId={me?.data?.ownedOrganization?.id || ""}
            title="Upload Document for AI Agent"
            uploadUrl={AI_AGENT_UPLOAD_URL()}
            deleteUrl={AI_AGENT_DELETE_URL}
            fetchUrl={AI_AGENT_FETCH_URL(me?.data?.ownedOrganization?.id || "")}
          />
        </div>
      )}

      {subscription.planLevel === "ai_then_real_agent" && (
        <div className="space-y-10">
          <DocumentUploads
            organizationId={me?.data?.ownedOrganization?.id || ""}
            title="Upload Document for Human Agent"
            uploadUrl={HUMAN_AGENT_UPLOAD_URL()}
            deleteUrl={AI_AGENT_DELETE_URL}
            fetchUrl={AI_AGENT_FETCH_URL(me?.data?.ownedOrganization?.id || "")}
          />
          <HumanDocumentUploads
            organizationId={me?.data?.ownedOrganization?.id || ""}
            title="Upload Document for Human Agent"
            uploadUrl={HUMAN_AGENT_UPLOAD_URL()}
            deleteUrl={HUMAN_AGENT_DELETE_FILE()}
            fetchUrl={HUMAN_AGENT_LIST_URL()}
          />
        </div>
      )}
    </>
  );
}
