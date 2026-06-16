import "server-only";
import { prisma } from "@/lib/prisma";
import type { Patient } from "@/types/patient";

/** Map a Prisma Patient row to the app's domain Patient type. */
function toPatient(row: {
  id: string;
  name: string;
  age: number;
  gender: string;
  primaryComplaint: string;
  createdAt: Date;
}): Patient {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender as Patient["gender"],
    primaryComplaint: row.primaryComplaint,
    createdAt: row.createdAt,
  };
}

/** All patients, newest first. */
export async function getPatients(): Promise<Patient[]> {
  const rows = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toPatient);
}

/** A single patient by id, or null if not found. */
export async function getPatientById(id: string): Promise<Patient | null> {
  const row = await prisma.patient.findUnique({ where: { id } });
  return row ? toPatient(row) : null;
}
