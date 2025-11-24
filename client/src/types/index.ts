export type UserRole = 'ADMIN' | 'INTERNAL' | 'CLIENT';

export type ActionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export type VisibilityType = 'INTERNAL' | 'VISIBLE_TO_CLIENT';

export type RecurrenceType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type DeadlineType = 'SPECIFIC_DATE' | 'RELATIVE_DAYS' | 'RECURRING';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: Record<string, any>;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  phaseTemplates?: PhaseTemplate[];
  _count?: {
    clients: number;
  };
}

export interface PhaseTemplate {
  id: string;
  productId: string;
  name: string;
  description?: string;
  order: number;
  visibility: VisibilityType;
  deadlineType: DeadlineType;
  deadlineDays?: number;
  deadlineDate?: string;
  recurrence: RecurrenceType;
  recurrenceDays?: number;
  createdAt: string;
  updatedAt: string;
  actionTemplates?: ActionTemplate[];
}

export interface ActionTemplate {
  id: string;
  phaseTemplateId: string;
  title: string;
  description?: string;
  order: number;
  visibility: VisibilityType;
  deadlineType: DeadlineType;
  deadlineDays?: number;
  deadlineDate?: string;
  recurrence: RecurrenceType;
  recurrenceDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  cnpjCpf?: string;
  email?: string;
  phone?: string;
  productId: string;
  entryDate: string;
  consultantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  consultant?: Pick<User, 'id' | 'name' | 'email'>;
  board?: Board;
  stats?: {
    totalActions: number;
    completedActions: number;
    delayedActions: number;
    completionPercentage: number;
    currentPhase: string;
  };
}

export interface Board {
  id: string;
  clientId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  phases: Phase[];
}

export interface Phase {
  id: string;
  boardId: string;
  name: string;
  description?: string;
  order: number;
  visibility: VisibilityType;
  deadlineType: DeadlineType;
  deadlineDays?: number;
  deadlineDate?: string;
  recurrence: RecurrenceType;
  recurrenceDays?: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  actions: Action[];
}

export interface Action {
  id: string;
  phaseId: string;
  title: string;
  description?: string;
  status: ActionStatus;
  order: number;
  visibility: VisibilityType;
  deadlineType: DeadlineType;
  deadlineDays?: number;
  deadlineDate?: string;
  recurrence: RecurrenceType;
  recurrenceDays?: number;
  assigneeId?: string;
  isDelayed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface HistoryEntry {
  id: string;
  actionId: string;
  userId: string;
  field: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateClientData {
  name: string;
  companyName?: string;
  cnpjCpf?: string;
  email?: string;
  phone?: string;
  productId: string;
  entryDate?: string;
}

export interface UpdateClientData {
  name?: string;
  companyName?: string;
  cnpjCpf?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreatePhaseData {
  name: string;
  description?: string;
  order: number;
  visibility?: VisibilityType;
  deadlineType?: DeadlineType;
  deadlineDays?: number;
  deadlineDate?: string;
  recurrence?: RecurrenceType;
  recurrenceDays?: number;
}

export interface UpdatePhaseData extends Partial<CreatePhaseData> {}

export interface CreateActionData {
  title: string;
  description?: string;
  order: number;
  visibility?: VisibilityType;
  deadlineType?: DeadlineType;
  deadlineDays?: number;
  deadlineDate?: string;
  recurrence?: RecurrenceType;
  recurrenceDays?: number;
  assigneeId?: string;
}

export interface UpdateActionData extends Partial<CreateActionData> {
  status?: ActionStatus;
}
