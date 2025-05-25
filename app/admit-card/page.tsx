import { parseRegistrationNumber, getOlympiadRoll } from "@/lib/registration"

interface StudentData {
  registrationNumber: string
  fullName: string
  fatherName: string
  class: string
  olympiadType: string
  school: string
  fatherMobile: string
  gender: string
  photoUrl: string
}

const generateAdmitCardHTML = (student: StudentData) => {
  const parsedRegNumber = parseRegistrationNumber(student.registrationNumber)
  const olympiadRoll = getOlympiadRoll(student.registrationNumber)

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
                <span class="info-label">Olympiad Roll:</span>
                <span class="info-value">${olympiadRoll}</span>
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
                <span class="info-label">Institute:</span>
                <span class="info-value">${student.school}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Center:</span>
                <span class="info-value">Savar Model College</span>
              </div>
              <div class="info-row">
                <span class="info-label">Shift:</span>
                <span class="info-value">N/A</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span class="info-value">N/A</span>
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

const AdmitCardPage = async ({ searchParams }: { searchParams: { registrationNumber: string } }) => {
  const registrationNumber = searchParams.registrationNumber

  // Dummy student data (replace with actual data fetching)
  const studentData: StudentData = {
    registrationNumber: registrationNumber,
    fullName: "John Doe",
    fatherName: "David Doe",
    class: "10",
    olympiadType: "Math",
    school: "Example High School",
    fatherMobile: "123-456-7890",
    gender: "Male",
    photoUrl: "https://via.placeholder.com/120x150", // Replace with actual photo URL
  }

  const admitCardHTML = generateAdmitCardHTML(studentData)

  return <div dangerouslySetInnerHTML={{ __html: admitCardHTML }} />
}

export default AdmitCardPage
