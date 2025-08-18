import { useState } from "react";
import { Search, Filter, Grid, List, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TicketCard } from "@/components/tickets/ticket-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tickets } from "@/data/mockData";
import { TicketStatus, TicketPriority } from "@/types/ticket";

export default function Tickets() {
  const [ticketData] = useState(tickets);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'priority' | 'assignee'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTickets = ticketData
    .filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'assignee':
          comparison = (a.assignee?.name || '').localeCompare(b.assignee?.name || '');
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track all your tickets in one place.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More
                <MoreHorizontal className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('created')}>
                Sort by Created Date {sortBy === 'created' && (sortOrder === 'desc' ? '↓' : '↑')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('updated')}>
                Sort by Updated Date {sortBy === 'updated' && (sortOrder === 'desc' ? '↓' : '↑')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('priority')}>
                Sort by Priority {sortBy === 'priority' && (sortOrder === 'desc' ? '↓' : '↑')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('assignee')}>
                Sort by Assignee {sortBy === 'assignee' && (sortOrder === 'desc' ? '↓' : '↑')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                Toggle Sort Order ({sortOrder === 'desc' ? 'Descending' : 'Ascending'})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedTickets.length} of {ticketData.length} tickets
        </p>
      </div>

      {/* Tickets Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {filteredAndSortedTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => {
              // Navigate to ticket detail page
              console.log('Navigate to ticket:', ticket.id);
            }}
            className={viewMode === 'list' ? 'w-full' : ''}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedTickets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No tickets found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}