import "server-only"
import { cache } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PatientDetails } from "@/types/patient"

/**
 * Fetch a patient's full profile for the detail page.
 *
 * The base record (name, age, gender, complaint, medications) comes from the DB.
 * Vitals / clinical notes / appointment dates aren't modeled in the schema, so
 * they're synthesized here for the demo — deterministically derived from the id
 * so each patient shows stable (not random) numbers.
 *
 * Wrapped in React `cache` so `generateMetadata` and the page share one DB read.
 */
export const getPatientDetails = cache(
  async (id: string): Promise<PatientDetails> => {
    const row = await prisma.patient.findUnique({ where: { id } })
    if (!row) {
      notFound()
    }

    const medications: string[] = row.medications
      ? safeParseStringArray(row.medications)
      : []

    // Deterministic pseudo-vitals from the id so the page is stable across loads.
    const seed = hashString(row.id)
    const vitals = {
      bloodPressure: `${110 + (seed % 30)}/${70 + (seed % 20)}`,
      heartRate: 60 + (seed % 30),
      temperature: Number((97.8 + (seed % 15) / 10).toFixed(1)),
      respiratoryRate: 14 + (seed % 6),
      oxygenSaturation: 95 + (seed % 5),
    }

    return {
      id: row.id,
      name: row.name,
      age: row.age,
      gender: row.gender as PatientDetails["gender"],
      primaryComplaint: row.primaryComplaint,
      createdAt: row.createdAt,
      vitals,
      clinicalNotes:
        "Patient reports feeling generally well. Vitals within expected range. Continue current care plan and follow up as scheduled.",
      medications:
        medications.length > 0 ? medications : ["No active medications on file"],
      lastVisit: row.createdAt,
      nextAppointment: null,
    }
  }
)

function safeParseStringArray(json: string): string[] {
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}
