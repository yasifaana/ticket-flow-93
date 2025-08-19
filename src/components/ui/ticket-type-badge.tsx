import { cn } from "@/lib/utils";
import { TicketType } from "@/types/ticket";

interface TicketTypeBadgeProps {
  type: TicketType;
  className?: string;
}

const typeConfig = {
  bug: {
    label: 'Bug',
    className: 'ticket-type-bug'
  },
  task: {
    label: 'Task',
    className: 'ticket-type-task'
  },
  story: {
    label: 'Story',
    className: 'ticket-type-story'
  },
  subtask: {
    label: 'Subtask',
    className: 'ticket-type-subtask'
  }
};

export function TicketTypeBadge({ type, className }: TicketTypeBadgeProps) {
  const config = typeConfig[type];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}