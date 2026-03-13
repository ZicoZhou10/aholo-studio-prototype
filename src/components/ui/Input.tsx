import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, className = "", ...rest }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className={Icon ? "relative" : ""}>
          {Icon && (
            <Icon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          )}
          <input
            ref={ref}
            className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
              Icon ? "pl-10" : ""
            }`}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
