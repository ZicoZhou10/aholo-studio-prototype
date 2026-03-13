export interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info" | "custom";
  bg?: string;
  text?: string;
  size?: "sm" | "md";
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "bg-surface-lighter text-text-secondary",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  label,
  variant = "default",
  bg,
  text,
  size = "sm",
  className = "",
}: BadgeProps) {
  const colorClasses =
    variant === "custom" ? "" : variantClasses[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClasses} ${sizeClasses[size]} ${className}`}
      style={
        variant === "custom" ? { backgroundColor: bg, color: text } : undefined
      }
    >
      {label}
    </span>
  );
}
