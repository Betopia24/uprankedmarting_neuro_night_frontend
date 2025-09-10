import DocumentUploads from "@/features/organization/DocumentUploads";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";

export default async function OrganizationDocumentUploadPage() {
  const me = await getServerAuth();

  const AI_AGENT_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL_AI;

  const AI_AGENT_UPLOAD_URL = () =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/file`;

  const AI_AGENT_FETCH_URL = (organizationId: string) =>
    `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base/${organizationId}`;

  const AI_AGENT_DELETE_URL = `${AI_AGENT_BASE_URL}/organization-knowledge/knowledge-base`;

  return (
    <>
      <div className="space-y-10">
        <DocumentUploads
          organizationId={me?.data?.ownedOrganization?.id || ""}
          title="Upload Document for AI Agent"
          uploadUrl={AI_AGENT_UPLOAD_URL()}
          deleteUrl={AI_AGENT_DELETE_URL}
          fetchUrl={AI_AGENT_FETCH_URL(me?.data.ownedOrganization?.id || "")}
        />
        {/* <DocumentUploads
          organizationId={me.organizationInfo.id}
          title="Upload Document for Human Agent"
          uploadUrl={AI_AGENT_UPLOAD_URL()}
          deleteUrl={AI_AGENT_DELETE_URL}
          fetchUrl={AI_AGENT_FETCH_URL(me.organizationInfo.id)}
        /> */}
      </div>
    </>
  );
}
