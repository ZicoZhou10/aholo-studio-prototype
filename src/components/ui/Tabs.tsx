import type { LucideIcon } from "lucide-react";

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div
      className={`flex items-center gap-1 bg-surface-light rounded-lg p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-surface text-text shadow-sm"
                : "text-text-secondary hover:text-text"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {Icon && <Icon size={16} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
