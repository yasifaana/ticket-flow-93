import { Search, Bell, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onCreateTicket?: () => void;
}

export function Header({ onCreateTicket }: HeaderProps) {
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    if (!user?.user_metadata?.first_name && !user?.user_metadata?.last_name) {
      return user?.email?.slice(0, 2).toUpperCase() || 'U';
    }
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                {getUserInitials()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}