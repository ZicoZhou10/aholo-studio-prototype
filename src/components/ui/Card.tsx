export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gradient?: string;
}

export function Card({
  children,
  className = "",
  hover = false,
  gradient,
  onClick,
  ...rest
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden ${
        hover
          ? "hover:shadow-md hover:border-border transition-all cursor-pointer"
          : ""
      } ${className}`}
      {...rest}
    >
      {gradient && (
        <div
          className="h-8 w-full"
          style={{ background: gradient }}
        />
      )}
      {children}
    </div>
  );
}
