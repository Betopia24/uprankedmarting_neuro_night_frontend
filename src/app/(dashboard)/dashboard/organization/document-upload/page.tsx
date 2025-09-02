import KnowledgeBaseFilesWrapper from "@/features/organization/KnowledgeBaseFilesWrapper";
import { getMe } from "@/lib/auth";

export default async function OrganizationDocumentUploadPage() {
  const me = await getMe();
  if (!me) return <div>Unauthorized</div>;
  return (
    <>
      {me?.ownedOrganization?.id && (
        <KnowledgeBaseFilesWrapper organizationId={me.ownedOrganization.id} />
      )}
    </>
  );
}
