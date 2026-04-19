import { Users, Calendar, AlertCircle, PhoneCall } from "lucide-react";
import { StatsCard } from "./stats-card";

export function StatsOverview() {
  const stats = [
    {
      icon: Users,
      title: "Total Patients",
      value: "1,240",
      trend: "+5.2% from last month",
      trendPositive: true,
    },
    {
      icon: Calendar,
      title: "Today's Appointments",
      value: "8",
      trend: "2 pending",
      trendPositive: false,
    },
    {
      icon: AlertCircle,
      title: "Pending Reports",
      value: "3",
      trend: "-2 from yesterday",
      trendPositive: true,
    },
    {
      icon: PhoneCall,
      title: "Active Consultations",
      value: "12",
      trend: "+3 in progress",
      trendPositive: true,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          trendPositive={stat.trendPositive}
        />
      ))}
    </div>
  );
}
