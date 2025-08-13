import { cn } from "@/lib/utils";
import { TicketStatus } from "@/types/ticket";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig = {
  open: {
    label: 'Open',
    className: 'status-open'
  },
  'in-progress': {
    label: 'In Progress',
    className: 'status-in-progress'
  },
  pending: {
    label: 'Pending',
    className: 'status-pending'
  },
  closed: {
    label: 'Closed',
    className: 'status-closed'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
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