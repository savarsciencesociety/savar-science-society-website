"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { SCHOOL_CODES } from "@/lib/registration"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  class: z.string().min(1, {
    message: "Class must be at least 1 characters.",
  }),
  olympiadType: z.string().min(2, {
    message: "Olympiad Type must be at least 2 characters.",
  }),
  fatherName: z.string().min(2, {
    message: "Father's Name must be at least 2 characters.",
  }),
  motherName: z.string().min(2, {
    message: "Mother's Name must be at least 2 characters.",
  }),
  fatherMobile: z.string().min(10, {
    message: "Father's Mobile must be at least 10 characters.",
  }),
  motherMobile: z.string().optional(),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  gender: z.string(),
  dateOfBirth: z.string(),
  school: z.string().min(2, {
    message: "School must be at least 2 characters.",
  }),
  dreamUniversity: z.string(),
  previousScholarship: z.string(),
  scholarshipDetails: z.string().optional(),
})

const AdminDashboard = () => {
  const router = useRouter()
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
    school: "", // Changed from educationalInstitute
    dreamUniversity: "General",
    previousScholarship: "no",
    scholarshipDetails: "",
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      school: "",
      dreamUniversity: "General",
      previousScholarship: "no",
      scholarshipDetails: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const addStudent = async () => {
    const requiredFields = [
      "fullName",
      "class",
      "olympiadType",
      "fatherName",
      "motherName",
      "fatherMobile",
      "address",
      "dateOfBirth",
      "school", // Changed from educationalInstitute to school
      "dreamUniversity",
    ]

    for (const field of requiredFields) {
      if (!newStudent[field as keyof typeof newStudent]) {
        toast({
          title: "Error!",
          description: `Please fill in all required fields. ${field} is missing`,
        })
        return
      }
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Student added successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error!",
          description: "Failed to add student.",
        })
      }
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error!",
        description: "Failed to add student.",
      })
    }
  }

  return (
    <div className="container max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={newStudent.fullName}
                onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Input
                id="class"
                value={newStudent.class}
                onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="olympiadType">Olympiad Type *</Label>
              <Input
                id="olympiadType"
                value={newStudent.olympiadType}
                onChange={(e) => setNewStudent({ ...newStudent, olympiadType: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={newStudent.fatherName}
                onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                value={newStudent.motherName}
                onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherMobile">Father's Mobile *</Label>
              <Input
                id="fatherMobile"
                value={newStudent.fatherMobile}
                onChange={(e) => setNewStudent({ ...newStudent, fatherMobile: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherMobile">Mother's Mobile</Label>
              <Input
                id="motherMobile"
                value={newStudent.motherMobile}
                onChange={(e) => setNewStudent({ ...newStudent, motherMobile: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={newStudent.address}
                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                defaultValue="male"
                className="flex"
                onValueChange={(value) => setNewStudent({ ...newStudent, gender: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="r1" />
                  <Label htmlFor="r1">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="r2" />
                  <Label htmlFor="r2">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="r3" />
                  <Label htmlFor="r3">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !newStudent.dateOfBirth && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newStudent.dateOfBirth ? (
                      format(new Date(newStudent.dateOfBirth), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newStudent.dateOfBirth ? new Date(newStudent.dateOfBirth) : undefined}
                    onSelect={(date) =>
                      setNewStudent({
                        ...newStudent,
                        dateOfBirth: date?.toISOString() || "",
                      })
                    }
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School/Institution *</Label>
              <Select
                value={newStudent.school}
                onValueChange={(value) => setNewStudent({ ...newStudent, school: value })}
              >
                <SelectTrigger id="school">
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

            <div className="space-y-2">
              <Label htmlFor="dreamUniversity">Dream University *</Label>
              <Select
                value={newStudent.dreamUniversity}
                onValueChange={(value) => setNewStudent({ ...newStudent, dreamUniversity: value })}
              >
                <SelectTrigger id="dreamUniversity">
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="BUET">BUET</SelectItem>
                  <SelectItem value="DU">DU</SelectItem>
                  <SelectItem value="Jahangirnagar University">Jahangirnagar University</SelectItem>
                  <SelectItem value="Medical College">Medical College</SelectItem>
                  <SelectItem value="IUT">IUT</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousScholarship">Previous Scholarship</Label>
              <Select
                value={newStudent.previousScholarship}
                onValueChange={(value) => setNewStudent({ ...newStudent, previousScholarship: value })}
              >
                <SelectTrigger id="previousScholarship">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newStudent.previousScholarship === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="scholarshipDetails">Scholarship Details</Label>
                <Textarea
                  id="scholarshipDetails"
                  placeholder="Details about previous scholarship"
                  value={newStudent.scholarshipDetails || ""}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      scholarshipDetails: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>

          <Button type="button" className="w-full" onClick={addStudent}>
            Add Student
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AdminDashboard
