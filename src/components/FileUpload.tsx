"use client";

import axios from "axios";
import {
  FileAudio,
  FileIcon,
  FileImage,
  FileText,
  FileVideo,
  LucideCloudUpload,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import Button from "./Button";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";

type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  error?: string;
};

type FileUploadProps = {
  uploadUrl?: string;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  payload: { organizationId: string };
  onUploadComplete?: (uploadedFiles: File[]) => void;
};

export default function FileUpload({
  uploadUrl = "https://httpbin.org/post",
  accept = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.apple.pages",
  ],
  maxSize = 10,
  maxFiles = 5,
  onUploadComplete,
  payload,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const me = useAuth();
  console.log(me?.token);

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) return `File exceeds ${maxSize}MB`;
    if (
      accept.length &&
      !accept.includes("*/*") &&
      !accept.some((t) => file.type.match(t))
    )
      return "Invalid file type";
    return null;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const validFiles: FileWithProgress[] = [];
    Array.from(newFiles).forEach((file, idx) => {
      if (files.length + validFiles.length >= maxFiles) {
        toast.error(`Max ${maxFiles} files allowed`);
        return;
      }
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          file,
          progress: 0,
          uploaded: false,
          id: `${file.name}-${Date.now()}-${idx}`,
        });
      }
    });
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length || uploading) return;
    setUploading(true);

    for (const f of files) {
      if (f.uploaded) continue; 

      const formData = new FormData();
      // 🔑 If it's human agent upload
      if (uploadUrl.includes("/company-docs")) {
        formData.append("document", f.file);
        formData.append("data", JSON.stringify({ docFor: "AGENT" }));
      } else {
        // AI agent upload
        formData.append("file", f.file);
        if (payload.organizationId)
          formData.append("organizationId", payload.organizationId);
      }

      try {
        await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${me?.token}`,
          },
          withCredentials: true,
          onUploadProgress: (e) => {
            const progress = Math.round(
              (e.loaded * 100) / (e.total || f.file.size)
            );
            setFiles((prev) =>
              prev.map((x) => (x.id === f.id ? { ...x, progress } : x))
            );
          },
        });

        setFiles((prev) =>
          prev.map((x) => (x.id === f.id ? { ...x, uploaded: true } : x))
        );

        toast.success(`${f.file.name} uploaded successfully`);

        if (onUploadComplete) {
          onUploadComplete([f.file]); // send uploaded file immediately
        }
      } catch {
        setFiles((prev) =>
          prev.map((x) =>
            x.id === f.id ? { ...x, error: "Upload failed" } : x
          )
        );
        toast.error(`${f.file.name} upload failed`);
      }
    }

    setUploading(false);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));
  const clearAll = () => setFiles([]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`bg-dark2 border border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-primary-500 bg-primary-500/10"
            : "border-gray-500 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
      >
        <LucideCloudUpload
          className={`mx-auto mb-4 ${
            isDragOver ? "text-primary-500" : "text-gray-400"
          }`}
          size={48}
        />
        <p className="text-lg font-medium">
          {isDragOver ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-gray-400 text-sm mt-1">or</p>
        <div className="flex gap-2 justify-center mt-4">
          <input
            type="file"
            ref={inputRef}
            multiple
            accept={accept.join(",")}
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            size="sm"
          >
            <Plus size={14} /> Select
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !files.length}
            size="sm"
          >
            <Upload size={14} /> Upload
          </Button>
          <Button
            onClick={clearAll}
            disabled={uploading || !files.length}
            size="sm"
          >
            <Trash2 size={14} /> Clear All
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Files:</h3>
          {files.map((f) => (
            <FileItem
              key={f.id}
              file={f}
              onRemove={removeFile}
              uploading={uploading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileItem({
  file,
  onRemove,
  uploading,
}: {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
}) {
  const Icon = getFileIcon(file.file.type);
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon size={24} className="text-primary-500" />
          <div>
            <span className="font-medium text-sm">{file.file.name}</span>
            <div className="text-xs text-gray-400 flex gap-2">
              <span>{formatFileSize(file.file.size)}</span>
              <span>•</span>
              <span>{file.file.type || "Unknown"}</span>
            </div>
          </div>
        </div>
        {!uploading && (
          <button
            onClick={() => onRemove(file.id)}
            className="cursor-pointer p-1"
          >
            <X size={16} className="text-rose-400 hover:text-rose-500" />
          </button>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <ProgressBar progress={file.progress} />
        <div className="text-right text-xs whitespace-nowrap">
          {file.error
            ? `${file.error}`
            : file.uploaded
            ? "Completed"
            : `${Math.round(file.progress)}%`}
        </div>
      </div>
    </>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime.startsWith("audio/")) return FileAudio;
  if (
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mime)
  )
    return FileText;
  return FileIcon;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
