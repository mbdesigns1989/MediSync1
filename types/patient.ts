/**
 * Patient Type Definitions
 *
 * Core patient data structures used throughout MediSync AI
 */

import { z } from "zod";

/**
 * Patient intake schema — the single source of truth for validation.
 *
 * Used server-side in `app/actions.ts` (the trust boundary) and intended for
 * reuse client-side in the rich intake form (Phase 3.4): one schema, two trust
 * levels. `age` is coerced because FormData values arrive as strings.
 */
export const patientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Patient name must be at least 2 characters"),
  age: z.coerce
    .number({ message: "Age must be a number" })
    .int("Age must be a whole number")
    .min(1, "Age must be between 1 and 150")
    .max(150, "Age must be between 1 and 150"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    message: "Please select a valid gender option",
  }),
  primaryComplaint: z
    .string()
    .trim()
    .min(5, "Primary complaint must be at least 5 characters"),
});

/** Validated patient intake input (output of `patientSchema`). */
export type PatientInput = z.infer<typeof patientSchema>;

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  primaryComplaint: string;
  createdAt: Date;
}

export interface PatientVitals {
  bloodPressure: string; // e.g., "120/80"
  heartRate: number; // bpm
  temperature: number; // °F
  respiratoryRate: number; // breaths per minute
  oxygenSaturation: number; // %
}

export interface PatientDetails extends Patient {
  vitals: PatientVitals;
  clinicalNotes: string;
  medications: string[];
  lastVisit: Date;
  nextAppointment: Date | null;
}

export type PatientFormData = Omit<Patient, 'id' | 'createdAt'>;

export interface SubmitPatientResult {
  success: boolean;
  message: string;
  patient?: Patient;
  errors?: Record<string, string>;
}
