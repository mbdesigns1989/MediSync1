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

/**
 * Rich multi-step intake schema — extends the base with field arrays
 * (medications, emergency contacts). This SAME schema validates on the client
 * (React Hook Form, for live UX) and on the server (the action, for security):
 * one schema, two trust levels.
 */
export const emergencyContactSchema = z.object({
  name: z.string().trim().min(2, "Contact name is required"),
  relationship: z.string().trim().min(2, "Relationship is required"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-()\s]+$/, "Phone may only contain digits and + - ( )"),
});

export const medicationSchema = z.object({
  name: z.string().trim().min(1, "Medication name is required"),
});

export const patientIntakeSchema = patientSchema.extend({
  medications: z
    .array(medicationSchema)
    .max(20, "Too many medications")
    .default([]),
  emergencyContacts: z
    .array(emergencyContactSchema)
    .min(1, "Add at least one emergency contact")
    .max(5, "Too many emergency contacts"),
});

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type MedicationInput = z.infer<typeof medicationSchema>;
/** Output (validated) type — what the server action receives. */
export type PatientIntakeInput = z.infer<typeof patientIntakeSchema>;
/** Input type — what React Hook Form holds in form state (pre-coercion). */
export type PatientIntakeFormValues = z.input<typeof patientIntakeSchema>;

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
