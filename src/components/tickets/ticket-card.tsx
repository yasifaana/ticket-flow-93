import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, MessageSquare } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  className?: string;
}

export function TicketCard({ ticket, onClick, className }: TicketCardProps) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/tickets/${ticket.id}`);
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover-lift transition-all duration-200",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {ticket.isEmailGenerated && (
              <Mail className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {ticket.id}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {ticket.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {ticket.description}
          </p>
        </div>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {ticket.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {ticket.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{ticket.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {ticket.assignee && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={ticket.assignee.avatar} />
                  <AvatarFallback className="text-xs">
                    {ticket.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{ticket.assignee.name}</span>
              </div>
            )}
            
            {ticket.comments.length > 0 && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{ticket.comments.length}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {ticket.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(ticket.dueDate)}</span>
              </div>
            )}
            <span>Updated {formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}