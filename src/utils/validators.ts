import type { AuditEvent } from "../types/audit";
import type { Priority, Status, Task } from "../types/task";


//controllo se è un oggetto, una stringa

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isStatus(x: unknown): x is Status {
  return x === "TODO" || x === "DOING" || x === "DONE";
}

function isPriority(x: unknown): x is Priority {
  return x === "LOW" || x === "MED" || x === "HIGH";
}

//domain validation , controlla se è un task valido

export function isTask(x: unknown): x is Task {
  if (!isRecord(x)) return false;

  return (
    typeof x.id === "string" &&
    typeof x.title === "string" &&
    typeof x.description === "string" &&
    isStatus(x.status) &&
    isPriority(x.priority)
  );
}

export function isAuditEvent(x: unknown): x is AuditEvent {
  if (!isRecord(x)) return false;

  return (
    typeof x.id === "string" &&
    typeof x.timestamp === "number" &&
    typeof x.type === "string" &&
    isRecord(x.payload)
  );
}

//import/export, controlla se è un payload valido

export type ExportPayloadV1 = {
  version: 1;
  exportedAt: number;
  tasks: Task[];
  credits: number;
  auditEvents?: AuditEvent[];
  welcomeSeen?: boolean;
};

export function isExportPayloadV1(v: unknown): v is ExportPayloadV1 {
  if (!isRecord(v)) return false;

  if (v.version !== 1) return false;
  if (typeof v.exportedAt !== "number") return false;
  if (typeof v.credits !== "number" || v.credits < 0) return false;

  if (!Array.isArray(v.tasks) || !v.tasks.every(isTask)) return false;

  if ("auditEvents" in v && v.auditEvents !== undefined) {
    if (!Array.isArray(v.auditEvents) || !v.auditEvents.every(isAuditEvent)) {
      return false;
    }
  }

  if ("welcomeSeen" in v && v.welcomeSeen !== undefined) {
    if (typeof v.welcomeSeen !== "boolean") return false;
  }

  return true;
}
