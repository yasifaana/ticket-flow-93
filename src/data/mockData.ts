import { Ticket, User, TicketStats } from '@/types/ticket';

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  }
];

export const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Login page not loading on mobile devices',
    description: 'Users are reporting that the login page fails to load properly on mobile devices, especially on iOS Safari.',
    status: 'open',
    priority: 'high',
    assignee: users[0],
    reporter: users[1],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    comments: [
      {
        id: 'c1',
        content: 'I can reproduce this on iPhone 13 with iOS 16.5',
        author: users[1],
        createdAt: '2024-01-15T11:00:00Z'
      }
    ],
    tags: ['frontend', 'mobile', 'urgent'],
    isEmailGenerated: false
  },
  {
    id: 'TKT-002',
    title: 'Database connection timeout errors',
    description: 'Multiple users experiencing intermittent database connection timeouts during peak hours.',
    status: 'in-progress',
    priority: 'critical',
    assignee: users[2],
    reporter: users[3],
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    comments: [
      {
        id: 'c2',
        content: 'Investigating connection pool settings',
        author: users[2],
        createdAt: '2024-01-15T16:45:00Z'
      }
    ],
    tags: ['backend', 'database', 'performance'],
    isEmailGenerated: true
  },
  {
    id: 'TKT-003',
    title: 'Add dark mode toggle to settings',
    description: 'Users have requested a dark mode option in the application settings.',
    status: 'pending',
    priority: 'medium',
    assignee: users[0],
    reporter: users[1],
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    comments: [],
    tags: ['feature', 'ui/ux'],
    isEmailGenerated: false
  },
  {
    id: 'TKT-004',
    title: 'Email notifications not working',
    description: 'System is not sending email notifications for ticket updates.',
    status: 'closed',
    priority: 'high',
    assignee: users[3],
    reporter: users[2],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T17:30:00Z',
    comments: [
      {
        id: 'c3',
        content: 'Fixed SMTP configuration issue',
        author: users[3],
        createdAt: '2024-01-12T17:30:00Z'
      }
    ],
    tags: ['email', 'notifications'],
    isEmailGenerated: false
  },
  {
    id: 'TKT-005',
    title: 'API rate limiting implementation',
    description: 'Implement rate limiting for public API endpoints to prevent abuse.',
    status: 'open',
    priority: 'medium',
    reporter: users[0],
    createdAt: '2024-01-16T13:45:00Z',
    updatedAt: '2024-01-16T13:45:00Z',
    comments: [],
    tags: ['api', 'security'],
    isEmailGenerated: false
  }
];

export const ticketStats: TicketStats = {
  total: tickets.length,
  open: tickets.filter(t => t.status === 'open').length,
  inProgress: tickets.filter(t => t.status === 'in-progress').length,
  pending: tickets.filter(t => t.status === 'pending').length,
  closed: tickets.filter(t => t.status === 'closed').length
};