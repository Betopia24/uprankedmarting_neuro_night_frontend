"use client";

import { toast } from "sonner";
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
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchFiles();
  }, [organizationId, fetchFiles]);

  // Optimistic delete handler with toast
  const handleDelete = async (id: string) => {
    // 1️⃣ Optimistically remove the file
    const previousFiles = files;
    const fileToDelete = files.find((f) => f.knowledgeBaseId === id);
    setFiles((prev) => prev.filter((f) => f.knowledgeBaseId !== id));

    toast.promise(
      (async () => {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_BASE_URL_AI}/organization-knowledge/knowledge-base/${id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Delete failed");
      })(),
      {
        loading: `Deleting ${fileToDelete?.fileName || "file"}...`,
        success: `${fileToDelete?.fileName || "File"} deleted successfully`,
        error: `Failed to delete ${fileToDelete?.fileName || "file"}`,
      }
    );
  };

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
        <KnowledgeBaseFiles
          files={files}
          organizationId={organizationId}
          onDelete={handleDelete} // Pass delete handler
        />
      )}
    </div>
  );
}
