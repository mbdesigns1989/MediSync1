import { create } from "zustand";
import { Patient } from "@/types/patient";

interface PatientStore {
  patients: Patient[];
  lastAddedPatientId: string | null;
  addPatient: (patient: Patient) => void;
  removePatient: (patientId: string) => void;
  clearAllPatients: () => void;
}

/**
 * Zustand store for managing patient list
 * 
 * Persists patient data and triggers re-renders across dashboard
 * when new patients are added or removed. Tracks lastAddedPatientId
 * so other components can react to new patient additions.
 */
export const usePatientStore = create<PatientStore>((set) => ({
  patients: [
    {
      id: "PAT-001",
      name: "Sarah Johnson",
      age: 32,
      gender: "female",
      primaryComplaint: "General check-up",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "PAT-002",
      name: "Michael Chen",
      age: 45,
      gender: "male",
      primaryComplaint: "Follow-up appointment",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "PAT-003",
      name: "Emily Rodriguez",
      age: 28,
      gender: "female",
      primaryComplaint: "Lab results consultation",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  ],
  lastAddedPatientId: null,
  
  addPatient: (patient: Patient) => {
    set((state) => ({
      patients: [patient, ...state.patients], // Add to beginning for visibility
      lastAddedPatientId: patient.id, // Track the last added patient ID
    }));
  },
  
  removePatient: (patientId: string) => {
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== patientId),
    }));
  },

  clearAllPatients: () => {
    set(() => ({
      patients: [],
      lastAddedPatientId: null,
    }));
  },
}));
