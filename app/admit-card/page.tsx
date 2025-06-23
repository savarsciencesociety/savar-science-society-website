"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Printer, AlertCircle } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES } from "@/lib/image-paths"
import { MainNav } from "@/components/main-nav"
import { getStudentByRegistrationNumber } from "@/lib/actions"
import { parseRegistrationNumber, getOlympiadRoll } from "@/lib/registration"

interface StudentData {
  id: string
  registrationNumber: string
  fullName: string
  fatherName: string
  class: string
  olympiadType: string
  school: string
  fatherMobile: string
  gender: string
  photoUrl: string
  paymentStatus: string
}

export default function AdmitCardPage() {
  const { toast } = useToast()
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)

    try {
      const result = await getStudentByRegistrationNumber(registrationNumber.trim())

      if (result.success && result.student) {
        // Check if payment is completed
        if (result.student.paymentStatus !== "paid") {
          setError("Payment not completed. Please complete your payment to download the admit card.")
          setStudent(null)
          return
        }

        setStudent({
          id: result.student.id,
          registrationNumber: result.student.registrationNumber,
          fullName: result.student.fullName,
          fatherName: result.student.fatherName,
          class: result.student.class,
          olympiadType: result.student.olympiadType,
          school: result.student.school,
          fatherMobile: result.student.fatherMobile,
          gender: result.student.gender,
          photoUrl: result.student.photoUrl,
          paymentStatus: result.student.paymentStatus,
        })
        setError(null)
      } else {
        setError(result.error || "Student not found. Please check your registration number.")
        setStudent(null)
      }
    } catch (error) {
      console.error("Error fetching student:", error)
      setError("An error occurred while searching. Please try again.")
      setStudent(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const generateAdmitCardHTML = (studentData: StudentData) => {
    const parsedRegNumber = parseRegistrationNumber(studentData.registrationNumber)
    const olympiadRoll = getOlympiadRoll(studentData.registrationNumber)

    return (
      <div className="admit-card-print bg-white p-8 max-w-4xl mx-auto border-2 border-emerald-600 rounded-lg">
        <div className="header bg-emerald-600 text-white p-6 text-center rounded-t-lg -mx-8 -mt-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-bold">SAVAR SCIENCE SOCIETY</h1>
              <h2 className="text-xl md:text-2xl font-bold mt-2">MATH & SCIENCE OLYMPIAD 2025</h2>
              <h3 className="text-lg font-bold mt-2 text-yellow-300">ADMIT CARD</h3>
            </div>
            <div>
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="content grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="info-section md:col-span-2">
            <h3 className="text-lg font-bold text-emerald-600 border-b border-emerald-600 pb-2 mb-4">
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="info-row">
                <span className="font-bold text-gray-700">Registration No:</span>
                <span className="ml-2 text-gray-900">{studentData.registrationNumber}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Olympiad Roll:</span>
                <span className="ml-2 text-gray-900">{olympiadRoll}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{studentData.fullName}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Father's Name:</span>
                <span className="ml-2 text-gray-900">{studentData.fatherName}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Class:</span>
                <span className="ml-2 text-gray-900">{studentData.class}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Subject:</span>
                <span className="ml-2 text-gray-900">{studentData.olympiadType}</span>
              </div>
              <div className="info-row md:col-span-2">
                <span className="font-bold text-gray-700">Institute:</span>
                <span className="ml-2 text-gray-900">{studentData.school}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Center:</span>
                <span className="ml-2 text-gray-900">Savar Model College</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Shift:</span>
                <span className="ml-2 text-gray-900">Morning</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Time:</span>
                <span className="ml-2 text-gray-900">10:00 AM - 12:00 PM</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Mobile:</span>
                <span className="ml-2 text-gray-900">{studentData.fatherMobile}</span>
              </div>
              <div className="info-row">
                <span className="font-bold text-gray-700">Gender:</span>
                <span className="ml-2 text-gray-900 capitalize">{studentData.gender}</span>
              </div>
            </div>
          </div>

          <div className="photo-section text-center">
            <div className="w-32 h-40 border-2 border-gray-300 mx-auto mb-2 overflow-hidden">
              <Image
                src={studentData.photoUrl || "/placeholder.svg?height=160&width=128"}
                alt="Student Photo"
                width={128}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-gray-600">Student Photo</div>
          </div>
        </div>

        <div className="exam-info bg-yellow-100 p-4 rounded-lg mt-6 text-center">
          <div className="text-red-600 font-bold text-lg">EXAM DATE: 26 JULY 2025</div>
          <div className="text-emerald-600 mt-2">Please bring this admit card on the exam day</div>
        </div>

        <div className="instructions bg-gray-50 p-4 rounded-lg mt-6">
          <h4 className="font-bold text-emerald-600 mb-2">Instructions:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Bring this admit card on the exam day</li>
            <li>• Arrive at the exam center 30 minutes before the exam</li>
            <li>• Bring necessary stationery (pen, pencil, eraser, etc.)</li>
            <li>• Mobile phones are not allowed in the exam hall</li>
            <li>• Follow all exam rules and regulations</li>
          </ul>
        </div>

        <div className="footer text-center mt-6 text-sm text-gray-600">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .admit-card-print,
          .admit-card-print * {
            visibility: visible;
          }
          .admit-card-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <header className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800 no-print">
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
        {!student ? (
          <Card className="max-w-md mx-auto border-emerald-200 dark:border-emerald-700 dark:bg-gray-800 no-print">
            <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Download Admit Card</h1>
              <p className="text-emerald-100 mt-2">Enter your registration number to download your admit card</p>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="text-gray-700 dark:text-gray-300">
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="Enter your 10-digit registration number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                {error && (
                  <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
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

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Important Notes:</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Payment must be completed to download admit card</li>
                  <li>• Registration number is 10 digits long</li>
                  <li>• Contact support if you face any issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex justify-center gap-4 mb-6 no-print">
              <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Printer className="h-4 w-4 mr-2" />
                Print Admit Card
              </Button>
              <Button
                onClick={() => {
                  setStudent(null)
                  setRegistrationNumber("")
                  setError(null)
                }}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Search Another
              </Button>
            </div>

            {generateAdmitCardHTML(student)}
          </div>
        )}
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12 no-print">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
