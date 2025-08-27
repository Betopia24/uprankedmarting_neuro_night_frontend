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

type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  error?: string;
};

type FileUploadProps = {
  /** API URL to upload files */
  uploadUrl?: string;
  /** Allowed file types, e.g. ['image/*', 'video/mp4'] */
  accept?: string[];
  /** Max file size in MB */
  maxSize?: number;
  /** Max number of files */
  maxFiles?: number;
  /** Callback when upload completes */
  onUploadComplete?: (files: File[]) => void;
};

export default function FileUpload({
  uploadUrl = "https://httpbin.org/post",
  accept = ["*/*"],
  maxSize = 5,
  maxFiles = 1,
  onUploadComplete,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileValidation = (file: File) => {
    if (file.size > maxSize * 1024 * 1024)
      return `File size exceeds ${maxSize}MB`;
    if (
      accept.length > 0 &&
      !accept.includes("*/*") &&
      !accept.some((type) => file.type.match(type))
    )
      return "Invalid file type";
    return null;
  };

  const handleAddFiles = (newFiles: FileList | File[]) => {
    const existingCount = files.length;
    const validFiles: FileWithProgress[] = [];
    const errors: string[] = [];

    Array.from(newFiles).forEach((file, idx) => {
      if (existingCount + validFiles.length >= maxFiles) {
        errors.push(`Max ${maxFiles} files allowed.`);
        return;
      }
      const error = handleFileValidation(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          file,
          progress: 0,
          uploaded: false,
          id: `${file.name}-${Date.now()}-${idx}`,
        });
      }
    });

    if (errors.length > 0) alert(errors.join("\n"));

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    handleAddFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) handleAddFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);
    const uploadPromises = files.map(async (f) => {
      const formData = new FormData();
      formData.append("file", f.file);

      try {
        await axios.post(uploadUrl, formData, {
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
      } catch (err) {
        setFiles((prev) =>
          prev.map((x) =>
            x.id === f.id ? { ...x, error: "Upload failed" } : x
          )
        );
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);

    if (onUploadComplete) {
      onUploadComplete(files.map((f) => f.file));
    }
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const clearAll = () => setFiles([]);

  return (
    <div className="flex flex-col gap-4">
      {/* Drag & Drop Zone */}
      <div
        className={`bg-dark2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-primary-500 bg-primary-500/10"
            : "border-gray-700 hover:border-gray-600"
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
          >
            <Plus size={18} /> Select Files
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !files.length}>
            <Upload size={18} /> Upload
          </Button>
          <Button onClick={clearAll} disabled={uploading || !files.length}>
            <Trash2 size={18} /> Clear All
          </Button>
        </div>
      </div>

      {/* File List */}
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
    <div className="space-y-2 rounded-md bg-gray-800 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon size={40} className="text-primary-500" />
          <div>
            <span className="font-medium">{file.file.name}</span>
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
            <X size={16} className="text-white hover:text-rose-500" />
          </button>
        )}
      </div>
      <div className="text-right text-xs">
        {file.error
          ? `Error: ${file.error}`
          : file.uploaded
          ? "Completed"
          : `${Math.round(file.progress)}%`}
      </div>
      <ProgressBar progress={file.progress} />
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-600">
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
  if (mime === "application/pdf") return FileText;
  return FileIcon;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
