import { Badge } from "./Badge";

export interface ApiCapability {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface CapabilityChipProps {
  api: ApiCapability;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CapabilityChip({
  api,
  selected = false,
  onClick,
  className = "",
}: CapabilityChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-xl border transition-all cursor-pointer text-left ${
        selected
          ? "bg-primary/5 border-primary shadow-sm"
          : "bg-surface border-border-light hover:border-primary/50 hover:shadow-sm"
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <Badge label={api.category} size="sm" />
        <span className="font-medium">{api.name}</span>
      </div>
      <p className="text-xs text-text-muted line-clamp-1 mt-1">
        {api.description}
      </p>
    </button>
  );
}
