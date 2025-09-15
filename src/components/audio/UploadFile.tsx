"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, X, FileAudio } from "lucide-react";
import Button from "@/components/Button";

export default function UploadFile() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No files selected");
      return;
    }

    // TODO: Replace with real API upload logic
    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Files uploaded successfully");
    setFiles([]);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Upload Audio</h2>
        <p className="text-slate-500">Select and upload audio files</p>
      </div>

      {/* File Input */}
      <div className="flex flex-col items-center gap-4">
        <label className="flex flex-col items-center justify-center w-full max-w-md p-6 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-400 transition">
          <Upload className="w-8 h-8 text-slate-500 mb-2" />
          <span className="text-slate-600">Click to select files</span>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* File List */}
        {files.length > 0 && (
          <div className="w-full max-w-md space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-50 rounded-xl p-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-700 text-sm truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-full hover:bg-slate-200 transition"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="mt-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition"
        >
          Upload Files
        </Button>
      </div>
    </div>
  );
}
