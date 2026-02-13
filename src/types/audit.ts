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


export const AuditLabels: Record<AuditEventType, string> = {
  TASK_CREATED: "Task creato",
  TASK_UPDATED: "Task aggiornato",
  TASK_STATUS_CHANGED: "Task modificato",
  TASK_DELETED: "Task cancellato",
  WALLET_DEBIT: "Crediti scalati",
  WALLET_CREDIT: "Crediti aggiunti",
};
