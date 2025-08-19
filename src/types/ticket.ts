export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'bug' | 'task' | 'story' | 'subtask';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  assignee?: User;
  reporter: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments: Comment[];
  tags: string[];
  isEmailGenerated?: boolean;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  pending: number;
  closed: number;
}