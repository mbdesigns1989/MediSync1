import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentsTable } from "./appointments-table"
import type { Patient } from "@/types/patient"

interface RecentAppointmentsProps {
  searchQuery?: string
  optimisticPatients?: Patient[]
}

export function RecentAppointments({
  searchQuery = "",
  optimisticPatients,
}: RecentAppointmentsProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>
          {searchQuery
            ? `Search results for: "${searchQuery}"`
            : "View your upcoming and recent patient appointments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppointmentsTable
          searchQuery={searchQuery}
          optimisticPatients={optimisticPatients}
        />
      </CardContent>
    </Card>
  )
}
