/**
 * Registration Number Generation Algorithm
 *
 * Format: 10 digits - ABCDEFGHIJ
 *
 * A (1st digit): Always 3 (Savar Science Society)
 * BC (2nd-3rd digits): School code
 *   01 = Central Laboratory School and College
 *   02 = Rajashon Laboratory School and College
 *   03 = Anandapur Laboratory School and College
 *   04 = Jahangirnagar Society Laboratory School and College
 *   05 = Standard Pilot School
 *   06 = Promise Residential Model School
 *   07 = Shahin School
 *   08 = Chapain New Model High School
 *   09 = New Model Pre-Cadet School And College
 *   10 = Unique School
 *   11 = Rayhan School
 *   12 = Jabal -E -Noor Dakhil Madrasa
 *   13 = Jabal -E -Noor Mahila Madrasa
 *   14 = Jabal -E -Noor Ideal Madrasa
 *   15 = Jabal -E -Noor Model Madrasa
 *   16 = Saint Joseph Hight School Rajason
 *   17 = Akrain Uccha Biddalaya
 *   18 = Hanada School
 *   19 = Udayan School
 *   20 = Savar Laboratory School and College
 *   21 = Green Bell Laboratory School and College
 *   22 = Angelica International School
 *   23 = BPATC
 *   24 = Park View School
 *   25 = Savar Model Academy
 *   26 = Sarnakali Adarsa Uccho Biddhalaya
 *   27 = Biddyakanan Pre-Cadet School
 *   28 = Gayen Bikash School
 *   29 = Child heaven School
 *   30 = Scholars School
 *   31 = Silver del School
 *   32 = Badda High School
 *   33 = Bornomala School
 *   34 = Sena Public School and College
 *   35 = Little Star School and College
 *   36 = Sunflower School and College
 *   37 = GTFC School and College 1
 *   38 = GTFC School and College 2
 *   39 = Presidency School and College
 *   40 = Amin Model Town School and College
 *   41 = Amin Cadet Academy
 *   42 = Polashbari Hazi Joynuddin School and College
 *   43 = Robi Model Academy
 *   44 = Savar Public School
 *   45 = Al-hera School
 *   46 = Savar Digital Ideal School and College
 *   47 = Merin School
 *   48 = Shaheed Majnu Academy
 *   49 = Savar Adarsha School and College
 *   50 = Savar Cantonment Board Boys High School
 *   51 = Savar Cantonment Borad Girls High School 
 *   52 = Savar Cantonment Public School And College 
 *   53 = BEPZA Public School & College
 *   54 = Morning Glory School & College
 *   DE (4th-5th digits): Class
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
  "Central Laboratory School and College": "01",
  "Rajashon Laboratory School and College": "02",
  "Anandapur Laboratory School and College": "03",
  "Jahangirnagar Society Laboratory School and College": "04",
  "Standard Pilot School": "05",
  "Promise Residential Model School": "06",
  "Shahin School": "07",
  "Chapain New Model High School": "08",
  "New Model Pre-Cadet School And College": "09",
  "Unique School": "10",
  "Rayhan School": "11",
  "Jabal -E -Noor Dakhil Madrasa": "12",
  "Jabal -E -Noor Mahila Madrasa": "13",
  "Jabal -E -Noor Ideal Madrasa": "14",
  "Jabal -E -Noor Model Madrasa": "15",
  "Saint Joseph Hight School Rajason": "16",
  "Akrain Uccha Biddalaya": "17",
  "Hanada School": "18",
  "Udayan School": "19",
  "Savar Laboratory School and College": "20",
  "Green Bell Laboratory School and College": "21",
  "Angelica International School": "22",
  "BPATC": "23",
  "Park View School": "24",
  "Savar Model Academy": "25",
  "Sarnakali Adarsa Uccho Biddhalaya": "26",
  "Biddyakanan Pre-Cadet School": "27",
  "Gayen Bikash School": "28",
  "Child heaven School": "29",
  "Scholars School": "30",
  "Silver del School": "31",
  "Badda High School": "32",
  "Bornomala School": "33",
  "Sena Public School and College": "34",
  "Little Star School and College": "35",
  "Sunflower School and College": "36",
  "GTFC School and College 1": "37",
  "GTFC School and College 2": "38",
  "Presidency School and College": "39",
  "Amin Model Town School and College": "40",
  "Amin Cadet Academy": "41",
  "Polashbari Hazi Joynuddin School and College": "42",
  "Robi Model Academy": "43",
  "Savar Public School": "44",
  "Al-hera School": "45",
  "Savar Digital Ideal School and College": "46",
  "Merin School": "47",
  "Shaheed Majnu Academy": "48",
  "Savar Adarsha School and College": "49",
  "Savar Cantonment Board Boys High School": "50",
  "Savar Cantonment Board Girls High School": "51",
  "Savar Cantonment Public School And College": "52",
  "Morning Glory School & College": "53",
  "BEPZA Public School & College": "54",
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

// Add helper function to get olympiad roll number
export function getOlympiadRoll(registrationNumber: string): string {
  if (registrationNumber.length !== 10) {
    return ""
  }
  // Remove the first digit (3) to get 9-digit olympiad roll
  return registrationNumber.substring(1)
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
      description: "Central Laboratory School and College, Class 7, Math, Male, 1st student",
      data: { school: "Central Laboratory School and College", class: "7", olympiadType: "Math", gender: "male" },
      expectedBase: "3010721",
      fullExample: "3010721001",
    },
    {
      description: "Central Laboratory School and College, Class 7, Math, Female, 1st student",
      data: { school: "Central Laboratory School and College", class: "7", olympiadType: "Math", gender: "female" },
      expectedBase: "3010722",
      fullExample: "3010722001",
    },
    {
      description: "BPATC, Class 8, Science, Male, 1st student",
      data: { school: "BPATC", class: "8", olympiadType: "Science", gender: "male" },
      expectedBase: "3230811",
      fullExample: "3230811001",
    },
    {
      description: "BPATC, Class 8, Science, Female, 1st student",
      data: { school: "BPATC", class: "8", olympiadType: "Science", gender: "female" },
      expectedBase: "3230812",
      fullExample: "3230812001",
    },
    {
      description: "Gayen Bikash School, Class 10, Physics, Male, 1st student",
      data: { school: "Gayen Bikash School", class: "10", olympiadType: "Physics", gender: "male" },
      expectedBase: "3281031",
      fullExample: "3281031001",
    },
  ]
}
