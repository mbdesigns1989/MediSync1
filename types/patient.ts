/**
 * Patient Type Definitions
 * 
 * Core patient data structures used throughout MediSync AI
 */

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
