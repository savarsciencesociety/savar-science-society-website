"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
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
import {
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Phone,
  GraduationCap,
  Building2,
  BookOpen,
} from "lucide-react"

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
  paymentStatus: "pending" | "submitted" | "paid"
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

  /* ---------- helpers ---------- */

  const getStatusIcon = (s: Student) => {
    if (s.paymentVerified) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (s.paymentStatus === "submitted") return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return <Clock className="h-5 w-5 text-gray-500" />
  }

  const getStatusText = (s: Student) => {
    if (s.paymentVerified) return "Payment Verified – Admit Card Available"
    if (s.paymentStatus === "submitted") return "Payment Submitted – Awaiting Verification"
    return "Payment Pending"
  }

  const getStatusColor = (s: Student) => {
    if (s.paymentVerified) return "text-green-600 dark:text-green-400"
    if (s.paymentStatus === "submitted") return "text-yellow-600 dark:text-yellow-400"
    return "text-gray-600 dark:text-gray-400"
  }

  /* ---------- actions ---------- */

  const handleSearch = async () => {
    if (!registrationNumber.trim()) {
      toast({
        title: "Missing registration number",
        description: "Please enter a registration number.",
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
            title: "Payment not verified",
            description:
              "Your payment is still under review. You’ll be able to download the admit card once it’s approved.",
            variant: "destructive",
          })
        }
      } else {
        setStudent(null)
        toast({
          title: "Student not found",
          description: "No record matched that registration number.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Search error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!student) return
    if (!student.paymentVerified) {
      toast({
        title: "Download blocked",
        description: "Admit card will be available after payment verification.",
        variant: "destructive",
      })
      return
    }

    /* simple HTML file download so users can print */
    const html = `
      <html>
      <head><title>Admit Card – ${student.fullName}</title></head>
      <body>
        <h2>Admit Card</h2>
        <p>Name: ${student.fullName}</p>
        <p>Reg:  ${student.registrationNumber}</p>
        <!-- add more fields as needed -->
      </body>
      </html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `admit-card-${student.registrationNumber}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  /* ---------- JSX ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      {/* ---------- header ---------- */}
      <header className="bg-emerald-600 dark:bg-emerald-700 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src={IMAGES.LOGO || "/placeholder.svg"} alt="Logo" width={48} height={48} className="rounded-full" />
            <span className="text-lg font-bold">Savar Science Society</span>
          </Link>

          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      {/* ---------- main ---------- */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* search card */}
        <Card className="mb-8 border-0 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-center">
            <h1 className="text-2xl font-bold">Download Admit Card</h1>
            <p className="text-emerald-100">Enter your registration number</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Label htmlFor="reg" className="mb-1 block">
                  Registration Number
                </Label>
                <Input
                  id="reg"
                  placeholder="e.g. 3082025080001"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white mt-2 md:mt-0 md:self-end"
              >
                {loading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-b-0 border-white" />
                    Searching…
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* results */}
        {searched && (
          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-8">
              {student ? (
                <>
                  {/* top row */}
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* photo */}
                    <div className="w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600">
                      {student.photoUrl ? (
                        <Image
                          src={student.photoUrl || "/placeholder.svg"}
                          alt={student.fullName}
                          width={128}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                          <User className="h-12 w-12" />
                        </div>
                      )}
                    </div>

                    {/* info */}
                    <div className="flex flex-1 flex-col gap-4">
                      <div>
                        <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">{student.fullName}</h2>
                        <p className="text-gray-600 dark:text-gray-300">Registration: {student.registrationNumber}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(student)}
                        <span className={`font-medium ${getStatusColor(student)}`}>{getStatusText(student)}</span>
                      </div>

                      {student.paymentVerified && (
                        <Button onClick={handleDownload} className="w-fit bg-green-600 hover:bg-green-700 text-white">
                          <Download className="mr-2 h-4 w-4" />
                          Download Admit Card
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* detailed grid */}
                  <div className="mt-8 grid gap-6 border-t pt-6 md:grid-cols-2">
                    {/* column 1 */}
                    <div className="space-y-4">
                      <Detail
                        icon={<User className="h-5 w-5 text-emerald-500" />}
                        label="Father's Name"
                        value={student.fatherName}
                      />
                      <Detail
                        icon={<User className="h-5 w-5 text-emerald-500" />}
                        label="Mother's Name"
                        value={student.motherName}
                      />
                      <Detail
                        icon={<Phone className="h-5 w-5 text-emerald-500" />}
                        label="Contact"
                        value={student.fatherMobile}
                      />
                      <Detail
                        icon={<Calendar className="h-5 w-5 text-emerald-500" />}
                        label="Date of Birth"
                        value={student.dateOfBirth}
                      />
                    </div>

                    {/* column 2 */}
                    <div className="space-y-4">
                      <Detail
                        icon={<GraduationCap className="h-5 w-5 text-emerald-500" />}
                        label="Class"
                        value={student.class}
                      />
                      <Detail
                        icon={<BookOpen className="h-5 w-5 text-emerald-500" />}
                        label="Subject"
                        value={student.olympiadType}
                      />
                      <Detail
                        icon={<Building2 className="h-5 w-5 text-emerald-500" />}
                        label="School"
                        value={student.school}
                      />
                      <Detail
                        icon={<Clock className="h-5 w-5 text-emerald-500" />}
                        label="Registered On"
                        value={new Date(student.registrationDate).toLocaleDateString()}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-lg text-gray-700 dark:text-gray-300">
                  No student found for that registration number.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* simple footer */}
      <footer className="bg-emerald-600 dark:bg-emerald-700 py-6 text-center text-white">
        © 2025 Savar Science Society
      </footer>
    </div>
  )
}

/* ------------- reusable row ------------- */
function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
