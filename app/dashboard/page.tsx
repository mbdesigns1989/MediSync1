import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { PatientForm } from "@/components/dashboard/patient-form";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">
            Overview of your patients and appointments
          </p>
        </div>
        <PatientForm />
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Recent Appointments */}
      <RecentAppointments />
    </div>
  );
}
