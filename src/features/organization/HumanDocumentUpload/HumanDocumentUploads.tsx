import { Heading } from "@/components";
import HumanFilesWrapper from "./HumanFilesWrapper";

type Props = {
  organizationId: string;
  title: string;
  deleteUrl: string;
  uploadUrl: string;
  fetchUrl: string;
};

export default function HumanDocumentUploads({
  organizationId,
  title,
  deleteUrl,
  uploadUrl,
  fetchUrl,
}: Props) {
  return (
    <div className="space-y-4">
      <Heading size="h4">{title}</Heading>
      <HumanFilesWrapper
        organizationId={organizationId}
        deleteUrl={deleteUrl}
        uploadUrl={uploadUrl}
        fetchUrl={fetchUrl}
      />
    </div>
  );
}
