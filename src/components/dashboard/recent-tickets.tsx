import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { TicketTypeBadge } from "@/components/ui/ticket-type-badge";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RecentTicketsProps {
  tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  // Mock current user (Alice Johnson)
  const currentUserId = '1';
  
  // Filter tickets: not closed and assigned to current user
  const yourTickets = tickets.filter(ticket => 
    ticket.status !== 'closed' && 
    ticket.assignee?.id === currentUserId
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;
  
  // Calculate pagination
  const totalPages = Math.ceil(yourTickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = yourTickets.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {yourTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tickets, enjoy your day! 🌟</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentTickets.map((ticket) => (
                  <div 
                    key={ticket.id}
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
                      {ticket.assignee && (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.assignee.avatar} />
                            <AvatarFallback className="text-xs">
                              {ticket.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {ticket.assignee.name}
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}