import type { LucideIcon } from "lucide-react";

export interface ChipProps {
  label: string;
  icon?: LucideIcon;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({
  label,
  icon: Icon,
  description,
  selected = false,
  onClick,
  className = "",
}: ChipProps) {
  const hasDescription = !!description;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border transition-all cursor-pointer text-left ${
        hasDescription ? "py-3 px-4" : "px-4 py-2"
      } ${
        selected
          ? "bg-primary/10 border-primary text-primary"
          : "bg-surface border-border-light hover:border-primary hover:bg-primary/5"
      } ${className}`}
    >
      {hasDescription ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={16} />}
            <span className="font-medium">{label}</span>
          </div>
          <span className="text-sm text-text-muted">{description}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          <span>{label}</span>
        </div>
      )}
    </button>
  );
}
