"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES, SOCIAL_LINKS } from "@/lib/image-paths"
import { getAdmitCardSetting } from "@/lib/actions"
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  BookOpen,
  Star,
  ArrowRight,
  Phone,
  Mail,
  ChevronDown,
  Play,
  Award,
  Target,
  Zap,
  Globe,
} from "lucide-react"

// Olympiad photos from Google Photos
const OLYMPIAD_PHOTOS = [
  {
    id: 1,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipP_GYia3Ja80MRQ3Ina_Jm-cDqW0jRtW2YL5QXz?key=TDNaTHRyeEZOaXlKRXltSTZkMEpFdWZ0bG9ReGlR",
    title: "Olympiad 2.0 - Opening Ceremony",
    description: "Students gathering for the grand opening",
  },
  {
    id: 2,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipN7tlki5NP9CoCA7ZRXHyTi2H6BliXI2RPUaduP?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Competition in Progress",
    description: "Students focused during the examination",
  },
  {
    id: 3,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipNOgCkl1c4y67yzWsV_tOiofugog5o85hmDw4Np?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Award Ceremony",
    description: "Celebrating our brilliant winners",
  },
  {
    id: 4,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipOcLxLH0KYtCs0x0JVb2CHNpM0yDOmooAjLkj6l?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Team Collaboration",
    description: "Students working together on challenging problems",
  },
  {
    id: 5,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipPpxPqgMsWcR6saqMdCtxc0VBf0CzYvTUcWXHIr?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Science Experiments",
    description: "Hands-on learning and discovery",
  },
  {
    id: 6,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipM4_-OmsAc6I3vtJG4YD8iqCafGB3ju-gWnoCug?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Mathematical Excellence",
    description: "Solving complex mathematical challenges",
  },
  {
    id: 7,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipOxz3zXBsamAIrF4w7xnSrXNcK_0XpQLn7YQOXz?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Physics Demonstrations",
    description: "Exploring the wonders of physics",
  },
  {
    id: 8,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipN6ObLH10JkKahxSdEtESkOug0AKREkFfC9Z-kA?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Group Activities",
    description: "Building friendships through learning",
  },
  {
    id: 9,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipPVQk7iyezGZueOevgzXNYt1eYI61WON5RwQ_jx?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Innovation Showcase",
    description: "Students presenting their innovative projects",
  },
  {
    id: 10,
    url: "https://photos.google.com/share/AF1QipM68DYQtV3S1U8gsITWexXbtAMGlcIQigAingxaGRm9BZb-PiBYwO4dHLsM4nGDqQ/photo/AF1QipPulG6xpno2XJmf3EeWlplu-aeitd-UBI6_FMwx?key=TDNaTHRyeEZOaXlKRXltSTZkMEpGdWZ0bG9ReGlR",
    title: "Closing Ceremony",
    description: "Celebrating achievements and future aspirations",
  },
]

export default function HomePage() {
  const [admitCardEnabled, setAdmitCardEnabled] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const checkAdmitCard = async () => {
      const result = await getAdmitCardSetting()
      if (result.success) {
        setAdmitCardEnabled(result.enabled)
      }
    }

    checkAdmitCard()
    setIsVisible(true)

    // Handle scroll for parallax effects
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    // Auto-rotate photos
    const photoInterval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % OLYMPIAD_PHOTOS.length)
    }, 4000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(photoInterval)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <Image
                  src={IMAGES.LOGO || "/placeholder.svg"}
                  alt="Savar Science Society Logo"
                  width={50}
                  height={50}
                  className="rounded-full shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Savar Science Society
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Inspiring Future Scientists</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-60"></div>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 text-sm font-medium animate-bounce">
              🎉 Registration Open for Olympiad 3.0
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Math & Science
              <br />
              <span className="relative">
                Olympiad 3.0
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transform scale-x-0 animate-scale-x"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of brilliant minds in Bangladesh's most prestigious
              <span className="font-semibold text-emerald-600 dark:text-emerald-400"> Math & Science Competition</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/register">
                  <Zap className="mr-2 h-5 w-5" />
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {admitCardEnabled && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/admit-card">
                    <Award className="mr-2 h-5 w-5" />
                    Download Admit Card
                  </Link>
                </Button>
              )}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Users, label: "Participants", value: "10,000+" },
                { icon: Trophy, label: "Prizes", value: "₹5 Lakh+" },
                { icon: BookOpen, label: "Subjects", value: "3" },
                { icon: Star, label: "Years", value: "3rd" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <stat.icon className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection("about")}
              className="text-emerald-500 hover:text-emerald-600 transition-colors duration-300"
            >
              <ChevronDown className="h-8 w-8" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              About Our Olympiad
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering the next generation of scientists, mathematicians, and innovators through challenging
              competitions and collaborative learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To identify and nurture young talents in mathematics and science, providing them with platforms to excel and grow.",
              },
              {
                icon: Globe,
                title: "Our Vision",
                description:
                  "Creating a community of brilliant minds who will lead Bangladesh's scientific and technological advancement.",
              },
              {
                icon: Award,
                title: "Our Impact",
                description:
                  "Over 25,000 students have participated in our olympiads, with many going on to achieve excellence in their academic careers.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Olympiad Gallery Section */}
      <section
        id="gallery"
        className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Olympiad 2.0 Memories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Relive the excitement, dedication, and achievements from our previous olympiad. These moments capture the
              spirit of learning and excellence.
            </p>
          </div>

          {/* Featured Photo Carousel */}
          <div className="relative mb-12 max-w-4xl mx-auto">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={OLYMPIAD_PHOTOS[currentPhotoIndex].url || "/placeholder.svg"}
                alt={OLYMPIAD_PHOTOS[currentPhotoIndex].title}
                fill
                className="object-cover transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{OLYMPIAD_PHOTOS[currentPhotoIndex].title}</h3>
                <p className="text-lg opacity-90">{OLYMPIAD_PHOTOS[currentPhotoIndex].description}</p>
              </div>
            </div>

            {/* Photo Navigation */}
            <div className="flex justify-center mt-6 gap-2">
              {OLYMPIAD_PHOTOS.map((_, index) => (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {OLYMPIAD_PHOTOS.map((photo, index) => (
              <div key={photo.id} className="relative group cursor-pointer" onClick={() => setCurrentPhotoIndex(index)}>
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
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section id="details" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Event Details
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about participating in Math & Science Olympiad 3.0
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Exam Date</h3>
                  <p className="text-gray-600 dark:text-gray-300">July 26, 2025 (Saturday)</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Registration deadline: July 20, 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Venue</h3>
                  <p className="text-gray-600 dark:text-gray-300">Multiple centers across Bangladesh</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Exact venue will be mentioned in admit card
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Subjects</h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="mr-2">
                      Mathematics (Class 5-10)
                    </Badge>
                    <Badge variant="outline" className="mr-2">
                      Science (Class 5-8)
                    </Badge>
                    <Badge variant="outline" className="mr-2">
                      Physics (Class 9-10)
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Registration Fee</h3>
                  <p className="text-gray-600 dark:text-gray-300">Only ৳150 per participant</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Payment via bKash: +880 1518-405600</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6">Why Participate?</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>Compete with the brightest minds</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>Win exciting prizes and certificates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>Boost your academic profile</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>Network with like-minded students</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span>Get recognition from top institutions</span>
                  </li>
                </ul>

                <Button
                  asChild
                  className="w-full mt-6 bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions? We're here to help you succeed in your olympiad journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Abu Bakkar Siddique</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">Founder & Organizer</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  For registration queries and general information
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    +880 1518-405600
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    contact@savarscience.org
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Hujaifa Khan</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">Co-Organizer</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">For technical support and payment assistance</p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    +880 1730-903744
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    support@savarscience.org
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Follow Us</h3>
            <div className="flex justify-center gap-6">
              <Link
                href={SOCIAL_LINKS.FACEBOOK}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href={SOCIAL_LINKS.YOUTUBE}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={IMAGES.LOGO || "/placeholder.svg"}
                  alt="Savar Science Society Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold">Savar Science Society</h3>
                  <p className="text-emerald-100">Inspiring Future Scientists</p>
                </div>
              </div>
              <p className="text-emerald-100 mb-4 max-w-md">
                Empowering young minds through mathematics and science competitions, fostering innovation and excellence
                in education.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/register" className="text-emerald-100 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-emerald-100 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                {admitCardEnabled && (
                  <li>
                    <Link href="/admit-card" className="text-emerald-100 hover:text-white transition-colors">
                      Admit Card
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-emerald-100">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +880 1518-405600
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +880 1730-903744
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contact@savarscience.org
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-400/30 mt-8 pt-8 text-center">
            <p className="text-emerald-100">
              © 2025 Savar Science Society. All rights reserved. |
              <span className="ml-2">Designed with ❤️ for future scientists</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes scale-x {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-scale-x {
          animation: scale-x 2s ease-out forwards;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
