"use client";

import { useRef, useState, ChangeEvent, DragEvent, useEffect } from "react";
import {
  LucideCloudUpload,
  FileAudio,
  X,
  Trash2,
  Upload,
  Plus,
  Mic,
  Play,
  Pause,
  Square,
  Edit3,
  Check,
} from "lucide-react";
import { toast } from "sonner";

type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  error?: string;
  isRecording?: boolean;
  audioUrl?: string;
  duration?: number;
  displayName: string;
  description?: string;
  isEditingName?: boolean;
  isEditingDescription?: boolean;
};

type AudioUploadProps = {
  uploadUrl?: string;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  payload?: Record<string, string | number>;
  onUploadComplete?: (
    uploadedFiles: Array<{ file: File; name: string; description?: string }>
  ) => void;
  organizationId: string;
  showDescription?: boolean;
};

export default function AudioUploadRecorder({
  uploadUrl = "/api/upload",
  accept = ["audio/*"],
  maxSize = 100,
  maxFiles = 1,
  payload,
  organizationId,
  onUploadComplete,
  showDescription = true,
}: AudioUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      // Cleanup audio URLs
      files.forEach((f) => {
        if (f.audioUrl) {
          URL.revokeObjectURL(f.audioUrl);
        }
      });
    };
  }, []);

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
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
      } else {
        const audioUrl = URL.createObjectURL(file);
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        validFiles.push({
          file,
          progress: 0,
          uploaded: false,
          id: `${file.name}-${Date.now()}-${idx}`,
          audioUrl,
          displayName: nameWithoutExtension,
          description: "",
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const timestamp = Date.now();
        const audioFile = new File([audioBlob], `recording-${timestamp}.wav`, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newFile: FileWithProgress = {
          id: `recording-${timestamp}`,
          file: audioFile,
          progress: 0,
          uploaded: false,
          isRecording: true,
          audioUrl,
          displayName: `Voice Recording ${new Date().toLocaleTimeString()}`,
          description: "",
        };

        setFiles((prev) => [...prev, newFile]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error(
        "Failed to start recording. Please check microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const togglePlayPause = (fileId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    let audio = audioRefs.current.get(fileId);

    if (!audio) {
      audio = new Audio(audioUrl);
      audioRefs.current.set(fileId, audio);

      audio.onended = () => {
        setPlayingId(null);
      };
    }

    if (playingId === fileId) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause any currently playing audio
      audioRefs.current.forEach((a, id) => {
        if (id !== fileId) a.pause();
      });

      audio.currentTime = 0;
      audio.play();
      setPlayingId(fileId);
    }
  };

  const updateFileName = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, displayName: newName, isEditingName: false } : f
      )
    );
  };

  const updateFileDescription = (id: string, newDescription: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, description: newDescription, isEditingDescription: false }
          : f
      )
    );
  };

  const toggleEditName = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isEditingName: !f.isEditingName } : f
      )
    );
  };

  const toggleEditDescription = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, isEditingDescription: !f.isEditingDescription }
          : f
      )
    );
  };

  const handleUpload = async () => {
    if (!files.length || uploading) return;
    setUploading(true);

    // Reset progress for files that previously failed
    setFiles((prev) =>
      prev.map((f) => (f.error ? { ...f, progress: 0, error: undefined } : f))
    );

    const uploadPromises = files
      .filter((f) => !f.uploaded && !f.error)
      .map(async (f) => {
        const formData = new FormData();

        // Create a new file with the updated name
        const fileExtension = f.file.name.split(".").pop();
        const newFileName =
          f.displayName + (fileExtension ? `.${fileExtension}` : "");
        const renamedFile = new File([f.file], newFileName, {
          type: f.file.type,
        });

        formData.append("file", renamedFile);
        formData.append("name", f.displayName);

        if (f.description) {
          formData.append("description", f.description);
        }

        // Add additional payload data if provided
        if (payload) {
          Object.entries(payload).forEach(([key, val]) =>
            formData.append(key, String(val))
          );
        }

        try {
          // Update progress to show upload starting
          setFiles((prev) =>
            prev.map((x) => (x.id === f.id ? { ...x, progress: 10 } : x))
          );

          const response = await fetch(
            `${uploadUrl}/${organizationId}/voice-clone`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const responseData = await response.json();

          // Mark file as uploaded successfully
          setFiles((prev) =>
            prev.map((x) =>
              x.id === f.id ? { ...x, uploaded: true, progress: 100 } : x
            )
          );

          toast.success(`${f.displayName} uploaded successfully`);

          // Call success callback with uploaded file and metadata
          if (onUploadComplete) {
            onUploadComplete([
              {
                file: renamedFile,
                name: f.displayName,
                description: f.description,
              },
            ]);
          }

          return { success: true, file: f, response: responseData };
        } catch (error) {
          // Handle upload error
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";

          setFiles((prev) =>
            prev.map((x) =>
              x.id === f.id ? { ...x, error: errorMessage, progress: 0 } : x
            )
          );

          toast.error(`${f.displayName} upload failed: ${errorMessage}`);
          return { success: false, file: f, error: errorMessage };
        }
      });

    try {
      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // Log summary of results
      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failed = results.length - successful;

      if (successful > 0) {
        toast.success(`Successfully uploaded ${successful} file(s)`);
      }
      if (failed > 0) {
        toast.error(`Failed to upload ${failed} file(s)`);
      }
    } catch (error) {
      console.error("Upload process failed:", error);
      toast.error("Upload process failed");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file?.audioUrl) {
      URL.revokeObjectURL(file.audioUrl);
    }
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.pause();
      audioRefs.current.delete(id);
    }
    if (playingId === id) {
      setPlayingId(null);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success("File removed");
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.audioUrl) {
        URL.revokeObjectURL(f.audioUrl);
      }
    });
    audioRefs.current.clear();
    setPlayingId(null);
    setFiles([]);
    toast.success("All files cleared");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Audio Upload & Recording Studio
        </h2>
        <p className="text-slate-500 text-sm">
          Record audio or drag & drop / select files to upload (max{" "}
          <strong>{maxFiles}</strong>
          ). Minimum <strong>5</strong> seconds required.
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col justify-center items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-200"
                  disabled={uploading}
                >
                  <Mic className="size-12" />
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-blue-600 text-white p-4 rounded-full animate-pulse shadow-lg shadow-blue-300"
                >
                  <Square className="size-12" />
                </button>
              )}
              <div className="text-lg font-semibold text-slate-700 ">
                {isRecording ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 bg-blue-500 rounded-full animate-pulse"></div>
                    Recording: {formatTime(recordingTime)}
                  </span>
                ) : (
                  "Click to start recording"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-blue-500 bg-blue-50 scale-[1.01] shadow-lg"
            : "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
            <LucideCloudUpload
              className={`w-10 h-10 ${
                isDragOver ? "text-blue-500 animate-bounce" : "text-blue-400"
              }`}
            />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-700">
              {isDragOver ? "Drop files here!" : "Drag & drop audio files"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Supports MP3, WAV, M4A, AAC up to {maxSize}MB each
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Select Files
            </button>
          </div>
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
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">
              Files ({files.length}/{maxFiles})
            </h3>
          </div>
          <div className="space-y-4">
            {files.map((f) => (
              <div
                key={f.id}
                className="bg-slate-50 hover:bg-slate-100 p-6 rounded-xl shadow-sm border border-blue-100 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <FileAudio className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      {/* File Name Field */}
                      <div className="flex items-center gap-2 mb-2">
                        {f.isEditingName ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={f.displayName}
                              onChange={(e) =>
                                setFiles((prev) =>
                                  prev.map((file) =>
                                    file.id === f.id
                                      ? { ...file, displayName: e.target.value }
                                      : file
                                  )
                                )
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  updateFileName(f.id, f.displayName);
                                }
                              }}
                              className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() =>
                                updateFileName(f.id, f.displayName)
                              }
                              className="p-1 rounded text-green-600 hover:bg-green-100"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="font-semibold text-slate-800 text-lg">
                              {f.displayName}
                            </span>
                            <button
                              onClick={() => toggleEditName(f.id)}
                              className="p-1 rounded text-slate-500 hover:bg-slate-200"
                              disabled={uploading}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {f.isRecording && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            Recorded
                          </span>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <span>{formatFileSize(f.file.size)}</span>
                        <span>•</span>
                        <span>{f.file.type || "Audio file"}</span>
                        <span>•</span>
                        <span className="text-xs text-slate-400">
                          Original: {f.file.name}
                        </span>
                      </div>

                      {/* Description Field */}
                      {showDescription && (
                        <div className="mb-3">
                          {f.isEditingDescription ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                value={f.description || ""}
                                onChange={(e) =>
                                  setFiles((prev) =>
                                    prev.map((file) =>
                                      file.id === f.id
                                        ? {
                                            ...file,
                                            description: e.target.value,
                                          }
                                        : file
                                    )
                                  )
                                }
                                placeholder="Add a description for this audio file..."
                                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={2}
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  updateFileDescription(
                                    f.id,
                                    f.description || ""
                                  )
                                }
                                className="p-1 rounded text-green-600 hover:bg-green-100 mt-1"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="flex items-start gap-2 cursor-pointer group"
                              onClick={() => toggleEditDescription(f.id)}
                            >
                              <div className="flex-1">
                                {f.description ? (
                                  <p className="text-sm text-slate-600 bg-slate-100 p-2 rounded-lg group-hover:bg-slate-200 transition-colors">
                                    {f.description}
                                  </p>
                                ) : (
                                  <p className="text-sm text-slate-400 italic bg-slate-100 p-2 rounded-lg group-hover:bg-slate-200 transition-colors">
                                    Click to add description...
                                  </p>
                                )}
                              </div>
                              <button
                                className="p-1 rounded text-slate-500 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={uploading}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {f.audioUrl && (
                      <button
                        onClick={() => togglePlayPause(f.id, f.audioUrl)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                        disabled={uploading}
                      >
                        {playingId === f.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    {!uploading && (
                      <button
                        onClick={() => removeFile(f.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
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
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-500">
                      {f.error
                        ? f.error
                        : f.uploaded
                        ? "Upload complete"
                        : uploading
                        ? "Uploading..."
                        : "Ready to upload"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {f.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={clearAll}
            disabled={uploading}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" /> Clear All
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !files.some((f) => !f.uploaded && !f.error)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            {uploading
              ? "Uploading..."
              : `Upload ${
                  files.filter((f) => !f.uploaded && !f.error).length
                } Files`}
          </button>
        </div>
      )}
    </>
  );
}
