import { UserRole, ApplicationStatus, DocumentStatus, NotificationType } from "@prisma/client";

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedThisMonth: number;
  totalPrograms: number;
  totalDocuments: number;
}

export interface MonthlyData {
  month: string;
  applications: number;
  approved: number;
  rejected: number;
}

export interface ProgramStats {
  programId: string;
  programName: string;
  totalApplications: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface ApplicationWithDetails {
  id: string;
  applicationNumber: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
  program: {
    id: string;
    name: string;
    category: string;
    color: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  documents: {
    id: string;
    status: DocumentStatus;
    type: string;
  }[];
  schedule: {
    id: string;
    scheduledDate: Date;
    scheduledTime: string | null;
    location: string | null;
  } | null;
}

export interface NotificationWithUser {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface AuditLogWithUser {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  } | null;
}
