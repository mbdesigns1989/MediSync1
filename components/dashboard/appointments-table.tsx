import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";

type Status = "In Progress" | "Waiting" | "Completed" | "Scheduled";

interface Appointment {
  id: string;
  patientName: string;
  appointmentTime: string;
  reason: string;
  status: Status;
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
];

export function AppointmentsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-200 hover:bg-transparent">
          <TableHead className="text-slate-700">Patient Name</TableHead>
          <TableHead className="text-slate-700">Appointment Time</TableHead>
          <TableHead className="text-slate-700">Reason</TableHead>
          <TableHead className="text-slate-700">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockAppointments.map((appointment) => (
          <TableRow key={appointment.id} className="border-b border-slate-100">
            <TableCell className="py-4 text-slate-900 font-medium">
              {appointment.patientName}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
