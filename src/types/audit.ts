export type AuditEventType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_DELETED"
  | "WALLET_DEBIT"
  | "WALLET_CREDIT";

export type AuditEvent = {
  id: string;
  timestamp: number;
  type: AuditEventType;
  payload: Record<string, unknown>;
};
