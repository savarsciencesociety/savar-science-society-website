"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { getStudentByRegistrationNumber } from "@/lib/actions"
import { IMAGES } from "@/lib/image-paths"
import { Search, Download, CheckCircle, AlertTriangle, Clock, User, Calendar, Phone } from "lucide-react"

interface Student {
  id: string
  fullName: string
  fatherName: string
  motherName: string
  class: string
  olympiadType: string
  school: string
  registrationNumber: string
  registrationDate: string
  paymentStatus: string
  paymentVerified: boolean
  photoUrl?: string
  fatherMobile: string
  address: string
  gender: string
  dateOfBirth: string
}

export default function AdmitCardPage() {
  const { toast } = useToast()
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!registrationNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a registration number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const result = await getStudentByRegistrationNumber(registrationNumber.trim())

      if (result.success && result.student) {
        setStudent(result.student)
        
        if (!result.student.paymentVerified) {
          toast({
            title: "Payment Not Verified",
            description: "Your payment is still being verified. Please wait for admin approval.",
            variant: "destructive",
          })
        }
      } else {
        setStudent(null)
        toast({
          title: "Student Not Found",
          description: "No student found with this registration number. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching student:", error)
      setStudent(null)
      toast({
        title: "Search Failed",
        description: "Failed to search for student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!student || !student.paymentVerified) {
      toast({
        title: "Download Not Available",
        description: "Admit card can only be downloaded after payment verification.",
        variant: "destructive",
      })
      return
    }

    // Create admit card content
    const admitCardContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admit Card - ${student.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .admit-card { max-width: 800px; margin: 0 auto; border: 2px solid #059669; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { width: 80px; height: 80px; margin: 0 auto 10px; }
          .title { color: #059669; font-size: 24px; font-weight: bold; margin: 10px 0; }
          .subtitle { color: #6b7280; font-size: 16px; }
          .student-info { display: grid; grid-template-columns: 1fr 150px; gap: 30px; margin: 30px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; }
          .photo { width: 120px; height: 150px; border: 2px solid #d1d5db; object-fit: cover; }
          .exam-details { background: #f0fdf4; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .instructions { margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="admit-card">
          <div class="header">
            <div class="logo">
              <img src="${IMAGES.LOGO || '/placeholder.svg'}" alt="Logo" style="width: 80px; height: 80px; border-radius: 50%;">
            </div>
            <h1 class="title">SAVAR SCIENCE SOCIETY</h1>
            <p class="subtitle">MATH & SCIENCE OLYMPIAD 3.0</p>
            <h2 style="color: #dc2626; margin: 20px 0;">ADMIT CARD</h2>
          </div>

          <div class="student-info">
            <div>
              <div class="info-row">
                <span class="label">Registration Number:</span>
                <span class="value">${student.registrationNumber}</span>
              </div>
              <div class="info-row">
                <span class="label">Student Name:</span>
                <span class="value">${student.fullName}</span>
              </div>
              <div class="info-row">
                <span class="label">Father's Name:</span>
                <span class="value">${student.fatherName}</span>
              </div>
              <div class="info-row">
                <span class="label">Mother's Name:</span>
                <span class="value">${student.motherName}</span>
              </div>
              <div class="info-row">
                <span class="label">Class:</span>
                <span class="value">${student.class}</span>
              </div>
              <div class="info-row">
                <span class="label">Subject:</span>
                <span class="value">${student.olympiadType}</span>
              </div>
              <div class="info-row">
                <span class="label">School:</span>
                <span class="value">${student.school}</span>
              </div>
              <div class="info-row">
                <span class="label">Mobile:</span>
                <span class="value">${student.fatherMobile}</span>
              </div>
            </div>
            <div style="text-align: center;">
              <img src="${student.photoUrl || '/placeholder.svg'}" alt="Student Photo" class="photo">
              <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">Student Photo</p>
            </div>
          </div>

          <div class="exam-details">
            <h3 style="color: #059669; margin-bottom: 15px;">EXAM DETAILS</h3>
            <div class="info-row">
              <span class="label">Exam Date:</span>
              <span class="value">July 26, 2025 (Saturday)</span>
            </div>
            <div class="info-row">
              <span class="label">Reporting Time:</span>
              <span class="value">9:00 AM</span>
            </div>
            <div class="info-row">
              <span class="label">Exam Duration:</span>
              <span class="value">2 Hours</span>
            </div>
            <div class="info-row">
              <span class="label">Venue:</span>
              <span class="value">Will be announced soon</span>
            </div>
          </div>

          <div class="instructions">
            <h3 style="color: #dc2626; margin-bottom: 15px;">IMPORTANT INSTRUCTIONS</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Bring this admit card and a valid ID proof to the exam center</li>
              <li>Report to the exam center 30 minutes before the exam time</li>
              <li>Bring your own pen, pencil, eraser, and scale</li>
              <li>Mobile phones and electronic devices are strictly prohibited</li>
              <li>Follow all COVID-19 safety protocols</li>
              <li>Late entry will not be allowed under any circumstances</li>
            </ul>
          </div>

          <div class="footer">
            <p>© 2025 Savar Science Society. All rights reserved.</p>
            <p>For queries: +880 1518-405600 | +880 1730-903744</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Create and download the admit card
    const blob = new Blob([admitCardContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admit-card-${student.registrationNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: "Your admit card has been downloaded successfully.",
    })
  }

  const getStatusIcon = (student: Student) => {
    if (student.paymentVerified) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (student.paymentStatus === "submitted") {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    } else {
      return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (student: Student) => {
    if (student.paymentVerified) {
      return "Payment Verified - Admit Card Available"
    } else if (student.paymentStatus === "submitted") {
      return "Payment Submitted - Under Verification"
    } else {
      return "Payment Pending"
    }
  }

  const getStatusColor = (student: Student) => {
    if (student.paymentVerified) {
      return "text-green-600 dark:text-green-400"
    } else if (student.paymentStatus === "submitted") {
      return "text-yellow-600 dark:text-yellow-400"
    } else {
      return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <header className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold">Admit Card Download</h1>
                <p className="text-sm text-emerald-100">Savar Science Society</p>
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold">Download Admit Card</h1>
                <p className="text-emerald-100 mt-2">Enter your registration number to download your admit card</p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="registrationNumber" className="text-gray-700 dark:text-gray-300 mb-2 block">
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    placeholder="Enter your registration number (e.g., 3082025080001)"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 h-10"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {searched && (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                {student ? (
                  <div className="space-y-6">
                    {/* Student Info Header */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-40 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {student.photoUrl ? (
                            <Image
                              src={student.photoUrl || "/placeholder.svg"}
                              alt={student.fullName}
                              width={128}
                              height={160}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <User className="h-12 w-12" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{student.fullName}</h2>
                          <p className="text-lg text-gray-600 dark:text-gray-300">Registration: {student.registrationNumber}</p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(student)}
                          <span className={`font-medium ${getStatusColor(student)}`}>
                            {getStatusText(student)}
                          </span>
                        </div>

                        {/* Download Button */}
                        {student.paymentVerified ? (
                          <Button
                            onClick={handleDownload}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Admit Card
                          </Button>
                        ) : (
                          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                              <AlertTriangle className="h-5 w-5" />
                              <span className="font-medium">Admit Card Not Available</span>
                            </div>
                            <p className="text-yellow-700 dark:text-yellow-400 mt-2 text-sm">
                              Your payment is still being verified by our admin team. 
                              You will be able to download your admit card once the payment is approved.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h3>
                        
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Father's Name</p>
                            <p className="text-gray-800 dark:text-white">{student.fatherName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mother's Name</p>
                            <p className="text-gray-800 dark:text-white">{student.motherName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                            <p className="text-gray-800 dark:text-white">{student.fatherMobile}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                            <p className="text-gray-800 dark:text-white">{student.dateOfBirth}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-\
