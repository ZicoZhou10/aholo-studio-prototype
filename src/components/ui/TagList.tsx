export interface TagListProps {
  tags: string[];
  className?: string;
  maxVisible?: number;
}

export function TagList({
  tags,
  className = "",
  maxVisible = 5,
}: TagListProps) {
  const visible = tags.slice(0, maxVisible);
  const remaining = tags.length - maxVisible;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visible.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 rounded-md bg-surface-lighter text-text-secondary text-xs"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-2 py-0.5 rounded-md bg-surface-lighter text-text-secondary text-xs">
          +{remaining}
        </span>
      )}
    </div>
  );
}
