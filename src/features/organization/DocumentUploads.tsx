import { Heading } from "@/components";
import KnowledgeBaseFilesWrapper from "./KnowledgeBaseFilesWrapper";

type Props = {
  organizationId: string;
  title: string;
  deleteUrl: string;
  uploadUrl: string;
  fetchUrl: string;
};

export default function DocumentUploads({
  organizationId,
  title,
  deleteUrl,
  uploadUrl,
  fetchUrl,
}: Props) {
  return (
    <div className="space-y-4">
      <Heading size="h4">{title}</Heading>
      <KnowledgeBaseFilesWrapper
        organizationId={organizationId}
        deleteUrl={deleteUrl}
        uploadUrl={uploadUrl}
        fetchUrl={fetchUrl}
      />
    </div>
  );
}
