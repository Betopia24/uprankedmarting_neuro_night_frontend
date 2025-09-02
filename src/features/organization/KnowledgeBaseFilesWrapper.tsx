"use client";

import FileUpload from "@/components/FileUpload";
import { env } from "@/env";
import KnowledgeBaseFiles from "./KnowledgeBaseFiles";
import { useCallback, useEffect, useState } from "react";

type KnowledgeFile = {
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  organizationId: string;
};

export default function KnowledgeBaseFilesWrapper({ organizationId }: Props) {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing files
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organization-knowledge/knowledge-base/${organizationId}`,
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data.knowledgeBaseList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchFiles();
  }, [organizationId, fetchFiles]);

  return (
    <div className="space-y-4">
      <FileUpload
        uploadUrl={`${env.NEXT_PUBLIC_API_BASE_URL_AI}/organization-knowledge/knowledge-base/file`}
        payload={{ organizationId }}
        accept={[
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.apple.pages",
        ]}
        maxSize={5}
        maxFiles={5}
        onUploadComplete={() => {
          fetchFiles(); // refresh the parent list
        }}
      />

      {loading ? (
        <div className="text-center text-gray-400">Loading files...</div>
      ) : (
        <KnowledgeBaseFiles files={files} />
      )}
    </div>
  );
}
