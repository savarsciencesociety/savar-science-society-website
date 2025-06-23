// This file now redirects to the new Google Drive utilities
// All photo functionality has been moved to google-drive-utils.ts

export {
  OLYMPIAD_PHOTOS,
  getImageUrl,
  extractFileId,
  getDirectImageUrl,
  getThumbnailUrl,
  isValidGoogleDriveUrl,
  convertGoogleDriveUrl,
} from "./google-drive-utils"

// Legacy support - these were the old placeholder photos
// Now replaced with real Google Drive photos
export const LEGACY_PHOTOS = [
  {
    id: 1,
    url: "https://drive.google.com/uc?export=view&id=1iD2HsmCEOwn7E8aEYe6fiSXJkGWqYELs",
    title: "Photo 1",
    description: "Students gathering for the grand opening ceremony",
    category: "Ceremony",
  },
  // ... other legacy entries if needed
]
