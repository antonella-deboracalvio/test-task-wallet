import type { AuditEvent } from "../types/audit";
import type { Task } from "../types/task";


export const STORAGE_KEY = "test.tasks.v1";

// Wallet / Popup keys
export const CREDITS_KEY = "credits";
export const WELCOME_KEY = "welcome_popup";

export const loadTasks = (): Task[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (t) =>
        t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.description === "string"
    );
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};




// wallet credit
export const loadCredits = (defaultValue: number): number => {
  const raw = localStorage.getItem(CREDITS_KEY);
  if (!raw) return defaultValue;

  const n = Number(raw);
  if (!Number.isFinite(n)) return defaultValue;

  // sicurezza: mai sotto 0
  return Math.max(0, n);
};

export const saveCredits = (value: number) => {
  localStorage.setItem(CREDITS_KEY, String(value));
};

// welcome popup
export const loadWelcomeSeen = (): boolean => {
  return localStorage.getItem(WELCOME_KEY) === "1";
};

export const saveWelcomeSeen = () => {
  localStorage.setItem(WELCOME_KEY, "1");
};


// audit
export const AUDIT_KEY = "audit_log";

export const loadAudit = (): AuditEvent[] => {
  const raw = localStorage.getItem(AUDIT_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (e) =>
        e &&
        typeof e.id === "string" &&
        typeof e.timestamp === "number" &&
        typeof e.type === "string" &&
        e.payload &&
        typeof e.payload === "object"
    );
  } catch {
    return [];
  }
};

export const saveAudit = (events: AuditEvent[]) => {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(events));
};
