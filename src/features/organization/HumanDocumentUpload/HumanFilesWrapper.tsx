"use client";

import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import { useCallback, useEffect, useState } from "react";
import { Heading } from "@/components";
import HumanUploadedList from "./HumanUploadedFiles";
import { useAuth } from "@/components/AuthProvider";

type HumanFile = { id: string; fileName: string };

type Props = {
  organizationId: string;
  deleteUrl: string;
  uploadUrl: string;
  fetchUrl: string;
};

export default function HumanFilesWrapper({
  organizationId,
  deleteUrl,
  uploadUrl,
  fetchUrl,
}: Props) {
  const [files, setFiles] = useState<HumanFile[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  // Fetch existing files
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        fetchUrl,

        {
          cache: "no-store",
          headers: {
            Authorization: auth.token || "",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      const normalizedData = (data?.data || []).map(
        (item: { id: string; content: { metadata: { Title: string } } }) => ({
          id: item.id,
          fileName: item.content.metadata.Title || "",
        })
      );

      setFiles(normalizedData);
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
    const previousFiles = files;
    const fileToDelete = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));

    toast.promise(
      (async () => {
        const res = await fetch(`${deleteUrl}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: auth.token || "",
          },
        });
        if (!res.ok) {
          setFiles(previousFiles);
          throw new Error("Delete failed");
        }
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
        uploadUrl={uploadUrl}
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
          fetchFiles();
        }}
      />

      {loading ? (
        <div className="text-center text-gray-400">Loading files...</div>
      ) : (
        <>
          <Heading size="h6" as="h4">
            Uploaded Files:
          </Heading>
          {files.length ? (
            <HumanUploadedList
              files={files}
              organizationId={organizationId}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center text-gray-400">No files uploaded</div>
          )}
        </>
      )}
    </div>
  );
}
