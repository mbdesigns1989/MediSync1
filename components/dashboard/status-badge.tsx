import { cn } from "@/lib/utils";

type Status = "In Progress" | "Waiting" | "Completed" | "Scheduled";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<Status, string> = {
    "In Progress": "bg-blue-50 text-blue-700",
    Waiting: "bg-yellow-50 text-yellow-700",
    Completed: "bg-green-50 text-green-700",
    Scheduled: "bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
