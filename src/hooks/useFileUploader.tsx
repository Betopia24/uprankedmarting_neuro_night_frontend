"use client";
import { useState } from "react";
import axios from "axios";

export function useFileUploader(
  uploadUrl: string,
  payload?: Record<string, any>
) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setProgress(0);
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (payload) {
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      return true;
    } catch (err) {
      setError("Upload failed");
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  return { progress, isUploading, error, uploadFile };
}
