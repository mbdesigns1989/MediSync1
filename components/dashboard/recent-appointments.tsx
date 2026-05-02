import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentsTable } from "./appointments-table"

interface RecentAppointmentsProps {
  searchQuery?: string
}

export function RecentAppointments({ searchQuery = "" }: RecentAppointmentsProps) {
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
        <AppointmentsTable searchQuery={searchQuery} />
      </CardContent>
    </Card>
  )
}
