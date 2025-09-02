"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AudioFile } from "./types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LucideUpload, LucideTrash2 } from "lucide-react";

export default function FileUploader() {
  const [files, setFiles] = useState<AudioFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      src: URL.createObjectURL(file),
      createdAt: new Date(),
    }));
    setFiles((prev) => [...prev, ...mapped]);
    toast.success("Files added");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.info("File removed");
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg">
      <CardHeader>
        <h2 className="text-lg font-semibold">Upload Audio</h2>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition 
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <input {...getInputProps()} />
          <LucideUpload className="mx-auto h-10 w-10 text-gray-500" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop files here"
              : "Drag & drop or click to select"}
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-sm truncate">{file.name}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFile(file.id)}
              >
                <LucideTrash2 className="h-4 w-4 text-red-500" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
