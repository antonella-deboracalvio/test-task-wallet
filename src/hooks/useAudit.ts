import { useCallback, useEffect, useState } from "react";
import type { AuditEvent, AuditEventType } from "../types/audit";
import { loadAudit, saveAudit } from "../utils/storage";

export function useAudit() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => loadAudit());

  useEffect(() => {
    saveAudit(auditEvents);
  }, [auditEvents]);

  const pushAudit = useCallback((type: AuditEventType, payload: Record<string, unknown>) => {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      payload,
    };
    setAuditEvents((prev) => [event, ...prev]);
  }, []);

  const clearAudit = useCallback(() => {
    if (confirm("Sei sicur* di voler cancellare tutto lo storico?"))
      setAuditEvents([]);
  }, []);

  return { auditEvents, setAuditEvents, pushAudit, clearAudit };
}
