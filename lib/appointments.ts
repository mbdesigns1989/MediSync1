import "server-only";
import { prisma } from "@/lib/prisma";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

/** All appointments with their patient name, ordered for stable board columns. */
export async function getAppointments(): Promise<Appointment[]> {
  const rows = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "asc" }],
    include: { patient: { select: { name: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    reason: row.reason,
    status: row.status as AppointmentStatus,
    position: row.position,
    patientId: row.patientId,
    patientName: row.patient.name,
    createdAt: row.createdAt,
  }));
}
