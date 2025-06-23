"use client"

import { useState } from "react"
import Image from "next/image"
import { getImageUrl } from "@/lib/google-drive-utils"
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

  // Get image URL from photo object or direct src
  const imageUrl = photo ? getImageUrl(photo, useThumbnail) : src || "/placeholder.svg"

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
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        unoptimized
      />
    </div>
  )
}

export { GoogleDriveImageComponent as GoogleDriveImage }
