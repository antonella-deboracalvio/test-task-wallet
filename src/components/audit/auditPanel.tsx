import type { AuditEvent } from "../../types/audit";

function formatTs(ts: number) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

export default function AuditPanel({ events }: { events: AuditEvent[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-slate-500 mb-4">
        {events.length} eventi registrati
      </p>

      {events.length === 0 ? (
        <div className="text-sm text-slate-500">
          Nessun evento ancora.
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="border rounded-xl p-4 bg-slate-50"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{event.type}</span>
                <span className="text-xs text-slate-500">
                  {formatTs(event.timestamp)}
                </span>
              </div>

              <pre className="mt-2 text-xs bg-white rounded-lg p-2 overflow-auto">
                {JSON.stringify(event.payload, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
