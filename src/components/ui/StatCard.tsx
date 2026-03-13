import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  className = "",
}: StatCardProps) {
  const trendColor = trend?.startsWith("+")
    ? "text-green-600"
    : trend?.startsWith("-")
    ? "text-red-600"
    : "text-text-muted";

  return (
    <div
      className={`bg-surface rounded-xl border border-border-light p-4 ${className}`}
    >
      <Icon size={20} className="text-primary mb-2" />
      <div className="text-2xl font-semibold text-text">{value}</div>
      <div className="text-sm text-text-secondary mt-0.5">{label}</div>
      {trend && <div className={`text-xs mt-1 ${trendColor}`}>{trend}</div>}
    </div>
  );
}
