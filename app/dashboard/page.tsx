import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">
          Overview of your patients and appointments
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Recent Appointments */}
      <RecentAppointments />
    </div>
  );
}
