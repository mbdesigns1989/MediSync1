import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentsTable } from "./appointments-table";

export function RecentAppointments() {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>
          View your upcoming and recent patient appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppointmentsTable />
      </CardContent>
    </Card>
  );
}
