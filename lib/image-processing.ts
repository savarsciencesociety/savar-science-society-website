/**
 * Browser-compatible image processing utilities
 * This replaces the sharp library which doesn't work in edge runtime
 */

/**
 * Processes an image to ensure it meets required dimensions and formats
 * @param file The image file to process
 * @param targetWidth Target width for the image
 * @param targetHeight Target height for the image
 * @returns A Blob containing the processed image data
 */
export async function processImage(
  file: File,
  targetWidth = 600,
  targetHeight = 600,
): Promise<{ buffer: Buffer; contentType: string }> {
  try {
    // Create a canvas element for image processing
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Could not get canvas context")
    }

    // Create an image element to load the file
    const img = new Image()
    img.crossOrigin = "anonymous"

    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = targetWidth
          canvas.height = targetHeight

          // Calculate scaling to maintain aspect ratio while filling the canvas
          const scale = Math.max(targetWidth / img.width, targetHeight / img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale

          // Center the image
          const x = (targetWidth - scaledWidth) / 2
          const y = (targetHeight - scaledHeight) / 2

          // Fill with white background
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, targetWidth, targetHeight)

          // Draw the image
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

          // Convert canvas to blob
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                reject(new Error("Failed to create blob from canvas"))
                return
              }

              try {
                // Convert blob to buffer
                const arrayBuffer = await blob.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                resolve({
                  buffer,
                  contentType: "image/jpeg",
                })
              } catch (error) {
                reject(error)
              }
            },
            "image/jpeg",
            0.85, // Quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      // Load the image
      img.src = URL.createObjectURL(file)
    })
  } catch (error) {
    console.error("Error processing image:", error)
    throw error
  }
}

/**
 * Server-side image processing fallback
 * This is a simplified version that just converts the file to buffer
 */
export async function processImageServer(
  file: File,
  targetWidth = 600,
  targetHeight = 600,
): Promise<{ buffer: Buffer; contentType: string }> {
  try {
    // Convert File to Buffer without processing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return {
      buffer,
      contentType: file.type || "image/jpeg",
    }
  } catch (error) {
    console.error("Error processing image on server:", error)
    throw error
  }
}
