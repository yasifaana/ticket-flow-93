import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { ResponseAllTicketAssignee, Ticket, User } from "@/types/ticket";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { TicketTypeBadge } from "../ui/ticket-type-badge";

interface RecentTicketsProps {
  tickets: Ticket[];
  currentUser: User;
}

export function RecentTickets({ tickets, currentUser }: RecentTicketsProps) {
  // const recentTickets = tickets.slice(0, 5);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;
  const filteredTicket = tickets.filter(t => t.status !== 'closed');

  const totalPages = Math.ceil(filteredTicket.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const recentTickets = filteredTicket.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  {ticket.isEmailGenerated && (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm font-medium text-muted-foreground">
                    {ticket.id}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {ticket.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <TicketTypeBadge type={ticket.type} />
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {currentUser.name && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback className="text-xs">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {currentUser.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                    
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                    
                <PaginationItem>
                  <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}