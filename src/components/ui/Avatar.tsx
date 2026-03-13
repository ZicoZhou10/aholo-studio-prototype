export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export function Avatar({
  name,
  size = "md",
  src,
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`bg-primary text-white rounded-full flex items-center justify-center font-medium ${sizeClasses[size]} ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
