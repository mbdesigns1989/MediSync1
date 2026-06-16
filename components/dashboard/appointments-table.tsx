"use client"

import { useMemo, useTransition } from "react"
import Link from "next/link"
import type { Patient } from "@/types/patient"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { EmptyState } from "./empty-state"
import { SearchEmptyState } from "./search-empty-state"
import { deletePatient } from "@/app/actions"
import { Trash2 } from "lucide-react"

type Status = "In Progress" | "Waiting" | "Completed" | "Scheduled"

interface Appointment {
  id: string
  patientName: string
  appointmentTime: string
  reason: string
  status: Status
  isCustomPatient?: boolean
  /** Real patient record ID — present only for rows with a detail page. */
  patientId?: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    appointmentTime: "10:30 AM",
    reason: "Check-up",
    status: "In Progress",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    appointmentTime: "11:15 AM",
    reason: "Surgery Prep",
    status: "Waiting",
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    appointmentTime: "12:00 PM",
    reason: "Follow-up Consultation",
    status: "Scheduled",
  },
  {
    id: "4",
    patientName: "David Brown",
    appointmentTime: "1:45 PM",
    reason: "Injection",
    status: "Completed",
  },
  {
    id: "5",
    patientName: "Lisa Anderson",
    appointmentTime: "2:30 PM",
    reason: "Lab Results Review",
    status: "In Progress",
  },
  {
    id: "6",
    patientName: "James Wilson",
    appointmentTime: "3:15 PM",
    reason: "Routine Checkup",
    status: "Waiting",
  },
  {
    id: "7",
    patientName: "Maria Garcia",
    appointmentTime: "4:00 PM",
    reason: "Medication Adjustment",
    status: "Scheduled",
  },
  {
    id: "8",
    patientName: "Robert Taylor",
    appointmentTime: "4:45 PM",
    reason: "Physical Therapy",
    status: "Completed",
  },
]

interface AppointmentsTableProps {
  searchQuery?: string
  /** Patients fetched on the server (including any optimistic in-flight one). */
  patients: Patient[]
}

export function AppointmentsTable({
  searchQuery = "",
  patients,
}: AppointmentsTableProps) {
  const [isDeleting, startDelete] = useTransition()

  // Convert patients to appointment-row format
  const newPatientAppointments: Appointment[] = useMemo(
    () =>
      patients.map((patient) => ({
        id: patient.id,
        patientName: patient.name,
        appointmentTime: "Pending",
        reason: patient.primaryComplaint,
        status: "Scheduled" as const,
        isCustomPatient: true,
        patientId: patient.id,
      })),
    [patients]
  )

  // Combine real patient rows with the sample schedule (static demo data)
  const allAppointments = useMemo(
    () => [...newPatientAppointments, ...mockAppointments],
    [newPatientAppointments]
  )

  // Filter appointments based on search query - memoized for performance
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) {
      return allAppointments
    }

    const query = searchQuery.toLowerCase().trim()
    return allAppointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.id.toLowerCase().includes(query)
    )
  }, [allAppointments, searchQuery])

  // If no patients exist and no search query, show empty state
  if (patients.length === 0 && !searchQuery) {
    return <EmptyState />
  }

  // Show search empty state
  if (searchQuery && filteredAppointments.length === 0) {
    return <SearchEmptyState query={searchQuery} />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-200 hover:bg-transparent">
          <TableHead className="text-slate-700">Patient Name</TableHead>
          <TableHead className="text-slate-700">Appointment Time</TableHead>
          <TableHead className="text-slate-700">Reason</TableHead>
          <TableHead className="text-slate-700">Status</TableHead>
          <TableHead className="text-right text-slate-700">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAppointments.map((appointment) => (
          <TableRow key={appointment.id} className="border-b border-slate-100">
            <TableCell className="py-4 text-slate-900 font-medium">
              {appointment.patientId ? (
                <Link
                  href={`/dashboard/patient/${appointment.patientId}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  {appointment.patientName}
                </Link>
              ) : (
                appointment.patientName
              )}
            </TableCell>
            <TableCell className="py-4 text-slate-600">
              {appointment.appointmentTime}
            </TableCell>
            <TableCell className="py-4 text-slate-600">
              {appointment.reason}
            </TableCell>
            <TableCell className="py-4">
              <StatusBadge status={appointment.status} />
            </TableCell>
            <TableCell className="py-4 text-right">
              {appointment.patientId && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() =>
                    startDelete(() => deletePatient(appointment.patientId!))
                  }
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Delete</span>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
