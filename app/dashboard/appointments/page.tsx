import { getAppointments } from "@/lib/appointments"
import { AppointmentBoard } from "@/components/appointments/appointment-board"

// Reads live DB state per request.
export const dynamic = "force-dynamic"

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
        <p className="text-slate-600">
          Drag appointments between columns to update their status
        </p>
      </div>

      <AppointmentBoard initialAppointments={appointments} />
    </div>
  )
}
