import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Calendar, User, Paperclip, MessageSquare, Clock, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { TicketComments } from "@/components/tickets/ticket-comments";
import { FileUpload } from "@/components/tickets/file-upload";
import { Ticket } from "@/types/ticket";
import { EditTicketDialog } from "@/components/tickets/edit-ticket-dialog";
import { useComment, useTicketId } from "@/services/api";
import { TicketTypeBadge } from "@/components/ui/ticket-type-badge";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ticket, isLoading } = useTicketId(id || '');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { comments } = useComment(id, "");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ticket...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    <span>{ticket.ticket.id}</span>
                    {ticket.ticket.isEmailGenerated && (
                      <Badge variant="outline" className="text-xs">
                        Email Generated
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{ticket.ticket.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <TicketTypeBadge type={ticket.ticket.type} />
                  <StatusBadge status={ticket.ticket.status} />
                  <PriorityBadge priority={ticket.ticket.priority} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.ticket.description}
              </p>
              
              {/* Tags */}
              {(ticket.ticket.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {(ticket.ticket.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Upload */}
          <FileUpload ticketId={ticket.ticket.id} />

          {/* Comments */}
          <TicketComments ticketId={ticket.ticket.id}/>
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
                    <AvatarImage /*src={ticket.reporter.avatar}*/ />
                    <AvatarFallback className="text-xs">
                      {ticket.ticket.isEmailGenerated ? ticket.ticket.sourceEmail?.charAt(0) : ticket.reporter.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.ticket.isEmailGenerated ? ticket.ticket.sourceEmail : ticket.reporter.name}</span>
                </div>
              </div>

              {/* Due Date */}
              {ticket.ticket.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Due Date</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(ticket.ticket.dueDate)}</span>
                  </div>
                </div>
              )}

              {/* Created */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Created</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ticket.ticket.createdAt)}</span>
                </div>
              </div>

              {/* Updated */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Updated</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ticket.ticket.updatedAt)}</span>
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
                <span>{comments.length ?? 0} comments</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span>0 attachments</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Created by {ticket.ticket.isEmailGenerated ? ticket.ticket.sourceEmail : ticket.reporter.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {ticket && (
        <EditTicketDialog open={isEditOpen} onOpenChange={setIsEditOpen} data={ticket} />
      )}
    </div>
  );
}