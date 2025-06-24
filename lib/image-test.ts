// Utility to test if Google Drive images are accessible
export async function testGoogleDriveImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error("Error testing Google Drive image:", error)
    return false
  }
}

// Function to get alternative image URLs if primary fails
export function getAlternativeImageUrls(fileId: string): string[] {
  return [
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
  ]
}
