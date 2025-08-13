import { cn } from "@/lib/utils";
import { TicketPriority } from "@/types/ticket";

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'priority-low'
  },
  medium: {
    label: 'Medium',
    className: 'priority-medium'
  },
  high: {
    label: 'High',
    className: 'priority-high'
  },
  critical: {
    label: 'Critical',
    className: 'priority-critical'
  }
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
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