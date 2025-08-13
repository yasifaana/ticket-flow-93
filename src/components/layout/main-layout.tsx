import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CreateTicketDialog } from "@/components/tickets/create-ticket-dialog";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCreateTicket={() => setIsCreateTicketOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      <CreateTicketDialog 
        open={isCreateTicketOpen}
        onOpenChange={setIsCreateTicketOpen}
      />
    </div>
  );
}