"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { registerStudent } from "@/lib/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, ChevronDown, Upload, ExternalLink } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES } from "@/lib/image-paths"
import { SCHOOL_CODES, getAvailableSubjects } from "@/lib/registration"
import MainNav from "@/components/MainNav" // Declare MainNav variable

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [studentId, setStudentId] = useState("")
  const [schoolSearch, setSchoolSearch] = useState("")
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [showPaymentSection, setShowPaymentSection] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    school: "",
    class: "",
    olympiadType: "",
    fullName: "",
    fatherName: "",
    motherName: "",
    fatherMobile: "",
    motherMobile: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    dreamUniversity: "",
    previousScholarship: "no",
    scholarshipDetails: "",
    photoGoogleDriveLink: "",
    signatureGoogleDriveLink: "",
    paymentNumber: "",
    paymentTransactionId: "",
  })

  // Filter schools based on search
  const filteredSchools = Object.keys(SCHOOL_CODES).filter((school) =>
    school.toLowerCase().includes(schoolSearch.toLowerCase()),
  )

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.school) errors.school = "Please select a school"
    if (!formData.class) errors.class = "Please select a class"
    if (!formData.olympiadType) errors.olympiadType = "Please select an olympiad type"
    if (!formData.fullName) errors.fullName = "Full name is required"
    if (!formData.fatherName) errors.fatherName = "Father's name is required"
    if (!formData.motherName) errors.motherName = "Mother's name is required"
    if (!formData.fatherMobile) errors.fatherMobile = "Father's mobile number is required"
    if (!formData.address) errors.address = "Address is required"
    if (!formData.gender) errors.gender = "Please select a gender"
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required"
    if (!formData.dreamUniversity) errors.dreamUniversity = "Please select a dream university"

    // Payment validation when payment section is shown
    if (showPaymentSection) {
      if (!formData.paymentNumber) errors.paymentNumber = "bKash payment number is required"
      if (!formData.paymentTransactionId) errors.paymentTransactionId = "Transaction ID is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle school selection
  const handleSchoolSelect = (school: string) => {
    setFormData({ ...formData, school })
    setSchoolSearch(school)
    setShowSchoolDropdown(false)
    setFormErrors((prev) => ({ ...prev, school: undefined }))
  }

  // Handle photo change - for preview only
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setPhotoPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle signature change - for preview only
  const handleSignatureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setSignaturePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompleteRegistration = () => {
    // Validate basic form first
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setShowPaymentSection(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()

      // Add all text fields
      formDataToSubmit.append("school", formData.school)
      formDataToSubmit.append("class", formData.class)
      formDataToSubmit.append("olympiadType", formData.olympiadType)
      formDataToSubmit.append("fullName", formData.fullName)
      formDataToSubmit.append("fatherName", formData.fatherName)
      formDataToSubmit.append("motherName", formData.motherName)
      formDataToSubmit.append("fatherMobile", formData.fatherMobile)
      formDataToSubmit.append("motherMobile", formData.motherMobile || "")
      formDataToSubmit.append("address", formData.address)
      formDataToSubmit.append("gender", formData.gender)
      formDataToSubmit.append("dateOfBirth", formData.dateOfBirth)
      formDataToSubmit.append("educationalInstitute", formData.school)
      formDataToSubmit.append("dreamUniversity", formData.dreamUniversity)
      formDataToSubmit.append("previousScholarship", formData.previousScholarship)
      formDataToSubmit.append("scholarshipDetails", formData.scholarshipDetails || "")
      formDataToSubmit.append("paymentNumber", formData.paymentNumber)
      formDataToSubmit.append("paymentTransactionId", formData.paymentTransactionId)

      // Add Google Drive links for images
      formDataToSubmit.append("photoLink", formData.photoGoogleDriveLink || "")
      formDataToSubmit.append("signatureLink", formData.signatureGoogleDriveLink || "")

      const result = await registerStudent(formDataToSubmit)

      if (result.success) {
        setRegistrationSuccess(true)
        setRegistrationNumber(result.registrationNumber || "")
        setStudentId(result.studentId || "")

        toast({
          title: "Registration Submitted",
          description: `Your registration has been submitted successfully. Registration number: ${result.registrationNumber}`,
        })
      } else {
        throw new Error(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If registration is successful, show success message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <header className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800 shadow-lg">
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
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 p-4 flex flex-col items-center justify-center rounded-t-lg">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Registration Submitted</h1>
              </div>
            </CardHeader>

            <CardContent className="p-8 border border-gray-200 dark:border-gray-700 rounded-b-lg">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Thank you for registering!</h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your registration has been submitted and is pending payment verification.
                </p>

                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 mb-6 w-full">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Your Registration Number:</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    {registrationNumber}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6 w-full">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Payment Status:</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Your payment information has been submitted for verification. You will be able to download your
                    admit card once the payment is verified by our admin team.
                  </p>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please save your registration number for future reference.
                </p>

                <div className="flex gap-4">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg"
                  >
                    <Link href={`/student/${studentId}`}>View Profile</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                  >
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 Savar Science Society. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <header className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800 shadow-lg">
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
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 p-4 flex flex-col md:flex-row items-center justify-between rounded-t-lg">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">SAVAR SCIENCE SOCIETY</h1>
              <p className="text-yellow-300 font-semibold">PRESENTS</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">MATH & SCIENCE OLYMPIAD</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 border border-gray-200 dark:border-gray-700 rounded-b-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Registration{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Form
                </span>
              </h3>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* School Selection with Search */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">School/Institution</h4>
                <div className="relative">
                  <Input
                    placeholder="Search and select your school/institution..."
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value)
                      setShowSchoolDropdown(true)
                    }}
                    onFocus={() => setShowSchoolDropdown(true)}
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                  />
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />

                  {showSchoolDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-xl max-h-60 overflow-y-auto">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <div
                            key={school}
                            className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                            onClick={() => handleSchoolSelect(school)}
                          >
                            {school}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No schools found</div>
                      )}
                    </div>
                  )}
                </div>
                {formErrors.school && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.school}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Class</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[5, 6, 7, 8, 9, 10].map((classNum) => (
                      <div key={classNum} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${classNum}`}
                          checked={formData.class === classNum.toString()}
                          onCheckedChange={() => {
                            setFormData({ ...formData, class: classNum.toString() })
                            setFormErrors((prev) => ({ ...prev, class: undefined }))
                          }}
                          className="border-2 border-emerald-500 data-[state=checked]:bg-emerald-500"
                        />
                        <Label htmlFor={`class-${classNum}`} className="text-gray-700 dark:text-gray-300 font-medium">
                          {classNum}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formErrors.class && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.class}</p>}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Olympiad</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.class ? (
                      getAvailableSubjects(formData.class).map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`olympiad-${subject.toLowerCase()}`}
                            checked={formData.olympiadType === subject}
                            onCheckedChange={() => {
                              setFormData({ ...formData, olympiadType: subject })
                              setFormErrors((prev) => ({ ...prev, olympiadType: undefined }))
                            }}
                            className="border-2 border-emerald-500 data-[state=checked]:bg-emerald-500"
                          />
                          <Label
                            htmlFor={`olympiad-${subject.toLowerCase()}`}
                            className="text-gray-700 dark:text-gray-300 font-medium"
                          >
                            {subject} {subject === "Science" ? "(5-8)" : subject === "Math" ? "(5-10)" : "(9-10)"}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Please select a class first</p>
                    )}
                  </div>
                  {formErrors.olympiadType && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.olympiadType}</p>
                  )}
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Student Photo</h4>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-40 border-2 border-dashed border-emerald-300 dark:border-emerald-600 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 relative rounded-lg">
                    {photoPreview ? (
                      <Image
                        src={photoPreview || "/placeholder.svg"}
                        alt="Student Photo"
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-emerald-600 dark:text-emerald-400 text-xs text-center">Upload Photo</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400"
                      ref={photoInputRef}
                    />
                    <div>
                      <Label htmlFor="photoGoogleDriveLink" className="text-gray-700 dark:text-gray-300 font-medium">
                        Or paste Google Drive link:
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="photoGoogleDriveLink"
                          placeholder="https://drive.google.com/file/d/..."
                          value={formData.photoGoogleDriveLink}
                          onChange={(e) => setFormData({ ...formData, photoGoogleDriveLink: e.target.value })}
                          className="border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400"
                        >
                          <Link
                            href="https://drive.google.com/drive/folders/1WGfhvrPz7v3xCJC78WZw1fm4oe_xVqCk?usp=sharing"
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">📸 Photo Guidelines:</p>
                      <ul className="text-blue-600 dark:text-blue-400 text-xs mt-1 space-y-1">
                        <li>• Any size and format accepted</li>
                        <li>• Upload to Google Drive and share the link</li>
                        <li>• Photo is optional but recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 mb-4">
                  PERSONAL INFORMATION
                </h4>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name:
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                        setFormErrors((prev) => ({ ...prev, fullName: undefined }))
                      }}
                      className={`border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                        formErrors.fullName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fatherName" className="text-gray-700 dark:text-gray-300 font-medium">
                        Father's Name:
                      </Label>
                      <Input
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={(e) => {
                          setFormData({ ...formData, fatherName: e.target.value })
                          setFormErrors((prev) => ({ ...prev, fatherName: undefined }))
                        }}
                        className={`border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                          formErrors.fatherName ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.fatherName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.fatherName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="fatherMobile" className="text-gray-700 dark:text-gray-300 font-medium">
                        Mobile No:
                      </Label>
                      <Input
                        id="fatherMobile"
                        value={formData.fatherMobile}
                        onChange={(e) => {
                          setFormData({ ...formData, fatherMobile: e.target.value })
                          setFormErrors((prev) => ({ ...prev, fatherMobile: undefined }))
                        }}
                        className={`border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                          formErrors.fatherMobile ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.fatherMobile && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.fatherMobile}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="motherName" className="text-gray-700 dark:text-gray-300 font-medium">
                        Mother's Name:
                      </Label>
                      <Input
                        id="motherName"
                        value={formData.motherName}
                        onChange={(e) => {
                          setFormData({ ...formData, motherName: e.target.value })
                          setFormErrors((prev) => ({ ...prev, motherName: undefined }))
                        }}
                        className={`border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                          formErrors.motherName ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.motherName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.motherName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="motherMobile" className="text-gray-700 dark:text-gray-300 font-medium">
                        Mobile No:
                      </Label>
                      <Input
                        id="motherMobile"
                        value={formData.motherMobile}
                        onChange={(e) => setFormData({ ...formData, motherMobile: e.target.value })}
                        className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">
                      Present Address:
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value })
                        setFormErrors((prev) => ({ ...prev, address: undefined }))
                      }}
                      className={`border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                        formErrors.address ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 block mb-2 font-medium">Gender:</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => {
                          setFormData({ ...formData, gender: value })
                          setFormErrors((prev) => ({ ...prev, gender: undefined }))
                        }}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="male"
                            id="male"
                            className="border-2 border-emerald-500 text-emerald-500"
                          />
                          <Label htmlFor="male" className="text-gray-700 dark:text-gray-300 font-medium">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="female"
                            id="female"
                            className="border-2 border-emerald-500 text-emerald-500"
                          />
                          <Label htmlFor="female" className="text-gray-700 dark:text-gray-300 font-medium">
                            Female
                          </Label>
                        </div>
                      </RadioGroup>
                      {formErrors.gender && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.gender}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
