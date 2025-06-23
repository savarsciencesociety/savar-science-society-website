// Google Drive image utilities
export interface GoogleDriveImage {
  id: number
  fileId: string
  title: string
  description: string
  category: string
  filename: string
}

// Extract file ID from Google Drive share URL
export function extractFileId(shareUrl: string): string {
  // Handle different Google Drive URL formats
  const patterns = [
    /\/file\/d\/([A-Za-z0-9_-]+)/, // Standard share URL
    /id=([A-Za-z0-9_-]+)/, // Direct ID parameter
    /\/d\/([A-Za-z0-9_-]+)/, // Short format
  ]

  for (const pattern of patterns) {
    const match = shareUrl.match(pattern)
    if (match) {
      return match[1]
    }
  }

  // If it's already just a file ID
  if (shareUrl.match(/^[a-zA-Z0-9-_]+$/)) {
    return shareUrl
  }

  return shareUrl
}

// Convert file ID to direct image URL
export function getDirectImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

// Get thumbnail URL for better performance
export function getThumbnailUrl(fileId: string, size = 800): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`
}

// Validate if URL is a valid Google Drive image URL
export function isValidGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com") && (url.includes("/uc?export=view") || url.includes("/thumbnail?"))
}

// Update the OLYMPIAD_PHOTOS array with the correct file IDs in the right order
export const OLYMPIAD_PHOTOS: GoogleDriveImage[] = [
  {
    id: 1,
    fileId: "1iD2HsmCEOwn7E8aEYe6fiSXJkGWqYELs",
    title: "Opening Ceremony",
    description: "Students gathering for the grand opening ceremony of Olympiad 2.0",
    category: "Ceremony",
    filename: "20241102_111608.jpg",
  },
  {
    id: 2,
    fileId: "1OkFOsjTxzHoWLBoa0VQ9iwMJWz0wkXEI",
    title: "Competition Preparation",
    description: "Students preparing and getting ready for the competition",
    category: "Preparation",
    filename: "20241102_114227.jpg",
  },
  {
    id: 3,
    fileId: "1c06qVSdi3MoKIvfpDC-kfgfNoHUfLejR",
    title: "Focused Competition",
    description: "Students deeply focused during the examination period",
    category: "Competition",
    filename: "20241102_114932.jpg",
  },
  {
    id: 4,
    fileId: "1aZrLxs1rcZGgq01-vA46RcTT6tZCnf4Y",
    title: "Problem Solving",
    description: "Students working together on challenging mathematical problems",
    category: "Competition",
    filename: "20241102_124940.jpg",
  },
  {
    id: 5,
    fileId: "1BY7SU7AAd7xhqMWqYQsDb4tAy2CD6VO4",
    title: "Scientific Discovery",
    description: "Hands-on learning and scientific discovery in action",
    category: "Science",
    filename: "20241102_125401.jpg",
  },
  {
    id: 6,
    fileId: "17IDSAX4-dGliEtzaVo90NVozXsJIV2Vr",
    title: "Mathematical Excellence",
    description: "Students solving complex mathematical challenges with enthusiasm",
    category: "Mathematics",
    filename: "20241102_125604.jpg",
  },
  {
    id: 7,
    fileId: "1aLPfwvTxT7JPWOqGGayfQNbrbKx-Kdqv",
    title: "Physics Exploration",
    description: "Exploring the fascinating world of physics and natural phenomena",
    category: "Physics",
    filename: "20241102_125855.jpg",
  },
  {
    id: 8,
    fileId: "18UVjH3FPtXhGhWNAo5ULU4E2yN0GuBa4",
    title: "Collaborative Learning",
    description: "Students building friendships through collaborative learning experiences",
    category: "Activities",
    filename: "20241102_130558.jpg",
  },
  {
    id: 9,
    fileId: "1g8UoZc4qc36KVKvKr4ZtogWwDJXTIfxA",
    title: "Innovation Showcase",
    description: "Students presenting their innovative projects and solutions",
    category: "Innovation",
    filename: "20241102_130641.jpg",
  },
  {
    id: 10,
    fileId: "1mv0GjzyXtwNBTToQ3nmzY8zvop9Siz6t",
    title: "Victory Celebration",
    description: "Celebrating achievements and future aspirations of young scientists",
    category: "Ceremony",
    filename: "20241102_130647(0).jpg",
  },
]

// Update the getImageUrl function to use multiple fallback methods
export function getImageUrl(photo: GoogleDriveImage, useThumbnail = false): string {
  if (useThumbnail) {
    // Try thumbnail first for better performance
    return `https://lh3.googleusercontent.com/d/${photo.fileId}=w800-h600-rw`
  } else {
    // Use direct download URL for full resolution
    return `https://drive.google.com/uc?export=download&id=${photo.fileId}`
  }
}

// Alternative URL formats for better compatibility
export function getAlternativeImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1200-h800-rw`
}

// Convert Google Drive share links to direct image URLs (for backward compatibility)
export function convertGoogleDriveUrl(shareUrl: string): string {
  const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (fileIdMatch) {
    const fileId = fileIdMatch[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  return shareUrl
}
