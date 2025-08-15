import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Ticket, TicketStatus, TicketPriority } from '@/types/ticket';

export interface DatabaseTicket {
  id: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  assignee_id: string | null;
  reporter_id: string;
  due_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  } | null;
  reporter: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
  comments: Array<{
    id: string;
    content: string;
    created_at: string;
    author: {
      id: string;
      name: string;
      email: string;
      avatar_url: string | null;
    };
  }>;
}

const transformDatabaseTicket = (dbTicket: DatabaseTicket): Ticket => ({
  id: dbTicket.id,
  title: dbTicket.title,
  description: dbTicket.description || '',
  status: dbTicket.status,
  priority: dbTicket.priority,
  assignee: dbTicket.assignee ? {
    id: dbTicket.assignee.id,
    name: dbTicket.assignee.name,
    email: dbTicket.assignee.email,
    avatar: dbTicket.assignee.avatar_url || undefined,
  } : undefined,
  reporter: {
    id: dbTicket.reporter.id,
    name: dbTicket.reporter.name,
    email: dbTicket.reporter.email,
    avatar: dbTicket.reporter.avatar_url || undefined,
  },
  createdAt: dbTicket.created_at,
  updatedAt: dbTicket.updated_at,
  dueDate: dbTicket.due_date || undefined,
  comments: dbTicket.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      email: comment.author.email,
      avatar: comment.author.avatar_url || undefined,
    },
    createdAt: comment.created_at,
  })),
  tags: dbTicket.tags,
  isEmailGenerated: false,
});

export const useTickets = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          assignee:assignee_id (
            id,
            name,
            email,
            avatar_url
          ),
          reporter:reporter_id (
            id,
            name,
            email,
            avatar_url
          ),
          comments (
            id,
            content,
            created_at,
            author:author_id (
              id,
              name,
              email,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data as any[]).map(transformDatabaseTicket);
    },
    enabled: !!user?.id,
  });
};

export const useTicket = (id: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          assignee:assignee_id (
            id,
            name,
            email,
            avatar_url
          ),
          reporter:reporter_id (
            id,
            name,
            email,
            avatar_url
          ),
          comments (
            id,
            content,
            created_at,
            author:author_id (
              id,
              name,
              email,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return transformDatabaseTicket(data as any);
    },
    enabled: !!id && !!user?.id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ticketData: {
      title: string;
      description: string;
      priority: TicketPriority;
      assignee_id?: string;
    }) => {
      if (!user?.id) throw new Error('User must be authenticated');
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          status: 'open' as TicketStatus,
          priority: ticketData.priority,
          assignee_id: ticketData.assignee_id || null,
          reporter_id: user.id,
          tags: [],
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Ticket created",
        description: "Your ticket has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating ticket",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketId, content }: { ticketId: string; content: string }) => {
      if (!user?.id) throw new Error('User must be authenticated');
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          ticket_id: ticketId,
          content,
          author_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};