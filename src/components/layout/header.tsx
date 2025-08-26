import { Search, Plus, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification, useReadNotification } from "@/services/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { formatDistanceToNow } from "date-fns";

interface HeaderProps {
  onCreateTicket?: () => void;
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function Header({ onCreateTicket }: HeaderProps) {
  const { user } = useAuth();
  const { data, isLoading } = useNotification(user.id);
  const readNotificationMutation = useReadNotification();

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const notifications = data?.notifications ?? [];
  const unreadNotif = notifications.filter(notif => notif.read === false);
  const unreadCount = unreadNotif.length;
  console.log(notifications);
  console.log(notifications.map(n => ({ value: n.read, type: typeof n.read })));


  const markAsRead = async (isRead: boolean, notifId: number) => {
    try {
      readNotificationMutation.mutate({
        isRead: isRead,
        notifyId: notifId
      });
    } catch (err) {
      console.error("error read notification: ", err);
    }
  };

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Create Ticket Button */}
          <Button 
            onClick={onCreateTicket}
            className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                <Badge variant="secondary">{unreadCount} new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {unreadCount === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  unreadNotif.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/50 ${
                        notification.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.notifContent}</p>
                        <p className="text-xs text-muted-foreground mt-1">{timeAgo(notification.createdAt)}</p>
                      </div>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(true, notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {getInitials(user.name)}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}