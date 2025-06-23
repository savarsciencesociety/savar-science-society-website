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
    /\/file\/d\/([a-zA-Z0-9-_]+)/, // Standard share URL
    /id=([a-zA-Z0-9-_]+)/, // Direct ID parameter
    /\/d\/([a-zA-Z0-9-_]+)/, // Short format
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

// PLACEHOLDER FILE IDs - Replace these with actual file IDs from your Google Drive
// To get file IDs: Right-click each image → Get link → Copy the ID from the URL
export const OLYMPIAD_PHOTOS: GoogleDriveImage[] = [
  {
    id: 1,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_1", // 20241102_111608.jpg
    title: "Photo 1",
    description: "Opening ceremony - Students gathering for the event",
    category: "Ceremony",
    filename: "20241102_111608.jpg",
  },
  {
    id: 2,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_2", // 20241102_114227.jpg
    title: "Photo 2",
    description: "Competition preparation and setup",
    category: "Preparation",
    filename: "20241102_114227.jpg",
  },
  {
    id: 3,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_3", // 20241102_114932.jpg
    title: "Photo 3",
    description: "Students focused during the examination",
    category: "Competition",
    filename: "20241102_114932.jpg",
  },
  {
    id: 4,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_4", // 20241102_124940.jpg
    title: "Photo 4",
    description: "Mid-competition activities and monitoring",
    category: "Competition",
    filename: "20241102_124940.jpg",
  },
  {
    id: 5,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_5", // 20241102_125401.jpg
    title: "Photo 5",
    description: "Students working on challenging problems",
    category: "Competition",
    filename: "20241102_125401.jpg",
  },
  {
    id: 6,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_6", // 20241102_125604.jpg
    title: "Photo 6",
    description: "Collaborative problem solving session",
    category: "Activities",
    filename: "20241102_125604.jpg",
  },
  {
    id: 7,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_7", // 20241102_125855.jpg
    title: "Photo 7",
    description: "Hands-on learning and discovery",
    category: "Activities",
    filename: "20241102_125855.jpg",
  },
  {
    id: 8,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_8", // 20241102_130558.jpg
    title: "Photo 8",
    description: "Students presenting their solutions",
    category: "Presentation",
    filename: "20241102_130558.jpg",
  },
  {
    id: 9,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_9", // 20241102_130641.jpg
    title: "Photo 9",
    description: "Award ceremony and recognition",
    category: "Awards",
    filename: "20241102_130641.jpg",
  },
  {
    id: 10,
    fileId: "REPLACE_WITH_ACTUAL_FILE_ID_10", // 20241102_130647(0).jpg
    title: "Photo 10",
    description: "Celebrating achievements and future aspirations",
    category: "Ceremony",
    filename: "20241102_130647(0).jpg",
  },
]

// Helper function to get image URL with fallback
export function getImageUrl(photo: GoogleDriveImage, useThumbnail = false): string {
  if (photo.fileId.startsWith("REPLACE_WITH_ACTUAL")) {
    // Return placeholder if file ID not set
    return `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(photo.title)}`
  }

  return useThumbnail ? getThumbnailUrl(photo.fileId) : getDirectImageUrl(photo.fileId)
}
