"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"
import { toast } from "sonner"

// interface ImageUploadProps {
//   currentImage?: string
//   onImageChange: (file: File | null) => void
//   className?: string
// }

interface ImageUploadProps {
  currentImage?: string | null | undefined;
  onImageChange: (file: File | null) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageChange, className = "" }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onImageChange(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayImage = preview || currentImage || "/images/default-avatar.png"

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
          <Image
            src={displayImage || "/placeholder.svg"}
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay with camera icon */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={triggerFileInput}
        >
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          className="flex items-center gap-2 bg-transparent"
        >
          <Camera className="w-4 h-4" />
          Change Photo
        </Button>

        {(preview || currentImage) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}

export default ImageUpload
