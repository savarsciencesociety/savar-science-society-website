/**
 * Registration Number Generation Algorithm
 *
 * Format: 10 digits - ABCDEFGHIJ
 *
 * A (1st digit): Always 3 (Savar Science Society)
 * BC (2nd-3rd digits): School code
 *   01 = SCPSC
 *   02 = JUSC
 *   03 = BPATC
 *   04 = GBS
 *   05 = SCLS
 * DE (4th-5th digits): Class
 *   05 = Class 5
 *   06 = Class 6
 *   07 = Class 7
 *   08 = Class 8
 *   09 = Class 9
 *   10 = Class 10
 * F (6th digit): Subject
 *   1 = Science (available for classes 5-8)
 *   2 = Math (available for classes 5-10)
 *   3 = Physics (available for classes 9-10)
 * G (7th digit): Gender
 *   1 = Male
 *   2 = Female
 * HIJ (8th-10th digits): Sequential number (001-999)
 */

export interface RegistrationData {
  school: string
  class: string
  olympiadType: string
  gender: string
}

export const SCHOOL_CODES = {
  SCPSC: "01",
  JUSC: "02",
  BPATC: "03",
  GBS: "04",
  SCLS: "05",
} as const

export const SUBJECT_CODES = {
  Science: "1",
  Math: "2",
  Physics: "3",
} as const

export const GENDER_CODES = {
  male: "1",
  female: "2",
} as const

export const CLASS_CODES = {
  "5": "05",
  "6": "06",
  "7": "07",
  "8": "08",
  "9": "09",
  "10": "10",
} as const

/**
 * Validates if the subject is available for the given class
 */
export function validateSubjectForClass(classNum: string, subject: string): boolean {
  const classNumber = Number.parseInt(classNum)

  switch (subject) {
    case "Science":
      return classNumber >= 5 && classNumber <= 8
    case "Math":
      return classNumber >= 5 && classNumber <= 10
    case "Physics":
      return classNumber >= 9 && classNumber <= 10
    default:
      return false
  }
}

/**
 * Gets available subjects for a given class
 */
export function getAvailableSubjects(classNum: string): string[] {
  const classNumber = Number.parseInt(classNum)

  if (classNumber >= 5 && classNumber <= 8) {
    return ["Science", "Math"]
  } else if (classNumber >= 9 && classNumber <= 10) {
    return ["Math", "Physics"]
  }

  return []
}

/**
 * Generates the base registration number without the sequential part
 */
export function generateBaseRegistrationNumber(data: RegistrationData): string {
  const schoolCode = SCHOOL_CODES[data.school as keyof typeof SCHOOL_CODES]
  const classCode = CLASS_CODES[data.class as keyof typeof CLASS_CODES]
  const subjectCode = SUBJECT_CODES[data.olympiadType as keyof typeof SUBJECT_CODES]
  const genderCode = GENDER_CODES[data.gender as keyof typeof GENDER_CODES]

  if (!schoolCode || !classCode || !subjectCode || !genderCode) {
    throw new Error("Invalid registration data provided")
  }

  // Validate subject for class
  if (!validateSubjectForClass(data.class, data.olympiadType)) {
    throw new Error(`${data.olympiadType} is not available for class ${data.class}`)
  }

  return `3${schoolCode}${classCode}${subjectCode}${genderCode}`
}

/**
 * Generates the full registration number with sequential number
 */
export async function generateRegistrationNumber(
  data: RegistrationData,
  getLastSequentialNumber: (baseNumber: string) => Promise<number>,
): Promise<string> {
  const baseNumber = generateBaseRegistrationNumber(data)
  const lastSequential = await getLastSequentialNumber(baseNumber)
  const nextSequential = lastSequential + 1

  if (nextSequential > 999) {
    throw new Error("Maximum registrations reached for this category")
  }

  const sequentialPart = nextSequential.toString().padStart(3, "0")
  return `${baseNumber}${sequentialPart}`
}

/**
 * Parses a registration number to extract its components
 */
export function parseRegistrationNumber(registrationNumber: string): {
  organization: string
  school: string
  class: string
  subject: string
  gender: string
  sequential: string
} | null {
  if (registrationNumber.length !== 10) {
    return null
  }

  const organization = registrationNumber[0]
  const schoolCode = registrationNumber.substring(1, 3)
  const classCode = registrationNumber.substring(3, 5)
  const subjectCode = registrationNumber[5]
  const genderCode = registrationNumber[6]
  const sequential = registrationNumber.substring(7, 10)

  // Reverse lookup
  const school =
    Object.keys(SCHOOL_CODES).find((key) => SCHOOL_CODES[key as keyof typeof SCHOOL_CODES] === schoolCode) || "Unknown"
  const classNum =
    Object.keys(CLASS_CODES).find((key) => CLASS_CODES[key as keyof typeof CLASS_CODES] === classCode) || "Unknown"
  const subject =
    Object.keys(SUBJECT_CODES).find((key) => SUBJECT_CODES[key as keyof typeof SUBJECT_CODES] === subjectCode) ||
    "Unknown"
  const gender =
    Object.keys(GENDER_CODES).find((key) => GENDER_CODES[key as keyof typeof GENDER_CODES] === genderCode) || "Unknown"

  return {
    organization: organization === "3" ? "Savar Science Society" : "Unknown",
    school,
    class: classNum,
    subject,
    gender,
    sequential,
  }
}

/**
 * Example usage and test cases
 */
export function getRegistrationExamples(): Array<{
  description: string
  data: RegistrationData
  expectedBase: string
  fullExample: string
}> {
  return [
    {
      description: "SCPSC, Class 7, Math, Male, 1st student",
      data: { school: "SCPSC", class: "7", olympiadType: "Math", gender: "male" },
      expectedBase: "3010721",
      fullExample: "3010721001",
    },
    {
      description: "SCPSC, Class 7, Math, Female, 1st student",
      data: { school: "SCPSC", class: "7", olympiadType: "Math", gender: "female" },
      expectedBase: "3010722",
      fullExample: "3010722001",
    },
    {
      description: "BPATC, Class 8, Science, Male, 1st student",
      data: { school: "BPATC", class: "8", olympiadType: "Science", gender: "male" },
      expectedBase: "3030811",
      fullExample: "3030811001",
    },
    {
      description: "BPATC, Class 8, Science, Female, 1st student",
      data: { school: "BPATC", class: "8", olympiadType: "Science", gender: "female" },
      expectedBase: "3030812",
      fullExample: "3030812001",
    },
    {
      description: "GBS, Class 10, Physics, Male, 1st student",
      data: { school: "GBS", class: "10", olympiadType: "Physics", gender: "male" },
      expectedBase: "3041031",
      fullExample: "3041031001",
    },
  ]
}
