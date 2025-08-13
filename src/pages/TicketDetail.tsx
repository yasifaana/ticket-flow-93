import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Paperclip, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { TicketComments } from "@/components/tickets/ticket-comments";
import { FileUpload } from "@/components/tickets/file-upload";
import { tickets } from "@/data/mockData";
import { Ticket } from "@/types/ticket";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const ticket = tickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Ticket Not Found</h1>
          <Button onClick={() => navigate("/tickets")}>Back to Tickets</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/tickets")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{ticket.id}</span>
                    {ticket.isEmailGenerated && (
                      <Badge variant="outline" className="text-xs">
                        Email Generated
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
              
              {/* Tags */}
              {ticket.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {ticket.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Upload */}
          <FileUpload ticketId={ticket.id} />

          {/* Comments */}
          <TicketComments ticket={ticket} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assignee */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Assignee</span>
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={ticket.assignee.avatar} />
                      <AvatarFallback className="text-xs">
                        {ticket.assignee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ticket.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </div>

              {/* Reporter */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Reporter</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.reporter.avatar} />
                    <AvatarFallback className="text-xs">
                      {ticket.reporter.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.reporter.name}</span>
                </div>
              </div>

              {/* Due Date */}
              {ticket.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Due Date</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(ticket.dueDate)}</span>
                  </div>
                </div>
              )}

              {/* Created */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Created</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>

              {/* Updated */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Updated</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{ticket.comments.length} comments</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span>0 attachments</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Created by {ticket.reporter.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}