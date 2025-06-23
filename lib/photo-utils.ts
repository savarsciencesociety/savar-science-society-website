// Google Drive photo data with properly formatted direct URLs
export const OLYMPIAD_PHOTOS = [
  {
    id: 1,
    url: "https://drive.google.com/uc?export=view&id=1iD2HsmCEOwn7E8aEYe6fiSXJkGWqYELs",
    title: "Photo 1",
    description: "Students gathering for the grand opening ceremony",
    category: "Ceremony",
  },
  {
    id: 2,
    url: "https://drive.google.com/uc?export=view&id=1OkFOsjTxzHoWLBoa0VQ9iwMJWz0wkXEI",
    title: "Photo 2",
    description: "Students focused during the examination",
    category: "Competition",
  },
  {
    id: 3,
    url: "https://drive.google.com/uc?export=view&id=1c06qVSdi3MoKIvfpDC-kfgfNoHUfLejR",
    title: "Photo 3",
    description: "Celebrating our brilliant winners",
    category: "Awards",
  },
  {
    id: 4,
    url: "https://drive.google.com/uc?export=view&id=1aZrLxs1rcZGgq01-vA46RcTT6tZCnf4Y",
    title: "Photo 4",
    description: "Students working together on challenging problems",
    category: "Activities",
  },
  {
    id: 5,
    url: "https://drive.google.com/uc?export=view&id=1BY7SU7AAd7xhqMWqYQsDb4tAy2CD6VO4",
    title: "Photo 5",
    description: "Hands-on learning and discovery",
    category: "Science",
  },
  {
    id: 6,
    url: "https://drive.google.com/uc?export=view&id=17IDSAX4-dGliEtzaVo90NVozXsJIV2Vr",
    title: "Photo 6",
    description: "Solving complex mathematical challenges",
    category: "Mathematics",
  },
  {
    id: 7,
    url: "https://drive.google.com/uc?export=view&id=1aLPfwvTxT7JPWOqGGayfQNbrbKx-Kdqv",
    title: "Photo 7",
    description: "Exploring the wonders of physics",
    category: "Physics",
  },
  {
    id: 8,
    url: "https://drive.google.com/uc?export=view&id=1g8UoZc4qc36KVKvKr4ZtogWwDJXTIfxA",
    title: "Photo 8",
    description: "Building friendships through learning",
    category: "Activities",
  },
  {
    id: 9,
    url: "https://drive.google.com/uc?export=view&id=18UVjH3FPtXhGhWNAo5ULU4E2yN0GuBa4",
    title: "Photo 9",
    description: "Students presenting their innovative projects",
    category: "Innovation",
  },
  {
    id: 10,
    url: "https://drive.google.com/uc?export=view&id=1mv0GjzyXtwNBTToQ3nmzY8zvop9Siz6t",
    title: "Photo 10",
    description: "Celebrating achievements and future aspirations",
    category: "Ceremony",
  },
]

// Convert Google Drive share links to direct image URLs
export function convertGoogleDriveUrl(shareUrl: string): string {
  const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (fileIdMatch) {
    const fileId = fileIdMatch[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  return shareUrl
}

// Alternative function to get thumbnail URLs for better performance
export function getGoogleDriveThumbnail(fileId: string, size = 800): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`
}

// Function to validate Google Drive URLs
export function isValidGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com") && (url.includes("/uc?") || url.includes("/thumbnail?"))
}
