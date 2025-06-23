"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { supabaseServer } from "./supabase"
import { generateRegistrationNumber, type RegistrationData, validateSubjectForClass } from "./registration"

// Function to get the last sequential number for a base registration number
async function getLastSequentialNumber(baseNumber: string): Promise<number> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Database not configured.")
      return 0
    }

    const { data: students, error } = await supabaseServer
      .from("students")
      .select("registration_number")
      .like("registration_number", `${baseNumber}%`)
      .order("registration_number", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error getting last sequential number:", error)
      return 0
    }

    if (!students || students.length === 0) {
      return 0
    }

    const lastRegistrationNumber = students[0].registration_number
    const sequentialPart = lastRegistrationNumber.substring(7, 10)
    return Number.parseInt(sequentialPart, 10) || 0
  } catch (error) {
    console.error("Error in getLastSequentialNumber:", error)
    return 0
  }
}

export async function registerStudent(formData: FormData) {
  try {
    console.log("=== REGISTRATION DEBUG START ===")

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing environment variables:")
      console.error("SUPABASE_URL:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.error("SUPABASE_SERVICE_ROLE_KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
      return {
        success: false,
        error: "Database not configured. Please add Supabase integration to continue.",
      }
    }

    console.log("Supabase environment variables are present")
    console.log("Starting student registration process with Supabase")

    // Test database connection first
    try {
      const { data: testData, error: testError } = await supabaseServer
        .from("students")
        .select("count", { count: "exact", head: true })
        .limit(1)

      if (testError) {
        console.error("Database connection test failed:", testError)
        return {
          success: false,
          error: `Database connection failed: ${testError.message}`,
        }
      }
      console.log("Database connection test successful")
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return {
        success: false,
        error: "Cannot connect to database. Please check your configuration.",
      }
    }

    console.log("Starting student registration process with Supabase")

    // Extract form data
    const class_ = formData.get("class") as string
    const olympiadType = formData.get("olympiadType") as string
    const fullName = formData.get("fullName") as string
    const fatherName = formData.get("fatherName") as string
    const motherName = formData.get("motherName") as string
    const fatherMobile = formData.get("fatherMobile") as string
    const motherMobile = formData.get("motherMobile") as string
    const address = formData.get("address") as string
    const gender = formData.get("gender") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const educationalInstitute = formData.get("educationalInstitute") as string
    const dreamUniversity = formData.get("dreamUniversity") as string
    const previousScholarship = formData.get("previousScholarship") as string
    const scholarshipDetails = formData.get("scholarshipDetails") as string
    const school = formData.get("school") as string
    const photo = formData.get("photo") as File | null
    const signature = formData.get("signature") as File | null
    const paymentNumber = formData.get("paymentNumber") as string
    const paymentTransactionId = formData.get("paymentTransactionId") as string
    const photoLink = formData.get("photoLink") as string
    const signatureLink = formData.get("signatureLink") as string

    console.log("=== EXTRACTED FORM DATA ===")
    console.log("School:", school)
    console.log("Class:", class_)
    console.log("Olympiad Type:", olympiadType)
    console.log("Full Name:", fullName)
    console.log("Father Name:", fatherName)
    console.log("Mother Name:", motherName)
    console.log("Father Mobile:", fatherMobile)
    console.log("Mother Mobile:", motherMobile)
    console.log("Address:", address)
    console.log("Gender:", gender)
    console.log("Date of Birth:", dateOfBirth)
    console.log("Educational Institute:", educationalInstitute)
    console.log("Dream University:", dreamUniversity)
    console.log("Previous Scholarship:", previousScholarship)
    console.log("Scholarship Details:", scholarshipDetails)
    console.log("Payment Number:", paymentNumber)
    console.log("Payment Transaction ID:", paymentTransactionId)
    console.log("Has Photo:", !!photo, "Size:", photo?.size || 0)
    console.log("Has Signature:", !!signature, "Size:", signature?.size || 0)

    // Validate required fields
    if (
      !class_ ||
      !olympiadType ||
      !fullName ||
      !fatherName ||
      !motherName ||
      !fatherMobile ||
      !address ||
      !gender ||
      !dateOfBirth ||
      !educationalInstitute ||
      !dreamUniversity ||
      !previousScholarship ||
      !school ||
      !paymentNumber ||
      !paymentTransactionId
    ) {
      console.error("Missing required fields")
      return { success: false, error: "Missing required fields including payment information" }
    }

    // Validate subject for class
    if (!validateSubjectForClass(class_, olympiadType)) {
      return {
        success: false,
        error: `${olympiadType} is not available for class ${class_}. Please select a valid subject.`,
      }
    }

    // Check for duplicate registration
    try {
      const { data: existingStudents, error: checkError } = await supabaseServer
        .from("students")
        .select("id")
        .eq("full_name", fullName)
        .eq("father_mobile", fatherMobile)

      if (checkError) {
        console.error("Error checking for duplicate registration:", checkError)
      } else if (existingStudents && existingStudents.length > 0) {
        console.error("Duplicate registration found")
        return {
          success: false,
          error: "A student with this name and mobile number is already registered",
        }
      }
    } catch (error) {
      console.error("Error checking for duplicate registration:", error)
      // Continue with registration even if duplicate check fails
    }

    // Generate registration number using the new algorithm
    const registrationData: RegistrationData = {
      school,
      class: class_,
      olympiadType,
      gender,
    }

    let registrationNumber: string
    try {
      registrationNumber = await generateRegistrationNumber(registrationData, getLastSequentialNumber)
      console.log("Generated registration number:", registrationNumber)
    } catch (error) {
      console.error("Error generating registration number:", error)
      return { success: false, error: "Failed to generate registration number" }
    }

    const photoUrl = photoLink?.trim() !== "" ? photoLink.trim() : "/placeholder.svg?height=200&width=150"
    const signatureUrl = signatureLink?.trim() !== "" ? signatureLink.trim() : "/placeholder.svg?height=80&width=300"

    console.log("=== CREATING STUDENT RECORD ===")
    console.log("Registration Number:", registrationNumber)
    console.log("Photo URL:", photoUrl)
    console.log("Signature URL:", signatureUrl)
    console.log("Payment Number:", paymentNumber)
    console.log("Payment Transaction ID:", paymentTransactionId)

    const studentData = {
      class: class_,
      olympiad_type: olympiadType,
      full_name: fullName,
      father_name: fatherName,
      mother_name: motherName,
      father_mobile: fatherMobile,
      mother_mobile: motherMobile || null,
      address,
      gender,
      date_of_birth: dateOfBirth,
      educational_institute: educationalInstitute,
      dream_university: dreamUniversity,
      previous_scholarship: previousScholarship,
      scholarship_details: previousScholarship === "yes" ? scholarshipDetails : null,
      school: school,
      photo_url: photoUrl,
      signature_url: signatureUrl,
      registration_number: registrationNumber,
      payment_status: "submitted", // Changed from "pending" to "submitted"
      payment_number: paymentNumber,
      payment_transaction_id: paymentTransactionId,
      payment_verified: false,
    }

    console.log("Student data to insert:", JSON.stringify(studentData, null, 2))

    // Create student record in Supabase
    const { data: student, error: insertError } = await supabaseServer
      .from("students")
      .insert(studentData)
      .select("id")
      .single()

    console.log("Insert result - Data:", student)
    console.log("Insert result - Error:", insertError)

    if (insertError) {
      console.error("Database insert failed:", insertError)
      return {
        success: false,
        error: `Failed to save registration: ${insertError.message}`,
      }
    }

    console.log("Student registered successfully with ID:", student?.id)

    console.log("=== REGISTRATION SUCCESS ===")
    console.log("Student ID:", student?.id)
    console.log("Registration Number:", registrationNumber)
    console.log("=== REGISTRATION DEBUG END ===")

    // Force revalidation of relevant paths
    revalidatePath("/")
    revalidatePath(`/student/${student?.id}`)
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      studentId: student?.id,
      registrationNumber,
      message: "Registration successful",
    }
  } catch (error) {
    console.error("=== REGISTRATION ERROR ===")
    console.error("Error details:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return {
      success: false,
      error: "Failed to register student. Please try again.",
    }
  }
}

export async function getStudentById(id: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    const { data: student, error } = await supabaseServer.from("students").select("*").eq("id", id).single()

    if (error || !student) {
      return { success: false, error: "Student not found" }
    }

    return {
      success: true,
      student: {
        ...student,
        id: student.id,
        class: student.class,
        olympiadType: student.olympiad_type,
        fullName: student.full_name,
        fatherName: student.father_name,
        motherName: student.mother_name,
        fatherMobile: student.father_mobile,
        motherMobile: student.mother_mobile,
        dateOfBirth: student.date_of_birth,
        educationalInstitute: student.educational_institute,
        dreamUniversity: student.dream_university,
        previousScholarship: student.previous_scholarship,
        scholarshipDetails: student.scholarship_details,
        school: student.school,
        photoUrl: student.photo_url,
        signatureUrl: student.signature_url,
        registrationNumber: student.registration_number,
        registrationDate: new Date(student.registration_date).toISOString().split("T")[0],
        paymentStatus: student.payment_status,
        paymentNumber: student.payment_number,
        paymentTransactionId: student.payment_transaction_id,
        paymentVerified: student.payment_verified,
      },
    }
  } catch (error) {
    console.error("Error fetching student:", error)
    return { success: false, error: "Failed to fetch student data" }
  }
}

export async function getStudentByRegistrationNumber(registrationNumber: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    const { data: student, error } = await supabaseServer
      .from("students")
      .select("*")
      .eq("registration_number", registrationNumber)
      .single()

    if (error || !student) {
      return { success: false, error: "Student not found" }
    }

    return {
      success: true,
      student: {
        ...student,
        id: student.id,
        class: student.class,
        olympiadType: student.olympiad_type,
        fullName: student.full_name,
        fatherName: student.father_name,
        motherName: student.mother_name,
        fatherMobile: student.father_mobile,
        motherMobile: student.mother_mobile,
        dateOfBirth: student.date_of_birth,
        educationalInstitute: student.educational_institute,
        dreamUniversity: student.dream_university,
        previousScholarship: student.previous_scholarship,
        scholarshipDetails: student.scholarship_details,
        school: student.school,
        photoUrl: student.photo_url,
        signatureUrl: student.signature_url,
        registrationNumber: student.registration_number,
        registrationDate: new Date(student.registration_date).toISOString().split("T")[0],
        paymentStatus: student.payment_status,
        paymentNumber: student.payment_number,
        paymentTransactionId: student.payment_transaction_id,
        paymentVerified: student.payment_verified,
      },
    }
  } catch (error) {
    console.error("Error fetching student by registration number:", error)
    return { success: false, error: "Failed to fetch student data" }
  }
}

export async function getAllStudents() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured", students: [] }
    }
    const { data: students, error } = await supabaseServer
      .from("students")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      students: students.map((student) => ({
        id: student.id,
        fullName: student.full_name,
        class: student.class,
        olympiadType: student.olympiad_type,
        registrationNumber: student.registration_number,
        registrationDate: new Date(student.registration_date).toISOString().split("T")[0],
        paymentStatus: student.payment_status,
        paymentVerified: student.payment_verified,
        paymentNumber: student.payment_number,
        paymentTransactionId: student.payment_transaction_id,
        fatherMobile: student.father_mobile,
        school: student.school,
        photoUrl: student.photo_url,
      })),
    }
  } catch (error) {
    console.error("Error fetching students:", error)
    return { success: false, error: "Failed to fetch students" }
  }
}

export async function verifyPayment(id: string, verified: boolean, adminUsername?: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }

    const updateData: any = {
      payment_verified: verified,
      payment_status: verified ? "verified" : "submitted",
      payment_verified_at: verified ? new Date().toISOString() : null,
    }

    if (adminUsername) {
      updateData.payment_verified_by = adminUsername
    }

    const { error } = await supabaseServer.from("students").update(updateData).eq("id", id)

    if (error) {
      return { success: false, error: "Student not found or update failed" }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath(`/student/${id}`)

    return {
      success: true,
      message: `Payment ${verified ? "verified" : "rejected"} successfully`,
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return { success: false, error: "Failed to verify payment" }
  }
}

export async function updatePaymentStatus(id: string, status: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    const { error } = await supabaseServer.from("students").update({ payment_status: status }).eq("id", id)

    if (error) {
      return { success: false, error: "Student not found or update failed" }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, message: "Payment status updated successfully" }
  } catch (error) {
    console.error("Error updating payment status:", error)
    return { success: false, error: "Failed to update payment status" }
  }
}

export async function deleteStudent(id: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    // First get the student to get file paths
    const { data: student, error: getError } = await supabaseServer
      .from("students")
      .select("registration_number, photo_url, signature_url")
      .eq("id", id)
      .single()

    if (getError) {
      console.error("Error fetching student for deletion:", getError)
    } else if (student) {
      // Delete files from storage if they exist
      if (student.photo_url && !student.photo_url.includes("placeholder")) {
        const photoPath = student.photo_url.split("/").pop() // Get filename from URL
        if (photoPath) {
          await supabaseServer.storage.from("student-photos").remove([photoPath])
        }
      }

      if (student.signature_url && !student.signature_url.includes("placeholder")) {
        const signaturePath = student.signature_url.split("/").pop() // Get filename from URL
        if (signaturePath) {
          await supabaseServer.storage.from("student-signatures").remove([signaturePath])
        }
      }
    }

    // Delete the student record
    const { error } = await supabaseServer.from("students").delete().eq("id", id)

    if (error) {
      return { success: false, error: "Failed to delete student" }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, message: "Student deleted successfully" }
  } catch (error) {
    console.error("Error deleting student:", error)
    return { success: false, error: "Failed to delete student" }
  }
}

export async function addStudent(studentData: any) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    // Validate subject for class
    if (!validateSubjectForClass(studentData.class, studentData.olympiadType)) {
      return {
        success: false,
        error: `${studentData.olympiadType} is not available for class ${studentData.class}. Please select a valid subject.`,
      }
    }

    // Generate registration number using the new algorithm
    const registrationData: RegistrationData = {
      school: studentData.school,
      class: studentData.class,
      olympiadType: studentData.olympiadType,
      gender: studentData.gender,
    }

    let registrationNumber: string
    try {
      registrationNumber = await generateRegistrationNumber(registrationData, getLastSequentialNumber)
    } catch (error) {
      console.error("Error generating registration number:", error)
      return { success: false, error: "Failed to generate registration number" }
    }

    // Insert the student record
    const { data: student, error: insertError } = await supabaseServer
      .from("students")
      .insert({
        class: studentData.class,
        olympiad_type: studentData.olympiadType,
        full_name: studentData.fullName,
        father_name: studentData.fatherName,
        mother_name: studentData.motherName,
        father_mobile: studentData.fatherMobile,
        mother_mobile: studentData.motherMobile || null,
        address: studentData.address,
        gender: studentData.gender,
        date_of_birth: studentData.dateOfBirth,
        educational_institute: studentData.educationalInstitute,
        dream_university: studentData.dreamUniversity,
        previous_scholarship: studentData.previousScholarship,
        scholarship_details: studentData.previousScholarship === "yes" ? studentData.scholarshipDetails : null,
        school: studentData.school,
        photo_url: "/placeholder.svg?height=200&width=150", // Default placeholder
        signature_url: "/placeholder.svg?height=80&width=300", // Default placeholder
        registration_number: registrationNumber,
        payment_status: "pending",
        payment_verified: false,
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("Error inserting student:", insertError)
      return { success: false, error: "Failed to add student. Please try again." }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, studentId: student?.id, message: "Student added successfully" }
  } catch (error) {
    console.error("Error adding student:", error)
    return { success: false, error: "Failed to add student. Please try again." }
  }
}

// Settings management functions
export async function getAdmitCardSetting() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured", enabled: false }
    }
    const { data: setting, error } = await supabaseServer
      .from("settings")
      .select("value")
      .eq("id", "admit_card")
      .single()

    if (error) {
      console.error("Error fetching admit card setting:", error)
      return { success: false, enabled: false }
    }

    return {
      success: true,
      enabled: setting?.value?.enabled || false,
    }
  } catch (error) {
    console.error("Error in getAdmitCardSetting:", error)
    return { success: false, enabled: false }
  }
}

export async function updateAdmitCardSetting(enabled: boolean) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    const { error } = await supabaseServer.from("settings").upsert({
      id: "admit_card",
      value: { enabled },
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating admit card setting:", error)
      return { success: false, error: "Failed to update setting" }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath("/admit-card")

    return { success: true, message: `Admit card ${enabled ? "enabled" : "disabled"} successfully` }
  } catch (error) {
    console.error("Error in updateAdmitCardSetting:", error)
    return { success: false, error: "Failed to update setting" }
  }
}

export async function adminLogin(formData: FormData) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Database not configured" }
    }
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      return { success: false, error: "Username and password are required" }
    }

    // Verify admin credentials
    const { data: admin, error } = await supabaseServer
      .from("admins")
      .select("username, name")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (error || !admin) {
      return { success: false, error: "Invalid username or password" }
    }

    // Set a cookie to maintain the session
    cookies().set(
      "admin_session",
      JSON.stringify({
        username: admin.username,
        name: admin.name,
        loggedIn: true,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      },
    )

    return { success: true, admin }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

export async function adminLogout() {
  try {
    // Clear the admin session cookie
    cookies().set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Logout failed" }
  }
}

export async function getAdminSession() {
  try {
    const session = cookies().get("admin_session")

    if (!session) {
      return { success: false, loggedIn: false }
    }

    const sessionData = JSON.parse(session.value)

    return {
      success: true,
      loggedIn: sessionData.loggedIn,
      admin: {
        username: sessionData.username,
        name: sessionData.name,
      },
    }
  } catch (error) {
    console.error("Session error:", error)
    return { success: false, loggedIn: false }
  }
}

export async function getAdminStats() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        success: false,
        error: "Database not configured",
        stats: {
          totalRegistered: 0,
          totalVerified: 0,
          totalSubmitted: 0,
          totalPending: 0,
        },
      }
    }
    // Get total registered students
    const { count: totalRegistered, error: countError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    // Get total verified students
    const { count: totalVerified, error: verifiedError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("payment_verified", true)

    if (verifiedError) throw verifiedError

    // Get total submitted students (payment submitted but not verified)
    const { count: totalSubmitted, error: submittedError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "submitted")
      .eq("payment_verified", false)

    if (submittedError) throw submittedError

    // Get total pending students (no payment info submitted)
    const { count: totalPending, error: pendingError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "pending")

    if (pendingError) throw pendingError

    return {
      success: true,
      stats: {
        totalRegistered: totalRegistered || 0,
        totalVerified: totalVerified || 0,
        totalSubmitted: totalSubmitted || 0,
        totalPending: totalPending || 0,
      },
    }
  } catch (error) {
    console.error("Stats error:", error)
    return {
      success: false,
      error: "Failed to fetch stats",
      stats: {
        totalRegistered: 0,
        totalVerified: 0,
        totalSubmitted: 0,
        totalPending: 0,
      },
    }
  }
}
