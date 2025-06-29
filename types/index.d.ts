export type CreateUserParams = {
  clerkId: string;
  email: string;
  photo: string;
  firstName: string;
  lastName: string;
  role: string;
  approved: boolean;
  organizationId: string;
};

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  photo?: string;
  approved?: boolean;
  role?: string;
};

export type CreateOrganizationParams = {
  organization: {
    organizationName: string;
    description: string;
    imageUrl: string;
    responsiblePerson: string;
    origin: string;
    adminEmail: string;
  };
  path: string;
};

export type UpdateOrganizationParams = {
  organization: {
    _id: string
    organizationName?: string;
    description?: string;
    imageUrl?: string;
    responsiblePerson?: string;
    origin?: string;
  };
  path: string;
};

type LocationType = {
  address: string;
  lat: number;
  lng: number;
};

export type GetAllOrganizationsParams = {
  query: string
  limit: number
  status?: string
  page: number
}

export type CreateAttendanceSessionParams = {
  userId: string;
  organizationId: string;
  attendance: {
    sessionName: string;
    description?: string;
    locationMeeting?: LocationType;
    startTime: Date;
    endTime: Date;
    qr_code?: string;
  };
  path: string;
};

export type UpdateAttendanceSessionParams = {
  userId: string;
  organizationId: string;
  attendance: {
    _id?: string;
    sessionName?: string;
    description?: string;
    locationMeeting?: LocationType;
    startTime?: Date;
    endTime?: Date;
    qr_code?: string;
  };
  path: string;
};

export type DeleteAttendanceSessionParams = {
  attendanceId: string;
  path: string;
};

export type SearchParamProps = {
  params: { id: string };
};

export type CreateMailRequestProps = {
  mail: {
    email: string;
    subjectMail: string;
    organizationName: string;
    responsiblePerson: string;
    organizationPhoto: string;
    origin: string;
    description: string;
  }
  path: string
};

export type DeleteMailRequestProps = {
  mailId: string;
  approved: boolean;
  path: string;
};

export type UpdateMailRequestStatusProps = {
  mailId: string;
  approved: boolean;
  path: string;
};

export type GetMailRequestsByStatusProps = {
  approved?: boolean | null;
};

export interface ActivityLogMetadata {
  [key: string]: any;
}

export interface ActivityLog {
  _id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: 'superadmin' | 'admin' | 'user';
  action: ActivityAction;
  resource: string;
  resourceId?: string;
  description: string;
  metadata: ActivityLogMetadata;
  ipAddress: string;
  userAgent: string;
  platform: 'web' | 'mobile';
  status: 'success' | 'failed' | 'warning';
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityAction = 
  | 'LOGIN' | 'LOGOUT' | 'REGISTER'
  | 'USER_CREATE' | 'USER_UPDATE' | 'USER_DELETE' | 'USER_ACTIVATE' | 'USER_DEACTIVATE'
  | 'ATTENDANCE_CHECKIN' | 'ATTENDANCE_CHECKOUT' | 'ATTENDANCE_UPDATE' | 'ATTENDANCE_DELETE'
  | 'QR_GENERATE' | 'QR_SCAN' | 'QR_UPDATE'
  | 'ORG_CREATE' | 'ORG_UPDATE' | 'ORG_DELETE' | 'ORG_SETTINGS_UPDATE'
  | 'REPORT_GENERATE' | 'REPORT_EXPORT' | 'REPORT_VIEW'
  | 'SYSTEM_BACKUP' | 'SYSTEM_RESTORE' | 'SYSTEM_SETTINGS_UPDATE'
  | 'TENANT_CREATE' | 'TENANT_UPDATE' | 'TENANT_DELETE' | 'TENANT_ACTIVATE' | 'TENANT_DEACTIVATE';

export interface ActivityLogFilters {
  organizationId?: string;
  userId?: string;
  action?: ActivityAction;
  resource?: string;
  userRole?: 'superadmin' | 'admin' | 'user';
  status?: 'success' | 'failed' | 'warning';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ActivityLogPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  pagination: ActivityLogPagination;
}

export interface ActivityStats {
  overview: {
    totalActivities: number;
    successCount: number;
    failedCount: number;
    warningCount: number;
    uniqueUsersCount: number;
  };
  topActions: Array<{
    _id: ActivityAction;
    count: number;
  }>;
}

export interface LogOptions {
  organizationId: string;
  action: ActivityAction;
  resource: string;
  resourceId?: string;
  description: string;
  metadata?: ActivityLogMetadata;
  status?: 'success' | 'failed' | 'warning';
  platform?: 'web' | 'mobile';
}