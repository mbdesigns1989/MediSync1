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

export type PatientFormData = Omit<Patient, 'id' | 'createdAt'>;

export interface SubmitPatientResult {
  success: boolean;
  message: string;
  patient?: Patient;
  errors?: Record<string, string>;
}
