import { cn } from "@/lib/utils";
import { TicketType } from "@/types/ticket";
import { BookOpen, Bug, CheckSquare, GitBranch } from "lucide-react";

interface TicketTypeBadgeProps {
  type: TicketType;
  className?: string;
}

const typeConfig = {
  bug: {
    label: 'Bug',
    className: 'ticket-type-bug',
    icon: Bug
  },
  task: {
    label: 'Task',
    className: 'ticket-type-task',
    icon: CheckSquare
  },
  story: {
    label: 'Story',
    className: 'ticket-type-story',
    icon: BookOpen
  },
  subtask: {
    label: 'Subtask',
    className: 'ticket-type-subtask',
    icon: GitBranch
  }
};

export function TicketTypeBadge({ type, className }: TicketTypeBadgeProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </span>
  );
}