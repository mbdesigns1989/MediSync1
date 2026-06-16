/**
 * Appointment Type Definitions
 *
 * The drag-and-drop board organizes appointments into status columns.
 */

export const APPOINTMENT_STATUSES = [
  "Waiting",
  "In Progress",
  "Completed",
  "Scheduled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface Appointment {
  id: string;
  reason: string;
  status: AppointmentStatus;
  position: number;
  patientId: string;
  patientName: string;
  createdAt: Date;
}
