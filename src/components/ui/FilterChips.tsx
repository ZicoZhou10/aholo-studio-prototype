export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterChipsProps {
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function FilterChips({
  options,
  value,
  onChange,
  className = "",
}: FilterChipsProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-1 ${className}`}
    >
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-text text-surface"
                : "bg-surface-light text-text-secondary hover:bg-surface-lighter border border-transparent"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
