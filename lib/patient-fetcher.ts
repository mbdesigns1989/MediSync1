import { cache } from "react"
import { PatientDetails } from "@/types/patient"

/**
 * Simulates fetching patient details from a database with a 2.5 second delay.
 * Server-only, used with Next.js 16 / React 19 streaming.
 *
 * Wrapped in React `cache` so a single request that calls it more than once
 * (e.g. `generateMetadata` + the page itself) shares one result instead of
 * paying the delay twice.
 */
export const getPatientDetails = cache(
  async (id: string): Promise<PatientDetails> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2500))

  // Mock data - in a real app, this would come from a database
  const mockPatient: PatientDetails = {
    id,
    name: "Sarah Johnson",
    age: 32,
    gender: "female",
    primaryComplaint: "General check-up with focus on blood pressure monitoring",
    createdAt: new Date("2024-01-15"),
    vitals: {
      bloodPressure: "118/76",
      heartRate: 72,
      temperature: 98.6,
      respiratoryRate: 16,
      oxygenSaturation: 98,
    },
    clinicalNotes:
      "Patient reports feeling generally well. No acute complaints. Blood pressure stable. Continue current lifestyle modifications. Advised to increase water intake and maintain regular exercise routine. Follow up in 3 months.",
    medications: ["Lisinopril 10mg daily", "Aspirin 81mg daily"],
    lastVisit: new Date("2026-04-10"),
    nextAppointment: new Date("2026-06-10"),
  }

  // Simulate patient variation based on ID (matches the seed IDs in store/patients.ts)
  if (id === "PAT-002") {
    mockPatient.name = "Michael Chen"
    mockPatient.age = 45
    mockPatient.gender = "male"
    mockPatient.primaryComplaint = "Cardiac consultation"
    mockPatient.vitals.heartRate = 85
    mockPatient.vitals.bloodPressure = "135/85"
    mockPatient.vitals.respiratoryRate = 18
    mockPatient.clinicalNotes =
      "Patient presents with elevated blood pressure. Recent ECG shows normal sinus rhythm. Recommend medication adjustment and stress management program."
    mockPatient.medications = [
      "Metoprolol 50mg daily",
      "Lisinopril 20mg daily",
      "Atorvastatin 40mg daily",
    ]
  } else if (id === "PAT-003") {
    mockPatient.name = "Emily Rodriguez"
    mockPatient.age = 28
    mockPatient.gender = "female"
    mockPatient.primaryComplaint = "Post-surgery follow-up"
    mockPatient.vitals.temperature = 98.2
    mockPatient.vitals.heartRate = 68
    mockPatient.vitals.respiratoryRate = 15
    mockPatient.clinicalNotes =
      "Recovery proceeding well. Incision healing nicely with no signs of infection. Pain well-controlled on current medication. Patient cleared for light activity."
    mockPatient.medications = ["Amoxicillin 500mg 3x daily for 5 more days"]
  }

  return mockPatient
  }
)
