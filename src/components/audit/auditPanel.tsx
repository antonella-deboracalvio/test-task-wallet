import { useState } from "react";
import type { AuditEvent, AuditEventType } from "../../types/audit";
import { AuditLabels } from "../../types/audit";
import FilterAll from "../filter/filterAll";


const auditOptions = [
  { label: "Tutti", value: "ALL" },
  { label: "Task creati", value: "TASK_CREATED" },
  { label: "Task aggiornati", value: "TASK_UPDATED" },
  { label: "Status modificati", value: "TASK_STATUS_CHANGED" },
  { label: "Task eliminati", value: "TASK_DELETED" },
  { label: "Crediti scalati", value: "WALLET_DEBIT" },
  { label: "Crediti aggiunti", value: "WALLET_CREDIT" },
];


function formatTs(ts: number) {
    return new Intl.DateTimeFormat("it-IT", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(ts));
}

function getPayloadText(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function matchesText(event: AuditEvent, text: string) {
  const q = text.trim().toLowerCase();
  if (!q) return true;

  // cerca anche nel label
  if (AuditLabels[event.type].toLowerCase().includes(q)) return true;

  // cerca nel payload (title, description ..)
  for (const v of Object.values(event.payload)) {
    if (typeof v === "string" && v.toLowerCase().includes(q)) return true;
  }

  return false;
}




export default function AuditPanel({ events }: { events: AuditEvent[] }) {

      // state filtri
  const [typeFilter, setTypeFilter] = useState<AuditEventType | "ALL">("ALL");
  const [textFilter, setTextFilter] = useState("");


// eventi filtrati
  const filteredEvents = events.filter((event) => {
    const matchType = typeFilter === "ALL" || event.type === typeFilter;
    const matchText = matchesText(event, textFilter);
    return matchType && matchText;
  });

    return (
        
        <div className="bg-white rounded-xl shadow p-6">
        <FilterAll
        options={auditOptions}
        selected={typeFilter}
        onSelect={(value) => setTypeFilter(value as AuditEventType | "ALL")}
        search={textFilter}
        onSearch={(value) => setTextFilter(value)}
      />

        
            <p className="text-sm text-slate-500 mb-4">
                {filteredEvents.length} eventi registrati
            </p>
            {filteredEvents.length === 0 ? (
                <div className="text-sm text-slate-500">
                    Nessun evento ancora.
                </div>
            ) : (
                <ul className="space-y-3">
                    {filteredEvents.map((event) => (
                        <li
                            key={event.id}
                            className="border rounded-xl p-4 hover:bg-slate-50 transition"
                        >

                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold">{AuditLabels[event.type]}</h2>

                                    <p className="text-sm font-medium">
                                        {getPayloadText(event.payload, "title")}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {getPayloadText(event.payload, "description")}
                                    </p>

                                    <p className="text-sm text-slate-500">{formatTs(event.timestamp)}</p>


                                </div>
                            </div>


                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    );
}
