import FileUpload from "@/components/FileUpload";
import { env } from "@/env";
import KnowledgeBaseFiles from "@/features/organization/KnowledgeBaseFiles";
import { getMe } from "@/lib/auth";

export default async function OrganizationDocumentUploadPage() {
  const me = await getMe();
  if (!me) return <div>Unauthorized</div>;
  const response = await fetch(
    `${env.API_BASE_URL_AI}/organization-knowledge/knowledge-base/${me.ownedOrganization?.id}`
  );
  const organizationList = await response.json();
  return (
    <>
      <div className="p-4">
        <FileUpload
          uploadUrl={`${env.API_BASE_URL_AI}/organization-knowledge/knowledge-base/file`}
          payload={{ organizationId: me.ownedOrganization?.id || "" }}
          accept={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.apple.pages",
          ]}
          maxSize={5}
          maxFiles={5}
        />
      </div>
      <KnowledgeBaseFiles
        knowledgeBaseList={organizationList.knowledgeBaseList}
      />
    </>
  );
}
