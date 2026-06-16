import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Patient } from "@/types/patient";

interface PatientStore {
  patients: Patient[];
  lastAddedPatientId: string | null;
  isHydrated: boolean;
  addPatient: (patient: Patient) => void;
  removePatient: (patientId: string) => void;
  clearAllPatients: () => void;
}

/**
 * Zustand store for managing patient list with localStorage persistence
 * 
 * Features:
 * - Persists patient data to localStorage using zustand persist middleware
 * - Handles hydration errors in Next.js with isHydrated flag
 * - Triggers re-renders across dashboard when patients are added/removed
 * - Tracks lastAddedPatientId for component reactions to new additions
 * - Optimized for performance on lower-end hardware
 */
export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      patients: [
        {
          id: "PAT-001",
          name: "Sarah Johnson",
          age: 32,
          gender: "female",
          primaryComplaint: "General check-up",
          // Fixed ISO timestamp (not Date.now()) so the server and client render
          // identical values — avoids React hydration mismatches.
          createdAt: new Date("2026-06-14T08:00:00.000Z"),
        },
        {
          id: "PAT-002",
          name: "Michael Chen",
          age: 45,
          gender: "male",
          primaryComplaint: "Follow-up appointment",
          createdAt: new Date("2026-06-14T09:00:00.000Z"),
        },
        {
          id: "PAT-003",
          name: "Emily Rodriguez",
          age: 28,
          gender: "female",
          primaryComplaint: "Lab results consultation",
          createdAt: new Date("2026-06-14T09:30:00.000Z"),
        },
      ],
      lastAddedPatientId: null,
      isHydrated: false,

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
    }),
    {
      name: "patient-store", // localStorage key
      partialize: (state) => ({
        patients: state.patients,
        lastAddedPatientId: state.lastAddedPatientId,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.isHydrated = true;
          }
        };
      },
    }
  )
);
