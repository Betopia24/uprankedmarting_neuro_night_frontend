// src/components/FileUpload.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // ✅ DIRECT multipart form upload to your external backend
      const response = await apiClient.uploadFiles(
        "/api/upload",
        selectedFiles
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);
        setUploadProgress(100);
        setSelectedFiles([]);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>File Upload</h3>

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        disabled={isUploading}
        className="mb-4"
      />

      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <p>Selected files:</p>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading || selectedFiles.length === 0}
        className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>

      {isUploading && (
        <div className="mt-4">
          <progress value={uploadProgress} max="100" className="w-full" />
          <p>{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}
