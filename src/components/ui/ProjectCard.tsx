import { Eye, GitBranch } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { TagList } from "./TagList";
import { Button } from "./Button";

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  type: string;
  thumbnailGradient: string;
  status: string;
  viewCount: number;
  remixCount: number;
  tags: string[];
  updatedAt: string;
}

export interface ProjectCardProps {
  project: ProjectData;
  onRemix?: () => void;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({
  project,
  onRemix,
  onClick,
  className = "",
}: ProjectCardProps) {
  return (
    <Card hover onClick={onClick} className={className}>
      <div className="relative">
        <div
          className="h-32 rounded-t-xl"
          style={{ background: project.thumbnailGradient }}
        />
        <div className="absolute top-2 right-2">
          <Badge label={project.type} variant="info" size="sm" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-text truncate">{project.name}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 mt-1">
          {project.description}
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {project.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            {project.remixCount}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <TagList tags={project.tags} maxVisible={3} />
          {onRemix && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemix();
              }}
            >
              Remix
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
