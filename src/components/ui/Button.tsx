import type { LucideIcon } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary:
    "bg-surface-light border border-border text-text hover:bg-surface-lighter",
  ghost: "text-text-secondary hover:bg-surface-light",
  danger: "bg-error text-white hover:bg-red-600",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-2.5 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
      {children}
    </button>
  );
}
