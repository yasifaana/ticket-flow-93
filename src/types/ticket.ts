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
  authorId: string;
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
  sourceEmail?: string;
  assigneeId?: string;
  reporterId?: string;
}

export interface Notification {
  id: number;
  userId: string;
  notifContent: string;
  read: boolean;
  createdAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  pending: number;
  closed: number;
}

export interface ResponseDetailTicket {
  ticket: Ticket;
  assignee: User;
  reporter: User;
}

export interface ResponseAllTicketAssignee {
  ticket: TicketAssignee[];
}

export interface TicketAssignee {
  ticket: Ticket;
  name: string;
  avatar: string;
}

export interface ChangePassword {
  previousPassword: string;
  newPassword: string;
}

export interface ResponseTicketByUser {
  ticket: Ticket[];
}

export interface ResponseFetchAllNotif {
  notifications: Notification[];
}