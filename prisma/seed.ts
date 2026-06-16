import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Idempotent: clear then reseed so `prisma db seed` can be re-run safely.
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();

  const sarah = await prisma.patient.create({
    data: {
      name: "Sarah Johnson",
      age: 32,
      gender: "female",
      primaryComplaint: "General check-up",
      medications: JSON.stringify(["Lisinopril 10mg daily", "Aspirin 81mg daily"]),
      createdAt: new Date("2026-06-14T08:00:00.000Z"),
    },
  });

  const michael = await prisma.patient.create({
    data: {
      name: "Michael Chen",
      age: 45,
      gender: "male",
      primaryComplaint: "Follow-up appointment",
      medications: JSON.stringify([
        "Metoprolol 50mg daily",
        "Lisinopril 20mg daily",
      ]),
      createdAt: new Date("2026-06-14T09:00:00.000Z"),
    },
  });

  const emily = await prisma.patient.create({
    data: {
      name: "Emily Rodriguez",
      age: 28,
      gender: "female",
      primaryComplaint: "Lab results consultation",
      medications: JSON.stringify(["Amoxicillin 500mg 3x daily"]),
      createdAt: new Date("2026-06-14T09:30:00.000Z"),
    },
  });

  // Appointments spread across board columns so the drag board has content.
  await prisma.appointment.createMany({
    data: [
      { patientId: sarah.id, reason: "Check-up", status: "In Progress", position: 0 },
      { patientId: michael.id, reason: "Surgery Prep", status: "Waiting", position: 0 },
      { patientId: emily.id, reason: "Follow-up Consultation", status: "Scheduled", position: 0 },
      { patientId: sarah.id, reason: "Lab Results Review", status: "Completed", position: 0 },
      { patientId: michael.id, reason: "Medication Adjustment", status: "Scheduled", position: 1 },
    ],
  });

  console.log("Seeded 3 patients and 5 appointments.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
