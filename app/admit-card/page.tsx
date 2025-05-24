"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getStudentByRegistrationNumber, getAdmitCardSetting } from "@/lib/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Download, AlertCircle, Loader2 } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES } from "@/lib/image-paths"
import { MainNav } from "@/components/main-nav"
import { parseRegistrationNumber } from "@/lib/registration"

interface StudentData {
  id: string
  class: string
  olympiadType: string
  fullName: string
  fatherName: string
  motherName: string
  fatherMobile: string
  motherMobile: string
  address: string
  gender: string
  dateOfBirth: string
  educationalInstitute: string
  dreamUniversity: string
  previousScholarship: string
  scholarshipDetails: string
  school: string
  photoUrl: string
  signatureUrl: string
  registrationDate: string
  registrationNumber: string
  paymentStatus: string
}

export default function AdmitCardPage() {
  const { toast } = useToast()
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [admitCardEnabled, setAdmitCardEnabled] = useState(false)
  const [checkingSettings, setCheckingSettings] = useState(true)

  useEffect(() => {
    const checkAdmitCardSetting = async () => {
      try {
        const result = await getAdmitCardSetting()
        setAdmitCardEnabled(result.enabled)
      } catch (error) {
        console.error("Error checking admit card setting:", error)
      } finally {
        setCheckingSettings(false)
      }
    }

    checkAdmitCardSetting()
  }, [])

  const handleSearch = async () => {
    if (!registrationNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a registration number",
        variant: "destructive",
      })
      return
    }

    if (registrationNumber.length !== 10) {
      toast({
        title: "Error",
        description: "Registration number must be 10 digits",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await getStudentByRegistrationNumber(registrationNumber)

      if (result.success) {
        setStudent(result.student)
        toast({
          title: "Student Found",
          description: "Student information loaded successfully",
        })
      } else {
        setStudent(null)
        toast({
          title: "Student Not Found",
          description: "No student found with this registration number",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while searching for the student",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!student) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const admitCardHTML = generateAdmitCardHTML(student)

    printWindow.document.write(admitCardHTML)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const generateAdmitCardHTML = (student: StudentData) => {
    const parsedRegNumber = parseRegistrationNumber(student.registrationNumber)

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admit Card - ${student.fullName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            .admit-card {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #059669;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background: #059669;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .header h1 { margin: 0; font-size: 24px; }
            .header h2 { margin: 5px 0; font-size: 18px; }
            .content {
              padding: 20px;
              display: grid;
              grid-template-columns: 1fr 150px;
              gap: 20px;
            }
            .info-section h3 {
              color: #059669;
              border-bottom: 1px solid #059669;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              min-width: 150px;
              color: #374151;
            }
            .info-value {
              color: #1f2937;
            }
            .photo-section {
              text-align: center;
            }
            .photo {
              width: 120px;
              height: 150px;
              border: 1px solid #d1d5db;
              object-fit: cover;
              margin-bottom: 10px;
            }
            .exam-info {
              background: #fef3c7;
              padding: 15px;
              border-radius: 6px;
              margin-top: 20px;
              text-align: center;
            }
            .exam-date {
              color: #dc2626;
              font-weight: bold;
              font-size: 18px;
            }
            .instructions {
              margin-top: 20px;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 6px;
            }
            .instructions h4 {
              color: #059669;
              margin-top: 0;
            }
            .instructions ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .instructions li {
              margin-bottom: 5px;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .admit-card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="admit-card">
            <div class="header">
              <h1>SAVAR SCIENCE SOCIETY</h1>
              <h2>MATH & SCIENCE OLYMPIAD 2025</h2>
              <h3>ADMIT CARD</h3>
            </div>
            
            <div class="content">
              <div class="info-section">
                <h3>Student Information</h3>
                <div class="info-row">
                  <span class="info-label">Registration No:</span>
                  <span class="info-value">${student.registrationNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${student.fullName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Father's Name:</span>
                  <span class="info-value">${student.fatherName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Class:</span>
                  <span class="info-value">${student.class}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Subject:</span>
                  <span class="info-value">${student.olympiadType}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">School:</span>
                  <span class="info-value">${student.school}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Institute:</span>
                  <span class="info-value">${student.educationalInstitute}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Mobile:</span>
                  <span class="info-value">${student.fatherMobile}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Gender:</span>
                  <span class="info-value">${student.gender}</span>
                </div>
              </div>
              
              <div class="photo-section">
                <img src="${student.photoUrl}" alt="Student Photo" class="photo" />
                <div style="font-size: 12px; color: #6b7280;">Student Photo</div>
              </div>
            </div>
            
            <div class="exam-info">
              <div class="exam-date">EXAM DATE: 26 JULY 2025</div>
              <div style="margin-top: 10px; color: #059669;">
                Please bring this admit card on the exam day
              </div>
            </div>
            
            <div class="instructions">
              <h4>Instructions:</h4>
              <ul>
                <li>Bring this admit card on the exam day</li>
                <li>Arrive at the exam center 30 minutes before the exam</li>
                <li>Bring necessary stationery (pen, pencil, eraser, etc.)</li>
                <li>Mobile phones are not allowed in the exam hall</li>
                <li>Follow all exam rules and regulations</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `
  }

  if (checkingSettings) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700 dark:text-emerald-400 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!admitCardEnabled) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
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
                <h1 className="text-xl font-bold">Savar Science Society</h1>
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
          <Card className="max-w-md mx-auto border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
                Admit Card Not Available
              </h2>
              <p className="text-emerald-600 dark:text-emerald-300 mb-6">
                Admit card download is currently not available. Please check back later or contact the administrators.
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
              <h1 className="text-xl font-bold">Savar Science Society</h1>
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
        <h1 className="text-3xl font-bold text-center text-emerald-700 dark:text-emerald-400 mb-12">
          Download Admit Card
        </h1>

        <Card className="max-w-md mx-auto border-emerald-200 dark:border-emerald-700 dark:bg-gray-800 mb-8">
          <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
            <h2 className="text-xl font-bold text-center">Search Student</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="registrationNumber" className="text-gray-700 dark:text-gray-300">
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter 10-digit registration number"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  maxLength={10}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 3010721001</p>
              </div>
              <Button onClick={handleSearch} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Student
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {student && (
          <Card className="max-w-4xl mx-auto border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
            <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
              <h2 className="text-xl font-bold text-center">Student Information</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-300 font-medium">Registration Number</p>
                      <p className="text-gray-700 dark:text-gray-300">{student.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-300 font-medium">Full Name</p>
                      <p className="text-gray-700 dark:text-gray-300">{student.fullName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-300 font-medium">Class</p>
                      <p className="text-gray-700 dark:text-gray-300">{student.class}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-300 font-medium">Subject</p>
                      <p className="text-gray-700 dark:text-gray-300">{student.olympiadType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-300 font-medium">School</p>
                      <p className="text-gray-700 dark:text-gray-300">{student.school}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-300 font-medium">Father's Name</p>
                      <p className="text-gray-700 dark:text-gray-300">{student.fatherName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-32 h-40 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 relative overflow-hidden mb-2">
                    <Image
                      src={student.photoUrl || "/placeholder.svg"}
                      alt="Student Photo"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Student Photo</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
                <p className="text-red-600 dark:text-red-400 font-bold text-center text-lg">EXAM DATE: 26 JULY 2025</p>
                <p className="text-emerald-600 dark:text-emerald-300 text-center mt-2">
                  Please bring this admit card on the exam day
                </p>
              </div>

              <div className="text-center">
                <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Admit Card
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
