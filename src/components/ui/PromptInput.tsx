import type { ReactNode } from "react";
import { Button } from "./Button";

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  actions?: ReactNode;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "描述你想构建的应用...",
  className = "",
  actions,
}: PromptInputProps) {
  return (
    <div
      className={`relative rounded-2xl border border-border bg-surface shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${className}`}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 pt-4 pb-14 border-none bg-transparent text-text placeholder:text-text-muted focus:outline-none resize-none min-h-[80px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim()) {
            onSubmit();
          }
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center justify-between border-t border-border-light bg-surface-light/50 rounded-b-2xl">
        <div>{actions}</div>
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={!value.trim()}
        >
          开始构建
        </Button>
      </div>
    </div>
  );
}
