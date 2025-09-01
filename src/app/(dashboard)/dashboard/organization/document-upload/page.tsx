import FileUpload from "@/components/FileUpload";
import { getMe } from "@/lib/auth";

export default async function OrganizationDocumentUploadPage() {
  const me = await getMe();
  if (!me) return <div>Unauthorized</div>;
  console.log(me);
  return (
    <div className="p-4">
      <FileUpload
        uploadUrl="http://10.0.30.84:8000/organization-knowledge/knowledge-base/file"
        payload={{ organizationId: me.ownedOrganization?.id || "" }}
        accept={[
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.apple.pages", // Apple Pages
        ]}
        maxSize={10}
        maxFiles={5}
      />
    </div>
  );
}
