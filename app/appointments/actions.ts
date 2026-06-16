"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAppointments } from "@/lib/appointments";
import { APPOINTMENT_STATUSES, type Appointment } from "@/types/appointment";

/**
 * Client-callable wrapper around the server-only data layer, used as the React
 * Query `queryFn` so the board can refetch (e.g. on `onSettled` after a move).
 */
export async function fetchAppointments(): Promise<Appointment[]> {
  return getAppointments();
}

const moveSchema = z.object({
  id: z.string().min(1),
  status: z.enum(APPOINTMENT_STATUSES),
});

export interface MoveResult {
  success: boolean;
  message?: string;
}

/**
 * Move an appointment to a new status column. Validates the target status
 * (server trust boundary) then persists. Used by the drag-and-drop board; in
 * Phase 3.3 React Query wraps this with optimistic update + rollback.
 */
export async function moveAppointment(
  id: string,
  status: string
): Promise<MoveResult> {
  const parsed = moveSchema.safeParse({ id, status });
  if (!parsed.success) {
    return { success: false, message: "Invalid appointment or status" };
  }

  try {
    await prisma.appointment.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch (error) {
    console.error("moveAppointment error:", error);
    return { success: false, message: "Failed to move appointment" };
  }
}
