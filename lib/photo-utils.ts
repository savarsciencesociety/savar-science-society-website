// Convert Google Drive share links to direct image URLs
export function convertGoogleDriveUrl(shareUrl: string): string {
  const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (fileIdMatch) {
    const fileId = fileIdMatch[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  return shareUrl
}

export const OLYMPIAD_PHOTOS = [
  {
    id: 1,
    url: "https://drive.google.com/uc?export=view&id=1iD2HsmCEOwn7E8aEYe6fiSXJkGWqYELs",
    title: "Olympiad 2.0 - Opening Ceremony",
    description: "Students gathering for the grand opening",
    category: "Ceremony",
  },
  {
    id: 2,
    url: "https://drive.google.com/uc?export=view&id=1OkFOsjTxzHoWLBoa0VQ9iwMJWz0wkXEI",
    title: "Competition in Progress",
    description: "Students focused during the examination",
    category: "Competition",
  },
  {
    id: 3,
    url: "https://drive.google.com/uc?export=view&id=1c06qVSdi3MoKIvfpDC-kfgfNoHUfLejR",
    title: "Award Ceremony",
    description: "Celebrating our brilliant winners",
    category: "Awards",
  },
  {
    id: 4,
    url: "https://drive.google.com/uc?export=view&id=1aZrLxs1rcZGgq01-vA46RcTT6tZCnf4Y",
    title: "Team Collaboration",
    description: "Students working together on challenging problems",
    category: "Activities",
  },
  {
    id: 5,
    url: "https://drive.google.com/uc?export=view&id=1BY7SU7AAd7xhqMWqYQsDb4tAy2CD6VO4",
    title: "Science Experiments",
    description: "Hands-on learning and discovery",
    category: "Science",
  },
  {
    id: 6,
    url: "https://drive.google.com/uc?export=view&id=17IDSAX4-dGliEtzaVo90NVozXsJIV2Vr",
    title: "Mathematical Excellence",
    description: "Solving complex mathematical challenges",
    category: "Mathematics",
  },
  {
    id: 7,
    url: "https://drive.google.com/uc?export=view&id=1aLPfwvTxT7JPWOqGGayfQNbrbKx-Kdqv",
    title: "Physics Demonstrations",
    description: "Exploring the wonders of physics",
    category: "Physics",
  },
  {
    id: 8,
    url: "https://drive.google.com/uc?export=view&id=1g8UoZc4qc36KVKvKr4ZtogWwDJXTIfxA",
    title: "Group Activities",
    description: "Building friendships through learning",
    category: "Activities",
  },
  {
    id: 9,
    url: "https://drive.google.com/uc?export=view&id=18UVjH3FPtXhGhWNAo5ULU4E2yN0GuBa4",
    title: "Innovation Showcase",
    description: "Students presenting their innovative projects",
    category: "Innovation",
  },
  {
    id: 10,
    url: "https://drive.google.com/uc?export=view&id=1mv0GjzyXtwNBTToQ3nmzY8zvop9Siz6t",
    title: "Closing Ceremony",
    description: "Celebrating achievements and future aspirations",
    category: "Ceremony",
  },
]
