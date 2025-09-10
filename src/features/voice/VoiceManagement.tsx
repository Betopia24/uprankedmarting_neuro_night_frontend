"use client";

import { useRef, useState, ChangeEvent, DragEvent } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  LucideCloudUpload,
  FileAudio,
  X,
  Trash2,
  Upload,
  Plus,
} from "lucide-react";
import Button from "@/components/Button";

type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  error?: string;
};

type UploadProps = {
  uploadUrl?: string;
  accept?: string[];
  maxSize?: number; // MB
  maxFiles?: number;
  payload?: Record<string, string | number>;
  onUploadComplete?: (uploadedFiles: File[]) => void;
};

export default function UploadFile({
  uploadUrl = "/api/upload",
  accept = ["audio/*"],
  maxSize = 100,
  maxFiles = 3,
  payload,
  onUploadComplete,
}: UploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      formData.append("file", f.file);
      if (payload) {
        Object.entries(payload).forEach(([key, val]) =>
          formData.append(key, String(val))
        );
      }

      try {
        await axios.post(uploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
        if (onUploadComplete) onUploadComplete([f.file]);
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
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Upload Audio Files
        </h2>
        <p className="text-slate-500">
          Drag & drop or select files to upload (max {maxFiles})
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : "border-slate-200 hover:border-slate-300"
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
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <LucideCloudUpload
              className={`w-8 h-8 ${
                isDragOver ? "text-blue-500 animate-bounce" : "text-slate-500"
              }`}
            />
          </div>
          <p className="text-slate-700 font-medium">
            {isDragOver ? "Drop files here" : "Drag & drop files"}
          </p>
          <p className="text-xs text-slate-400">
            Supports MP3, WAV, M4A up to {maxSize}MB
          </p>
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <Plus className="w-4 h-4 mr-2" /> Select Files
          </Button>
        </div>
        <input
          type="file"
          ref={inputRef}
          multiple
          accept={accept.join(",")}
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {files.map((f) => (
            <div
              key={f.id}
              className="bg-slate-50 p-4 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <FileAudio className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {Math.round(f.file.size / 1024)} KB
                  </p>
                  {/* Progress */}
                  <div className="h-2 w-40 mt-1 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        f.error
                          ? "bg-red-500"
                          : f.uploaded
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={() => removeFile(f.id)}
                  className="p-1 rounded-full hover:bg-slate-200"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={clearAll}
            disabled={uploading}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !files.length}
            className="bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  );
}
