"use client"

import { useState } from "react"
import Image from "next/image"
import type { GoogleDriveImage } from "@/lib/google-drive-utils"

interface GoogleDriveImageProps {
  photo?: GoogleDriveImage
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  useThumbnail?: boolean
}

// Update the component to try multiple URL formats
export function GoogleDriveImageComponent({
  photo,
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  sizes,
  useThumbnail = false,
}: GoogleDriveImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)

  // Multiple URL formats to try
  const getImageUrls = (photo: GoogleDriveImage) => [
    `https://lh3.googleusercontent.com/d/${photo.fileId}=w800-h600-rw`, // Google's image serving
    `https://drive.google.com/uc?export=view&id=${photo.fileId}`, // Direct view
    `https://drive.google.com/uc?export=download&id=${photo.fileId}`, // Direct download
    `https://drive.google.com/thumbnail?id=${photo.fileId}&sz=w800`, // Thumbnail API
  ]

  const imageUrls = photo ? getImageUrls(photo) : [src || "/placeholder.svg"]
  const currentImageUrl = imageUrls[currentUrlIndex] || "/placeholder.svg"

  const handleImageError = () => {
    if (currentUrlIndex < imageUrls.length - 1) {
      // Try next URL format
      setCurrentUrlIndex((prev) => prev + 1)
      setImageError(false)
    } else {
      // All URLs failed
      setImageError(true)
      setIsLoading(false)
    }
  }

  if (imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center p-4">
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            {photo ? `${photo.title} - Image not available` : "Image not available"}
          </div>
          {photo && <div className="text-xs text-slate-400 mt-1">File: {photo.filename}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse flex items-center justify-center z-10"
          style={fill ? {} : { width, height }}
        >
          <div className="text-slate-500 dark:text-slate-400 text-sm">Loading {photo ? photo.title : "image"}...</div>
        </div>
      )}
      <Image
        src={currentImageUrl || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        unoptimized
      />
    </div>
  )
}

export { GoogleDriveImageComponent as GoogleDriveImage }
