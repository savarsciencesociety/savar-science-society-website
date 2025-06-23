"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  getAllStudents,
  verifyPayment,
  adminLogout,
  getAdminSession,
  getAdminStats,
  deleteStudent,
  addStudent,
  getAdmitCardSetting,
  updateAdmitCardSetting,
} from "@/lib/actions"
import {
  Users,
  Clock,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  UserPlus,
  BookOpen,
  Eye,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import { IMAGES } from "@/lib/image-paths"
import { SCHOOL_CODES } from "@/lib/registration"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Student {
  id: string
  fullName: string
  class: string
  olympiadType: string
  registrationNumber: string
  registrationDate: string
  paymentStatus: string
  paymentVerified: boolean
  paymentNumber?: string
  paymentTransactionId?: string
  fatherMobile: string
  photoUrl?: string
  school: string
}

interface Stats {
  totalRegistered: number
  totalVerified: number
  totalSubmitted: number
  totalPending: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalRegistered: 0,
    totalVerified: 0,
    totalSubmitted: 0,
    totalPending: 0,
  })
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoErrors, setPhotoErrors] = useState<Record<string, boolean>>({})
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    class: "",
    olympiadType: "",
    fatherName: "",
    motherName: "",
    fatherMobile: "",
    motherMobile: "",
    address: "",
    gender: "male",
    dateOfBirth: "",
    educationalInstitute: "",
    dreamUniversity: "General",
    previousScholarship: "no",
    scholarshipDetails: "",
    school: "",
  })
  const [admitCardEnabled, setAdmitCardEnabled] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const session = await getAdminSession()
      if (session.success && session.loggedIn) {
        setAdminName(session.admin?.name || "Admin")
        setAdminUsername(session.admin?.username || "")
      } else {
        router.push("/admin/login")
      }
    }

    const fetchData = async () => {
      try {
        const [studentsResult, statsResult, admitCardResult] = await Promise.all([
          getAllStudents(),
          getAdminStats(),
          getAdmitCardSetting(),
        ])

        if (studentsResult.success) {
          setStudents(studentsResult.students)
          setFilteredStudents(studentsResult.students)
        }

        if (statsResult.success) {
          setStats(statsResult.stats)
        }

        if (admitCardResult.success) {
          setAdmitCardEnabled(admitCardResult.enabled)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkSession()
    fetchData()
  }, [router, toast])

  useEffect(() => {
    // Apply filters and search
    let result = [...students]

    // Filter by payment status
    if (filter === "verified") {
      result = result.filter((student) => student.paymentVerified === true)
    } else if (filter === "submitted") {
      result = result.filter((student) => student.paymentStatus === "submitted" && !student.paymentVerified)
    } else if (filter === "pending") {
      result = result.filter((student) => student.paymentStatus === "pending")
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (student) =>
          student.fullName.toLowerCase().includes(term) ||
          student.registrationNumber.toLowerCase().includes(term) ||
          student.fatherMobile.includes(term),
      )
    }

    setFilteredStudents(result)
  }, [filter, searchTerm, students])

  const handlePaymentVerification = async (studentId: string, verified: boolean) => {
    try {
      const result = await verifyPayment(studentId, verified, adminUsername)

      if (result.success) {
        // Update the local state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  paymentVerified: verified,
                  paymentStatus: verified ? "verified" : "submitted",
                }
              : student,
          ),
        )

        // Update stats
        const newStats = { ...stats }
        if (verified) {
          newStats.totalVerified += 1
          newStats.totalSubmitted -= 1
        } else {
          newStats.totalVerified -= 1
          newStats.totalSubmitted += 1
        }
        setStats(newStats)

        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.error || "Failed to verify payment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify payment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStudent = async (id: string) => {
    try {
      const result = await deleteStudent(id)

      if (result.success) {
        // Update the local state
        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id))

        // Update stats
        const deletedStudent = students.find((student) => student.id === id)
        const newStats = { ...stats }
        newStats.totalRegistered -= 1
        if (deletedStudent?.paymentVerified) {
          newStats.totalVerified -= 1
        } else if (deletedStudent?.paymentStatus === "submitted") {
          newStats.totalSubmitted -= 1
        } else {
          newStats.totalPending -= 1
        }
        setStats(newStats)

        toast({
          title: "Success",
          description: "Student deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete student")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      })
    } finally {
      setStudentToDelete(null)
    }
  }

  const handleAddStudent = async () => {
    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = [
        "fullName",
        "class",
        "olympiadType",
        "fatherName",
        "motherName",
        "fatherMobile",
        "address",
        "dateOfBirth",
        "educationalInstitute",
        "dreamUniversity",
        "school",
      ]

      const missingFields = requiredFields.filter((field) => !newStudent[field as keyof typeof newStudent])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      const result = await addStudent(newStudent)

      if (result.success) {
        // Refresh the student list
        const studentsResult = await getAllStudents()
        if (studentsResult.success) {
          setStudents(studentsResult.students)
        }

        // Update stats
        const statsResult = await getAdminStats()
        if (statsResult.success) {
          setStats(statsResult.stats)
        }

        toast({
          title: "Success",
          description: "Student added successfully",
        })

        // Reset form and close dialog
        setNewStudent({
          fullName: "",
          class: "",
          olympiadType: "",
          fatherName: "",
          motherName: "",
          fatherMobile: "",
          motherMobile: "",
          address: "",
          gender: "male",
          dateOfBirth: "",
          educationalInstitute: "",
          dreamUniversity: "General",
          previousScholarship: "no",
          scholarshipDetails: "",
          school: "",
        })
        setIsAddDialogOpen(false)
      } else {
        throw new Error(result.error || "Failed to add student")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add student",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      const result = await adminLogout()

      if (result.success) {
        toast({
          title: "Logout Successful",
          description: "You have been logged out successfully.",
        })
        router.push("/admin/login")
      } else {
        throw new Error(result.error || "Logout failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const handleImageError = (studentId: string) => {
    setPhotoErrors((prev) => ({ ...prev, [studentId]: true }))
  }

  const handleAdmitCardToggle = async () => {
    try {
      const result = await updateAdmitCardSetting(!admitCardEnabled)

      if (result.success) {
        setAdmitCardEnabled(!admitCardEnabled)
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.error || "Failed to update setting")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update setting",
        variant: "destructive",
      })
    }
  }

  const PaymentDetailsPopover = ({ student }: { student: Student }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 border-2 border-cyan-500 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <BookOpen className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-cyan-200 dark:border-cyan-700 shadow-2xl rounded-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">Payment Details</h4>
              <p className="text-sm text-cyan-600 dark:text-cyan-400">Notebook Style View</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 p-3 rounded-xl border border-blue-200 dark:border-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-200">bKash Number:</span>
              <p className="text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded mt-1 border">
                {student.paymentNumber || "Not provided"}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-3 rounded-xl border border-purple-200 dark:border-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Transaction ID:</span>
              <p className="text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded mt-1 border">
                {student.paymentTransactionId || "Not provided"}
              </p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700 dark:to-slate-600 p-3 rounded-xl border border-emerald-200 dark:border-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Status:</span>
              <div className="mt-2">
                <Badge
                  variant={student.paymentVerified ? "default" : "secondary"}
                  className={
                    student.paymentVerified
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : student.paymentStatus === "submitted"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg"
                  }
                >
                  {student.paymentVerified
                    ? "✅ Verified"
                    : student.paymentStatus === "submitted"
                      ? "⏳ Submitted"
                      : "⏸️ Pending"}
                </Badge>
              </div>
            </div>
          </div>
          {student.paymentStatus === "submitted" && !student.paymentVerified && (
            <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-600">
              <Button
                size="sm"
                onClick={() => handlePaymentVerification(student.id, true)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePaymentVerification(student.id, false)}
                className="flex-1 border-2 border-red-400 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-900 dark:to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-cyan-400/30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Loading Dashboard...</h2>
          <p className="text-cyan-600 dark:text-cyan-400 animate-pulse">Preparing admin interface...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-900 dark:to-cyan-900">
      <header className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-700 dark:to-purple-700 text-white py-6 shadow-2xl">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-all duration-300 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Image
                  src={IMAGES.LOGO || "/placeholder.svg"}
                  alt="Savar Science Society Logo"
                  width={60}
                  height={60}
                  className="rounded-full relative z-10 ring-2 ring-white/30"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-cyan-100">Savar Science Society</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm hidden md:block bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              Welcome, <span className="font-semibold">{adminName}</span>
            </p>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-white/60 bg-white/15 text-white hover:bg-white/25 hover:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-cyan-200 dark:border-cyan-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-6 flex items-center">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl mr-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Registrations</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalRegistered}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-green-200 dark:border-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-6 flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl mr-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Payment Verified</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalVerified}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-yellow-200 dark:border-yellow-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-6 flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-2xl mr-4 shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Payment Submitted</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalSubmitted}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-6 flex items-center">
              <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-4 rounded-2xl mr-4 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Payment Pending</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalPending}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-cyan-200 dark:border-cyan-700 shadow-2xl rounded-2xl">
          <CardHeader className="p-6 border-b-2 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-cyan-500" />
                Student Registrations
              </h2>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, phone..."
                    className="pl-10 pr-4 py-3 w-full border-2 border-slate-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full md:w-40 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl shadow-lg">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="verified">Payment Verified</SelectItem>
                    <SelectItem value="submitted">Payment Submitted</SelectItem>
                    <SelectItem value="pending">Payment Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-cyan-200 dark:border-cyan-700 rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-slate-800 dark:text-white">Add New Student</DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Fill in the student details below to add a new registration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            value={newStudent.fullName}
                            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class" className="text-slate-700 dark:text-slate-300 font-medium">
                            Class *
                          </Label>
                          <Select
                            value={newStudent.class}
                            onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}
                          >
                            <SelectTrigger
                              id="class"
                              className="border-2 border-slate-300 dark:border-slate-600 rounded-xl"
                            >
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              {[5, 6, 7, 8, 9, 10].map((classNum) => (
                                <SelectItem key={classNum} value={classNum.toString()}>
                                  Class {classNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="olympiadType" className="text-slate-700 dark:text-slate-300 font-medium">
                          Olympiad Type *
                        </Label>
                        <Select
                          value={newStudent.olympiadType}
                          onValueChange={(value) => setNewStudent({ ...newStudent, olympiadType: value })}
                        >
                          <SelectTrigger
                            id="olympiadType"
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select olympiad type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Math">Math</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school" className="text-slate-700 dark:text-slate-300 font-medium">
                          School/Institution *
                        </Label>
                        <Select
                          value={newStudent.school}
                          onValueChange={(value) => setNewStudent({ ...newStudent, school: value })}
                        >
                          <SelectTrigger
                            id="school"
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select school/institution" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {Object.keys(SCHOOL_CODES).map((school) => (
                              <SelectItem key={school} value={school}>
                                {school}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fatherName" className="text-slate-700 dark:text-slate-300 font-medium">
                            Father's Name *
                          </Label>
                          <Input
                            id="fatherName"
                            value={newStudent.fatherName}
                            onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fatherMobile" className="text-slate-700 dark:text-slate-300 font-medium">
                            Father's Mobile *
                          </Label>
                          <Input
                            id="fatherMobile"
                            value={newStudent.fatherMobile}
                            onChange={(e) => setNewStudent({ ...newStudent, fatherMobile: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="motherName" className="text-slate-700 dark:text-slate-300 font-medium">
                            Mother's Name *
                          </Label>
                          <Input
                            id="motherName"
                            value={newStudent.motherName}
                            onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motherMobile" className="text-slate-700 dark:text-slate-300 font-medium">
                            Mother's Mobile
                          </Label>
                          <Input
                            id="motherMobile"
                            value={newStudent.motherMobile}
                            onChange={(e) => setNewStudent({ ...newStudent, motherMobile: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-slate-700 dark:text-slate-300 font-medium">
                          Address *
                        </Label>
                        <Input
                          id="address"
                          value={newStudent.address}
                          onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                          className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium">Gender *</Label>
                          <RadioGroup
                            value={newStudent.gender}
                            onValueChange={(value) => setNewStudent({ ...newStudent, gender: value })}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male" className="text-slate-700 dark:text-slate-300">
                                Male
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female" className="text-slate-700 dark:text-slate-300">
                                Female
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="text-slate-700 dark:text-slate-300 font-medium">
                            Date of Birth *
                          </Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={newStudent.dateOfBirth}
                            onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="educationalInstitute"
                          className="text-slate-700 dark:text-slate-300 font-medium"
                        >
                          Educational Institute *
                        </Label>
                        <Input
                          id="educationalInstitute"
                          value={newStudent.educationalInstitute}
                          onChange={(e) => setNewStudent({ ...newStudent, educationalInstitute: e.target.value })}
                          className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dreamUniversity" className="text-slate-700 dark:text-slate-300 font-medium">
                          Dream University *
                        </Label>
                        <Select
                          value={newStudent.dreamUniversity}
                          onValueChange={(value) => setNewStudent({ ...newStudent, dreamUniversity: value })}
                        >
                          <SelectTrigger
                            id="dreamUniversity"
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select dream university" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUET">Study in BUET</SelectItem>
                            <SelectItem value="Medical">Study in Medical</SelectItem>
                            <SelectItem value="General">Study in General University (DU,JU etc.)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300 font-medium">Previous Scholarship</Label>
                        <RadioGroup
                          value={newStudent.previousScholarship}
                          onValueChange={(value) => setNewStudent({ ...newStudent, previousScholarship: value })}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="scholarship-yes" />
                            <Label htmlFor="scholarship-yes" className="text-slate-700 dark:text-slate-300">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="scholarship-no" />
                            <Label htmlFor="scholarship-no" className="text-slate-700 dark:text-slate-300">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {newStudent.previousScholarship === "yes" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="scholarshipDetails"
                            className="text-slate-700 dark:text-slate-300 font-medium"
                          >
                            Scholarship Details
                          </Label>
                          <Input
                            id="scholarshipDetails"
                            value={newStudent.scholarshipDetails}
                            onChange={(e) => setNewStudent({ ...newStudent, scholarshipDetails: e.target.value })}
                            className="border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="border-2 border-slate-300 dark:border-slate-600 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddStudent}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl"
                      >
                        {isSubmitting ? "Adding..." : "Add Student"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleAdmitCardToggle}
                  className={`${
                    admitCardEnabled
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  } text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}
                >
                  {admitCardEnabled ? "Disable Admit Card" : "Enable Admit Card"}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Students Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600 border-b-2 border-slate-200 dark:border-slate-600">
                    <TableHead className="font-bold text-slate-800 dark:text-white">Photo</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Name</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Registration No.</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Class</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Olympiad</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">School</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Date</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Father's Mobile</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Payment Status</TableHead>
                    <TableHead className="font-bold text-slate-800 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <TableCell>
                          <div className="w-12 h-12 relative overflow-hidden rounded-full ring-2 ring-cyan-200 dark:ring-cyan-700">
                            {student.photoUrl && !photoErrors[student.id] ? (
                              <Image
                                src={student.photoUrl || "/placeholder.svg"}
                                alt={student.fullName}
                                fill
                                className="object-cover"
                                onError={() => handleImageError(student.id)}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">No img</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-800 dark:text-white">
                          {student.fullName}
                        </TableCell>
                        <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                          {student.registrationNumber}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{student.class}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{student.olympiadType}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 max-w-32 truncate">
                          {student.school}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{student.registrationDate}</TableCell>
                        <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                          {student.fatherMobile}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.paymentVerified ? "default" : "secondary"}
                            className={
                              student.paymentVerified
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                                : student.paymentStatus === "submitted"
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                                  : "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg"
                            }
                          >
                            {student.paymentVerified ? (
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            ) : student.paymentStatus === "submitted" ? (
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Clock className="h-3.5 w-3.5 mr-1" />
                            )}
                            {student.paymentVerified
                              ? "Verified"
                              : student.paymentStatus === "submitted"
                                ? "Submitted"
                                : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-2 border-cyan-400 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-500 dark:text-cyan-300 dark:hover:bg-cyan-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => router.push(`/student/${student.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>

                            <PaymentDetailsPopover student={student} />

                            <AlertDialog
                              open={studentToDelete === student.id}
                              onOpenChange={(open) => !open && setStudentToDelete(null)}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-2 border-red-400 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
                                  onClick={() => setStudentToDelete(student.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-red-200 dark:border-red-700 rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-slate-800 dark:text-white">
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                    This will permanently delete the student record for {student.fullName}. This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-2 border-slate-300 dark:border-slate-600 rounded-xl">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
                                    onClick={() => handleDeleteStudent(student.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center gap-4">
                          <Users className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                          <div>
                            <h3 className="text-lg font-semibold mb-2">No students found</h3>
                            <p>
                              {searchTerm || filter !== "all"
                                ? "No students match your search criteria"
                                : "No students registered yet"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-700 dark:to-purple-700 text-white py-6 mt-12 shadow-2xl">
        <div className="container mx-auto px-4 text-center">
          <p className="text-cyan-100">© 2025 Savar Science Society. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
