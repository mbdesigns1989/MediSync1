import { getPatients } from "@/lib/patients"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

// Reads live DB state per request — render dynamically rather than prerendering
// a build-time snapshot.
export const dynamic = "force-dynamic"

// Server component: fetches patients from the DB, then hands them to the client
// island that owns search + the optimistic add flow.
export default async function DashboardPage() {
  const patients = await getPatients()
  return <DashboardClient patients={patients} />
}
