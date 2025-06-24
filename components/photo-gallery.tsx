"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Globe, ExternalLink, ChevronLeft, ChevronRight, Share2, Heart, Eye } from "lucide-react"

interface Photo {
  id: number
  url: string
  title: string
  description: string
  googlePhotosUrl: string
  category?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  albumUrl: string
  title?: string
  description?: string
}

export function PhotoGallery({
  photos,
  albumUrl,
  title = "Photo Gallery",
  description = "Explore our collection of memorable moments",
}: PhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto-rotate photos
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [photos.length, isAutoPlay])

  const filteredPhotos = selectedCategory ? photos.filter((photo) => photo.category === selectedCategory) : photos

  const categories = [...new Set(photos.map((photo) => photo.category).filter(Boolean))]

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">{description}</p>

        {/* Google Photos Album Link */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white shadow-2xl max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8" />
            <h3 className="text-xl font-bold">Complete Photo Collection</h3>
          </div>
          <p className="text-emerald-100 mb-4">
            View all high-resolution photos from Olympiad 2.0 in our Google Photos album
          </p>
          <Button
            asChild
            className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href={albumUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              Open Full Album
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All Photos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Featured Photo Carousel */}
      <div className="relative mb-12 max-w-4xl mx-auto">
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
          <Image
            src={photos[currentPhotoIndex]?.url || "/placeholder.svg?height=500&width=800"}
            alt={photos[currentPhotoIndex]?.title || "Olympiad Photo"}
            fill
            className="object-cover transition-all duration-1000"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Photo Info */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{photos[currentPhotoIndex]?.title}</h3>
                <p className="text-lg opacity-90">{photos[currentPhotoIndex]?.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="text-white hover:bg-white/20"
                >
                  {isAutoPlay ? "Pause" : "Play"}
                </Button>
              </div>
            </div>
          </div>

          {/* Photo Counter */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Photo Navigation Dots */}
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentPhotoIndex
                  ? "bg-emerald-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-emerald-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo, index) => (
          <Dialog key={photo.id}>
            <DialogTrigger asChild>
              <div className="relative group cursor-pointer">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium truncate">{photo.title}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  {photo.category && (
                    <Badge className="absolute top-2 left-2 bg-emerald-500 text-white text-xs">{photo.category}</Badge>
                  )}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>{photo.title}</DialogTitle>
                <DialogDescription>{photo.description}</DialogDescription>
              </DialogHeader>
              <div className="relative h-[60vh] rounded-lg overflow-hidden">
                <Image src={photo.url || "/placeholder.svg"} alt={photo.title} fill className="object-contain" />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button asChild>
                  <Link href={photo.googlePhotosUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Album
                  </Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Load More / View Album */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Want to see more photos?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Visit our complete Google Photos album to see all the high-resolution images from Olympiad 2.0
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href={albumUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                View Complete Album
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
