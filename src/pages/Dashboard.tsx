import { 
  TicketIcon, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentTickets } from "@/components/dashboard/recent-tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTickets, useTicketsUser } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useTicketsUser(user.id);
  const ticketList = data?.ticket ?? [];
  
  const openTickets = ticketList.filter(t => t.status === 'open');
  const inProgressTickets = ticketList.filter(t => t.status === 'in-progress');
  const closedThisWeek = ticketList.filter(t => t.status === 'closed').length;
  
  const ticketStats = {
    total: ticketList.length,
    open: openTickets.length,
    inProgress: inProgressTickets.length,
    pending: ticketList.filter(t => t.status === 'pending').length,
    closed: ticketList.filter(t => t.status === 'closed').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your tickets.
          </p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 days
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tickets"
          value={ticketStats.total}
          icon={<TicketIcon className="h-8 w-8" />}
        />
        <StatsCard
          title="Open Tickets"
          value={ticketStats.open}
          icon={<AlertCircle className="h-8 w-8" />}
        />
        <StatsCard
          title="In Progress"
          value={ticketStats.inProgress}
          icon={<Clock className="h-8 w-8" />}
        />
        <StatsCard
          title="Closed This Week"
          value={closedThisWeek}
          icon={<CheckCircle className="h-8 w-8" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          {(ticketStats.total - ticketStats.closed) === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tickets, enjoy your day! 🌟</p>
            </div>
          ) : (
            <RecentTickets tickets={data.ticket} currentUser={user} />
          )}
        </div>

        {/* Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <TicketIcon className="h-4 w-4 mr-2" />
                View All Tickets
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Team Performance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                System Status
              </Button>
            </CardContent>
          </Card> */}

          {/* Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alice resolved TKT-004</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bob assigned TKT-002</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Carol created TKT-005</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}