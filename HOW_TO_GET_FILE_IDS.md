# How to Get Google Drive File IDs

To display your Olympiad photos, you need to get the individual file IDs for each image:

## Step 1: Get Individual File IDs

1. Go to your Google Drive folder: https://drive.google.com/drive/folders/1tWYhOWisWYkEalHWlepeosbAnKOm_ZPj
2. For each image file (20241102_111608.jpg, 20241102_114227.jpg, etc.):
   - Right-click on the image
   - Select "Get link" or "Share"
   - Copy the share link
   - Extract the file ID from the URL

## Step 2: Extract File IDs

From a Google Drive share URL like:
`https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing`

The file ID is: `1ABC123xyz456`

## Step 3: Update the Code

Replace the placeholder file IDs in `lib/google-drive-utils.ts`:

\`\`\`typescript
export const OLYMPIAD_PHOTOS: GoogleDriveImage[] = [
  {
    id: 1,
    fileId: "YOUR_ACTUAL_FILE_ID_FOR_20241102_111608", // Replace this
    title: "Photo 1",
    description: "Opening ceremony - Students gathering for the event",
    category: "Ceremony",
    filename: "20241102_111608.jpg"
  },
  // ... repeat for all 10 images
]
\`\`\`

## File Mapping

Based on your Google Drive folder, update these file IDs:

1. `20241102_111608.jpg` → Photo 1
2. `20241102_114227.jpg` → Photo 2  
3. `20241102_114932.jpg` → Photo 3
4. `20241102_124940.jpg` → Photo 4
5. `20241102_125401.jpg` → Photo 5
6. `20241102_125604.jpg` → Photo 6
7. `20241102_125855.jpg` → Photo 7
8. `20241102_130558.jpg` → Photo 8
9. `20241102_130641.jpg` → Photo 9
10. `20241102_130647(0).jpg` → Photo 10

## Step 4: Make Images Public

Ensure each image is set to "Anyone with the link can view" for public access.

Once you provide the actual file IDs, the images will display perfectly on your website!
