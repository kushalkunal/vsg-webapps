import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, string> = {
  // Student statuses
  "new enquiry": "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "in progress": "bg-orange-100 text-orange-700 border-orange-200",
  "docs collected": "bg-purple-100 text-purple-700 border-purple-200",
  applied: "bg-teal-100 text-teal-700 border-teal-200",
  admitted: "bg-green-100 text-green-700 border-green-200",
  "not interested": "bg-gray-100 text-gray-500 border-gray-200",
  // Generic
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const colors =
    STATUS_MAP[key] ?? "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colors,
        className,
      )}
    >
      {status}
    </span>
  );
}
