"use client"

import { useState } from "react"
import Image from "next/image"

interface GoogleDriveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function GoogleDriveImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  sizes,
}: GoogleDriveImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Extract file ID from Google Drive URL and create proper direct link
  const getDirectImageUrl = (url: string) => {
    if (url.includes("/uc?export=view&id=")) {
      return url // Already in correct format
    }

    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (fileIdMatch) {
      const fileId = fileIdMatch[1]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    return url
  }

  const imageUrl = getDirectImageUrl(src)

  if (imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center p-4">
          <div className="text-slate-500 dark:text-slate-400 text-sm">Image not available</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse flex items-center justify-center"
          style={fill ? {} : { width, height }}
        >
          <div className="text-slate-500 dark:text-slate-400 text-sm">Loading...</div>
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
        unoptimized // Important for external images
      />
    </div>
  )
}
