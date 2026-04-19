import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  trend,
  trendPositive = true,
}: StatsCardProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <p
                className={`text-xs font-medium ${
                  trendPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-blue-50 p-3">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
